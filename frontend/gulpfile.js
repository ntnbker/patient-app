const gulp = require('gulp');
const sass = require('gulp-sass');

// gulp.task('sass', () =>
//     sass('./src/**/*.{scss,sass}')
//         .on('error', sass.logError)
//         .pipe(gulp.dest('src/css/'))
// );

// Compile SCSS to CSS in src/css folder
gulp.task('sass', function() {
	return gulp.src('./src/scss/**/*.{scss,sass}')
	.pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('src/css/'))
})

gulp.task('watch', ['sass'], function () {
  gulp.watch(['./src/**/*.{scss,sass}'], ['sass']);
});

gulp.task('default', ['sass', 'watch'], function () {

});