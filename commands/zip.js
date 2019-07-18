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
// const babel = require('gulp-babel');
const path = require('path');
const chalk = require('chalk');
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
  let src = path.resolve(filePath, fileName + '.js');
  return new Promise((resolve, reject) => {
    gulp.src(src)
    // .pipe(babel({  //TODO babel编译必须在项目下安装，这点暂时没有解决
    //     "presets": [
    //       "@babel/env"
    //     ],
    //     "sourceType":"script"
    //   }
    // ))
    // .on('error', function(err) {
    //   console.log('Less Error!', err.message);
    //   this.end();
    // })
      .pipe(uglify())
      .on('error', function (err) {
        reject(err);
      })
      .pipe(rename('frame.js'))
      .pipe(zip(zipName))
      .pipe(gulp.dest(destPath))
      .on('end', () => {
        resolve();
      });
  });
};

/**
 * 打包图层面板包
 */
module.exports = () => {
  let filePath = './src/';
  return readdir(filePath).then((arr) => {
    return Promise.all(arr.map((fileName) => {
      return zipFrame(fileName, filePath);
    })).then(() => {
      console.log(`${chalk.green('压缩成功')}`);
    });
  }, () => {
    console.log(`${chalk.red('没有找到文件')}`);
  }).catch((err) => {
    console.log(`${chalk.red(err)}`);
  });
};
