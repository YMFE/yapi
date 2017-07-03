const fs = require('fs-extra');
const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const nodemon = require('nodemon');
const dist   = './server_dist/'

gulp.task('default', ['clearLib', 'compileJS']);

gulp.task('clearLib', [], function() {
    return fs.removeSync(dist)
});

gulp.task('compileJS', ['clearLib'], function() {
	var babelProcess = babel({
        presets: ['es2015',  "stage-3"],
        plugins: ['transform-runtime']
    })

    babelProcess.on('error', function(e) {
        console.log(e);
        process.exit(1);
    });

    gulp.src('server/**/*.!(js)').pipe(gulp.dest(dist));
    

    return watch(['server/**/*.js'], {
        verbose: true,
        ignoreInitial: false
    }).pipe(babelProcess).pipe(gulp.dest(dist));
})