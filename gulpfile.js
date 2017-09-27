const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const less = require('gulp-less')
const cssnano = require('gulp-cssnano')
const rename = require('gulp-rename')
const concat = require('gulp-concat')

const browserify = require('browserify')

const dotenv = require('dotenv')
const nodemon = require('nodemon')
const source = require('vinyl-source-stream')

const isProd = [ process.env.NODE_ENV, process.env.GULP_ENV ].indexOf('production') !== -1

const jsBuild = (entry, buildName) => {
  const basedir = path.dirname(entry)
  const name = path.basename(entry)

  const task = browserify({
    entries: [ name ],
    basedir: basedir
  })

  task.transform({
    // global: isProd,
    // sourceMaps: isProd
  }, 'babelify')

  return task.bundle()
  .pipe(source(buildName))
  .pipe(gulp.dest('./dist'))
}

gulp.task('build:js:web3', () => jsBuild('./src/web3/index.js', 'web3.js'))
gulp.task('build:js:dopplr', () => jsBuild('./src/dopplr/index.js', 'dopplr.js'))
gulp.task('build:js:start', () => jsBuild('./src/start.js', 'start.js'))

gulp.task('copy:assets', () => {
  return gulp.src('./assets/**/*')
  .pipe(gulp.dest('./dist'))
})

gulp.task('copy:vendor:js', function () {
  return gulp.src([
    './node_modules/vue/dist/vue.min.js',
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js'
  ])
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('./dist'))
})

gulp.task('build:less', () => {
  const task = gulp.src('./less/style.less')
  .pipe(less())

  if (isProd) {
    task.pipe(cssnano())
  }

  return task
  .pipe(rename('style.css'))
  .pipe(gulp.dest('./dist'))
})

gulp.task('nodemon', () => {
  const config = dotenv.parse(fs.readFileSync('./.env'))

  const monitor = nodemon({
    'script': 'index.js',
    'restartable': 'rs',
    'ignore': [
      '.git',
      'node_modules',
      'bower_components',
      'dist',
      'less',
      'src'
    ],
    'verbose': false,
    'execMap': {
      'js': 'node'
    },
    'watch': [
      'server/**/*.js',
      'server/**/*.njk'
    ],
    'env': config,
    'ext': 'js njk'
  })

  monitor.on('log', function (log) {
    console.log(log.message)
  })

  process.once('SIGINT', function () {
    monitor.once('exit', function () {
      process.exit()
    })
  })
})

gulp.task('build:js', [ 'build:js:web3', 'build:js:dopplr', 'build:js:start' ])

gulp.task('watch:assets', () => gulp.watch('./assets/**/*', [ 'copy:assets' ]))
gulp.task('watch:js', () => gulp.watch('./src/**/*.js', [ 'build:js' ]))
gulp.task('watch:less', () => gulp.watch('./less/*.less', [ 'build:less' ]))

gulp.task('copy', [ 'copy:assets', 'copy:vendor:js' ])
gulp.task('watch', [ 'watch:js', 'watch:less', 'watch:assets' ])
gulp.task('build', [ 'build:js', 'build:less', 'copy' ])
gulp.task('default', [ 'build', 'watch', 'nodemon' ])
