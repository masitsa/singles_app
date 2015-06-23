/* =========================================== */
/*    GULP                                     */
/* =========================================== */

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload');


/* =========================================== */
/*    PATHS                                    */
/* =========================================== */

var paths = {
    js          : 'assets/js/app.js',
    scss        : 'assets/css/app.scss',

    destJS      : 'assets/js/min',
    destCSS     : 'assets/css',

    watchJS     : 'assets/js/*.js',
    watchSCSS   : 'assets/css/*.scss',
    watchHTML   : '*.html',

    watchGrass       : 'assets/themes/grass/*.scss',
    themeGrass        : 'assets/themes/grass/style.scss',
    destThemeGrass    : 'assets/themes/grass',

    watchTower       : 'assets/themes/tower/*.scss',
    themeTower        : 'assets/themes/tower/style.scss',
    destThemeTower    : 'assets/themes/tower'
};


/* =========================================== */
/*    TASKS                                    */
/* =========================================== */

gulp.task('scripts', function () {
    return gulp.src(paths.js)
        .pipe(uglify({
            mangle      : false,
            output      : {
                beautify    : true,
                comments    : true
            }
        }))
        .pipe(gulp.dest(paths.destJS));
});

gulp.task('styles', function () {
    return sass(paths.scss, { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(paths.destCSS));
});

gulp.task('theme-grass', function () {
    return sass(paths.themeGrass, { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(paths.destThemeGrass));
});

gulp.task('theme-tower', function () {
    return sass(paths.themeTower, { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(paths.destThemeTower));
});


/* =========================================== */
/*    WATCH                                    */
/* =========================================== */

gulp.task('default', function () {
    gulp.watch(paths.watchJS, ['scripts']);
    gulp.watch(paths.watchSCSS, ['styles']);
    gulp.watch(paths.watchGrass, ['theme-grass']);
    gulp.watch(paths.watchTower, ['theme-tower']);
});