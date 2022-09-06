const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const purgecss = require('gulp-purgecss')

function buildStyles() {
  return src('Sass/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(purgecss({ content: ['dist/*.html'] }))
    .pipe(dest('dist/css'))
}

function watchTask() {
  watch(['Sass/**/*.scss', 'dist/*.html'], buildStyles)
}

exports.default = series(buildStyles, watchTask)
