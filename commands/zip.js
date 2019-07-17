/**
 * 此类专门用来压缩图层面板包
 * @author jw
 * @date 2017-04-01
 */
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');
const rename = require('gulp-rename');
const dateFormat = require('dateformat');
const fs = require('fs');
const utils = require('util');
const readdir = utils.promisify(fs.readdir);
const babel = require('gulp-babel');
/**
 * @param {String} fileName 要压缩的js文件名称
 * @param {String} filePath 要压缩的js文件路径
 * @param {String} destPath 压缩后的zip包路径
 * @author jw
 * @date 2017-04-01
 */
let zipFrame = function (fileName, filePath, destPath = 'dist') {
  if (fileName.endsWith('.js')) {
    fileName = fileName.substring(0, fileName.length - 3);
  }
  let zipName = fileName + '_' + dateFormat(new Date(), 'yyyymmdd') + '.zip';
  return gulp.src([filePath + fileName + '.js'])
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename('frame.js'))
    .pipe(zip(zipName))
    .pipe(gulp.dest(destPath));
};

/**
 * 打包图层面板包
 */
module.exports = () => {
  let filePath = './src/';
  return readdir(filePath).then((arr) => {
    return Promise.all(arr.map((fileName) => {
      return zipFrame(fileName, filePath);
    }));
  }, ()=>{
    console.log('没有找到文件');
  });
};
