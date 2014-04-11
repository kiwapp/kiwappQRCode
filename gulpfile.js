var gulp          = require('gulp'),
    browserify    = require('gulp-browserify'),
    rename        = require('gulp-rename'),
    jshint        = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    footer        = require('gulp-footer'),
    fs            = require('fs');

gulp.task('browserifyKiwappQRCode', function(){
    fs.readFile('dev/kiwappQRCode/version.js', 'utf8', function (err,data) {
        var version = data.split('\'')[1].replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
      gulp.src('./dev/kiwappQRCode/kiwappQRCode.js')
        .pipe(browserify())
        .pipe(rename('kiwappQRCode.js'))
        .pipe(footer(';'))
        .pipe(gulp.dest('.'));
    });

});

gulp.task('checkKiwappQRCode', function () {
  return gulp.src(['./dev/kiwappQRCode/**/*.js', './dev/utils/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(jshintStylish));
});

gulp.task('default', function(){
    gulp.run('checkKiwappQRCode');
    gulp.run('browserifyKiwappQRCode');
});


gulp.task('watch', function(){
    gulp.watch( './dev/**/*.js',function(evt){
        console.log(evt.path, 'changed');
        gulp.run('default');
    });
});