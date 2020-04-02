'use strict';

const browsersync = require('browser-sync').create();
const del = require('del');
const gulp = require('gulp');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const config = require('./config.js');

function browserSync(done) {
    browsersync.init(config.browserSync);
    done();
}

function browserSyncReload(done) {
    browsersync.reload();
    done();
}

function clean() {
    return del([`${config.paths.dist}assets/`]);
}

function images() {
    return gulp
        .src(`${config.paths.src}img/**/*`)
        .pipe(newer(`${config.paths.dist}assets/img`))
        .pipe(gulp.dest(`${config.paths.dist}assets/img`));
}

function css() {
    return gulp
        .src(`${config.paths.src}scss/**/*.scss`)
        .pipe(plumber())
        .pipe(sass(config.sass))
        .pipe(gulp.dest(`${config.paths.dist}assets/css`))
        .pipe(rename(config.rename))
        .pipe(postcss(config.postcss))
        .pipe(gulp.dest(`${config.paths.dist}assets/css`))
        .pipe(browsersync.stream());
}

function html() {
    return gulp
        .src(`${config.paths.src}**/*.html`)
        .pipe(plumber())
        .pipe(gulp.dest(`${config.paths.dist}`))
        .pipe(browsersync.stream());
}

function watchFiles() {
    gulp.watch(`${config.paths.src}scss/**/*.scss`, css);
    gulp.watch(`${config.paths.src}img/**/*`, images);
    gulp.watch(`${config.paths.src}**/*.html`, html);
    gulp.watch(
        [`${config.paths.src}**/*`],
        gulp.series(browserSyncReload)
    );
}

const build = gulp.series(clean, gulp.parallel(html, css, images))
const watch = gulp.parallel(clean, watchFiles, browserSync);

exports.images = images;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = build;
