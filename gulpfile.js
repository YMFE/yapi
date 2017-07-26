const fs = require('fs-extra');
const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const ora = require('ora');
const chalk = require('chalk');
const { spawn } = require('child_process');
let spinner = ora('请稍等...').start();
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
    const command = spawn(cmd, args, opts);

    command.stdout.on('data', data => {
        output('log', `${cmd}: ${data.toString()}`, true);
    });

    command.stderr.on('data', data => {
        output('log', `${cmd}: ${data.toString()}`, true);
    });

    command.on('close', code => {
        if (code !== 0) {
            output('log', `${cmd}: ${data.toString()}`);
        }
    });
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

gulp.task('removeDist', [], function () {
    return fs.removeSync(DIST)
});

gulp.task('initialBuild', ['removeDist'], () => {
    spinner.text = '初始编译...';

    return gulp.src(SRC)
        .pipe(generateBabel())
        .pipe(gulp.dest(DIST))
        .on('end', () => {
            output('success', '初始编译成功！');
            spinner = ora({
                text: '等待文件变更...',
                spinner: 'pong',
                color: 'green'
            }).start();

            excuteCmd('node_modules/.bin/nodemon', ['-q', 'server_dist/app.js', 'dev'], {
                cwd: __dirname
            });

            excuteCmd('ykit', ['s', '-p', '4000'], {
                cwd: path.resolve(__dirname, '../')
            });
        });
});

gulp.task('default', ['initialBuild'], () => {
    gulp.watch(SRC, (event) => {
        spinner.text = `正在编译 ${event.path}...`;

        gulp.src(event.path).pipe(generateBabel())
            .pipe(gulp.dest(DIST)).on('end', () => {
                output('success', `成功编译 ${event.path}`);
                spinner = ora({
                    text: 'waiting changes...',
                    spinner: 'pong',
                    color: 'green'
                });
                spinner.start();
            });
    });
});

gulp.task('build', () => {
    let status = {
        count: 0
    };
    let ykitOutput = '';

    spinner.text = '正在编译...';

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