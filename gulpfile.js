var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('build', function () {
    return browserify({entries: './script/app.js', debug: true})
        .transform('babelify', {presets: ['es2015']})
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./public/compiled/js'));
});

gulp.task('css', function () {
    var postcss    = require('gulp-postcss');
    var sourcemaps = require('gulp-sourcemaps');
    var rucksack = require('rucksack-css');
    var autoprefixer = require('autoprefixer');

    return gulp.src('./style/**/*.css')
        .pipe( sourcemaps.init() )
        .pipe( postcss([ rucksack(),  autoprefixer({
        	browsers: ['last 10 versions']
        })]) )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest('./public/compiled/css') );
});

gulp.task('watch', function () {
   gulp.watch('./style/**/*.css', ['css']);
   gulp.watch('./script/**/*.js', ['build']);
});