const { src, dest, watch, series, parallel } = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const imageMin = require('gulp-imagemin');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglifycss');


//file source path not to repeat
const files={
  scssPath: 'app/scss/*.scss',
  jsPath: 'app/js/**/*.js',
  imgPath:'app/images/**/*'
}

//compile scss file to css
function sassTask(){
   return src(files.scssPath)
  .pipe(sass())
  .pipe(uglify())
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(concat('style.css'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(dest('dist/css'))
}

//minified higher images to small sizes
function imgTask(){
  return src(files.imgPath)
  .pipe(imageMin({
  progressive: true,
  }))
  .pipe(dest('dist/images'))
}

//minifed js with concate method for better files
function jsTask(){
  return src([
    'app/js/test1.js',
    'app/js/test2.js',
  ])
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(rename({ suffix: '.min' }))
  .pipe(dest('dist/js'))
}


// Watch task: watch SCSS and JS files for changes // If any change, run scss and js tasks simultaneously
function watchTask(){
  watch([files.scssPath,files.imgPath,files.jsPath],
  {interval: 1000, usePolling: true},
  series(
  parallel(sassTask,imgTask,jsTask),
  )
  );
}
// Export the default Gulp task so it can be run // Runs the scss and js tasks simultaneously // then runs cacheBust, then watch task
exports.default = series(
  parallel(sassTask,imgTask,jsTask), 
  watchTask
);