'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

/* BrowserSync */
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: "build"
    },
    notify: false
  });

  gulp.watch('build/**/*.*').on('change', browserSync.reload);
});


gulp.task('html', () => {
  return gulp.src('source/*.html')
  .pipe(browserSync.reload({ stream: true }))
  .pipe(gulp.dest('build'));
});

/* Styles compile */
gulp.task('sass', () => {
  return gulp.src('source/scss/main.scss')
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'Styles',
          message: err.message
        }
      })
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename({
      suffix: '.min',
      prefix: ''
    }))
    // .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'));
});

/* Scripts compile */
gulp.task('scripts', () => {
  return gulp.src([
      'source/libs/jquery.min.js',
      'source/js/main.js'
     ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
});

gulp.task('clean', () => {
  return del('build');
});

gulp.task('copy:fonts', () => {
  return gulp.src('source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('copy:images', () => {
  return gulp.src('source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

gulp.task('copy:html', () => {
  return gulp.src('source/*.html', {since: gulp.lastRun('copy:html')})
    .pipe(gulp.dest('build'));
});

gulp.task('watch', () => {
  gulp.watch('source/*.html', gulp.series('html'));
  gulp.watch('source/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('source/js/**/*.js', gulp.series('scripts'));
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('sass', 'scripts', 'copy:html', 'copy:fonts', 'copy:images'),
  gulp.parallel('watch', 'browser-sync')
));