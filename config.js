const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
    paths: {
        src: './src/',
        dist: './_dist/',
    },
    sass: {
        outputStyle: 'expanded',
    },
    rename: {
        suffix: '.min',
    },
    postcss: [
        autoprefixer(),
        cssnano(),
    ],
    browserSync: {
        port: 3000,
        server: {
            baseDir: './_dist/',
        },
    }
};
