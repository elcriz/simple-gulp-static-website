'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');

sass.compiler = require('node-sass');

const settings = {
    src: {
        scss: ['src/scss/**/*.scss'],
        html: ['src/**/*.html'],
    },
    dist:{
        css: 'dist/css/',
        html: 'dist/',
        suffix: '.min',
    },
    compileSCSSOnWatch: true,
    keepSpecialComments: 0,
};

const minifyCss = () => {
    let stream = {};

    stream = gulp.src(`${settigs.dist.css}main.css`)
        .pipe(cleanCSS({ keepSpecialComments: settings.keepSpecialComments }))
        .pipe(rename({ suffix: settings.dist.suffix }))
        .pipe(gulp.dest(settings.dist.css));

    stream.on('end', () => {
        gutil.log('Minified css');
    });
}

const compileScss = (shouldMinify) => {
    let hasCompileError = false;
	let stream = {};

	stream = gulp.src(settings.src.scss)
        .pipe(sass({outputStyle: 'expanded'}).on('error', function(error) {
			hasCompileError = true;
			sass.logError.bind(this)(error);
		}))
        .pipe(gulp.dest(settings.dist.css));

	stream.on('end', function() {
		if (!hasCompileError) {
			gutil.log('Compiled SCSS to CSS');

			if (shouldMinify) {
				minifyCss();
			}
		}
	});    
}

// gulp.task('watchScss', () => {
const watchScss = (cb) => {
    const scssWatcher = gulp.watch(settigs.src.scss, () => {
        if (settings.compileSCSSOnWatch) {
            compileScss(false);
        }
    });

    scssWatcher.on('change', ({ path }) => {
        gutil.log(`Change in ${path}`);
    });
    cb();
};

gulp.task('buildCss', () => {
	compileScss(true);
});

gulp.task('watchHtml', () => {
    let stream = {};

    stream = gulp.src(settings.src.html)
        .pipe(gulp.dest(settings.dest.html));
});

gulp.task('watch', gulp.series(watchScss));
gulp.task('build', ['buildCss']);
