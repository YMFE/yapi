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
    const babelProcess = babel({
        presets: ['es2015', "stage-3"],
        plugins: ['transform-runtime']
    });

    babelProcess.on('error', function (e) {
        const restart = status ? status.count < 2 : true;

        console.error(e);
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
        output('log', `${NAME} ${data.toString()}`, true);
    });

    return command;
}

function output(type, message, restart = false) {
    spinner.stop();

    if (type === 'success') {
        message = '✔ ' + message;
        console.log(chalk.green(message));
    } else if (type === 'error') {
        message = '✖ ' + message;
        console.log(chalk.red(message));
    } else {
        console.log(message);
    }
    if (restart) {
        spinner.start();
    }
}

function waitingSpinner() {
    spinner = ora({
        text: '等待文件变更...',
        spinner: 'circleQuarters',
        color: 'cyan'
    }).start();
}

gulp.task('removeDist', [], function () {
    return fs.removeSync(DIST)
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
                cwd: path.resolve(__dirname, '../')
            });
        });
});

gulp.task('default', ['initialBuild'], () => {
    gulp.watch(SRC, (event) => {
        let originFilePath = path.relative(path.join(__dirname, 'server'), event.path)
        let distPath = path.resolve(DIST, path.join(originFilePath))
        spinner.text = `正在编译 ${event.path}...`;

        gulp.src(event.path).pipe(generateBabel())
            .pipe(gulp.dest(path.parse(distPath).dir)).on('end', () => {
                output('success', `成功编译 ${originFilePath}`);
                output('success', '正在重启服务器...');
                waitingSpinner();
            });
    });
});

gulp.task('buildNode', () => {
    return gulp.src(SRC)
        .pipe(generateBabel())
        .pipe(gulp.dest(DIST));
});

gulp.task('watchNode', ['buildNode'], () => {
    return watch(SRC, {
        verbose: true,
        ignoreInitial: false
    })
        .pipe(generateBabel())
        .pipe(gulp.dest(DIST));
});

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