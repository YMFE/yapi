const fs = require('fs-extra');
const path = require('path');
const gulp = require('gulp');
const watch = require('gulp-watch');
const babel = require('gulp-babel');
const ora = require('ora');
const chalk = require('chalk');
const { spawn } = require('child_process');
let spinner = null;
const DIST = 'server_dist/';
const SRC = 'server/**/*.js';

function generateBabel(status) {

    // 返回一个新的 babel 插件
    const babelProcess = babel({
        presets: ['es2015', 'stage-3'],
        plugins: ['transform-runtime']
    });

    babelProcess.on('error', function (e) {
        const restart = status ? status.count < 2 : true;

        console.error(e);  // eslint-disable-line
        output('error', 'babel 编译失败！', restart);

        if (status) {
            status.count++;
        }
    });

    return babelProcess;
}

function excuteCmd(cmd, args, opts) {
    const NAME = cmd === 'ykit' ? chalk.cyan('[ykit]') : chalk.blue('[dev-server]');
    let command = spawn(cmd, args, opts);

    command.stdout.on('data', data => {
        output('log', `${NAME} ${data.toString()}`, true);
    });

    command.stderr.on('data', data => {
        const message = data.toString();

        output('log', `${NAME} ${message}`, true);

        // ykit 成功编译时会输出带有 build complete 字样的 log
        // 此时停止正在编译的提示
        // 换为等待文件变更的提示
        if (~message.indexOf('building complete')) {
            waitingSpinner();
        }
    });

    return command;
}

function output(type, message, restart = false) {
    spinner.stop();

    if (type === 'success') {
        message = '✔ ' + message;
        console.log(chalk.green(message));  // eslint-disable-line
    } else if (type === 'error') {
        message = '✖ ' + message;
        console.log(chalk.red(message));  // eslint-disable-line
    } else {
        console.log(message);  // eslint-disable-line
    }
    if (restart) {
        spinner.start();
    }
}

function waitingSpinner() {
    spinner.stop();
    spinner = ora({
        text: '等待文件变更...',
        spinner: 'circleQuarters',
        color: 'cyan'
    }).start();
}

gulp.task('removeDist', [], function () {
    return fs.removeSync(DIST);
});

gulp.task('initialBuild', ['removeDist'], () => {
    spinner = ora('初始编译...').start();

    return gulp.src(SRC)
        .pipe(generateBabel())
        .pipe(gulp.dest(DIST))
        .on('end', () => {
            output('success', '初始编译成功！');
            waitingSpinner();

            excuteCmd('node_modules/.bin/nodemon', ['-q', 'server_dist/app.js'], {
                cwd: __dirname
            });

            excuteCmd('ykit', ['s', '-p', '4000'], {
                cwd: path.resolve(__dirname, './')
            });
        });
});

gulp.task('default', ['initialBuild'], () => {

    // 若 client/ 下的文件发生变动则显示正在编译的提示
    // 并在编译完成之后停止
    gulp.watch('client/**/*', event => {
        spinner.stop();
        spinner = ora(`正在编译 ${event.path}`).start();
    });

    gulp.watch(SRC, event => {

        // 获取变更文件相对于 server/ 的路径
        // 此路径用于 gulp.dest() 写入新文件
        let originFilePath = path.relative(path.join(__dirname, 'server'), event.path);
        let distPath = path.resolve(DIST, path.join(originFilePath));

        // 编译提示
        spinner.text = `正在编译 ${event.path}...`;

        gulp.src(event.path).pipe(generateBabel())
            .pipe(gulp.dest(path.parse(distPath).dir)).on('end', () => {
                output('success', `成功编译 ${originFilePath}`);
                output('success', '正在重启服务器...');
                waitingSpinner();
            });
    });
});

// 全量编译后端代码
gulp.task('buildNode', () => {
    return gulp.src(SRC)
        .pipe(generateBabel())
        .pipe(gulp.dest(DIST));
});

// 仅监测后端代码并实时编译
gulp.task('watchNode', ['buildNode'], () => {
    return watch(SRC, {
        verbose: true,
        ignoreInitial: false
    })
        .pipe(generateBabel())
        .pipe(gulp.dest(DIST));
});

// 编译前后端
gulp.task('build', () => {
    let status = {
        count: 0
    };
    let ykitOutput = '';

    spinner = ora('正在编译，请稍等...').start();

    gulp.src(SRC)
        .pipe(generateBabel(status))
        .pipe(gulp.dest(DIST))
        .on('error', (err) => {
            status.count++;
            output('error', err, status.count < 2);
        })
        .on('end', () => {
            status.count++;
            output('success', '后端编译成功！', status.count < 2);
        });

    const ykitBuild = spawn('ykit', ['pack', '-m'], {
        cwd: __dirname
    });

    ykitBuild.stderr.on('data', data => {
        ykitOutput += data.toString();
    });

    ykitBuild.stdout.on('data', data => {
        ykitOutput += data.toString();
    });

    ykitBuild.on('close', code => {
        if (code === 0) {
            status.count++;
            output('success', '前端编译成功！', status.count < 2);
        } else {
            status.count++;
            output('error', '前端编译失败！', status.count < 2);
            output('log', ykitOutput);
        }
    });
});