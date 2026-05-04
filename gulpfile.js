const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer').default; // ✅ Исправлено
const cleanCss = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const { deleteAsync } = require('del'); // ✅ Исправлено

const paths = {
  scss: 'src/scss/**/*.scss',
  html: 'src/**/*.html',
  js: 'src/js/**/*.js',
  dist: 'dist'
};

function clean() {
  return deleteAsync([paths.dist]);
}

function styles() {
  return src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCss({ level: 2 }))
    .pipe(dest(paths.dist))
    .pipe(browserSync.stream());
}

function html() {
  return src(paths.html)
    .pipe(dest(paths.dist))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(paths.js)
    .pipe(dest(paths.dist))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: { baseDir: paths.dist },
    open: false,
    notify: false
  });

  watch(paths.scss, styles);
  watch(paths.html, html);
  watch(paths.js, scripts);
}

exports.clean = clean;
exports.styles = styles;
exports.html = html;
exports.scripts = scripts;
exports.serve = serve;

exports.default = series(clean, parallel(html, styles, scripts), serve);