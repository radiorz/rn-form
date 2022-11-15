
/**
 *  打包svg图,生成rn可以显示的类型
 *  使用 执行 node getSvg ,会在当前文件生成 svgs.js文件,引用可以显示svg
*/
var fs = require('fs');
var path = require('path');
const svgDir = path.resolve(__dirname, './svgs');

// 读取单个文件
function readfile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(svgDir, filename), 'utf8', function(err, data) {
      console.log(data.replace(/<\?xml.*?\?>|<\!--.*?-->|<!DOCTYPE.*?>/g, ''));
      if (err) reject(err);
      resolve({
        [filename.slice(0, filename.lastIndexOf('.'))]: data,
      });
    });
  });
}

// 读取SVG文件夹下所有svg
function readSvgs() {
  return new Promise((resolve, reject) => {
   fs.readdir(svgDir, function(err, files) {
     if (err) reject(err);
     Promise.all(files.map(filename => readfile(filename)))
      .then(data => resolve(data))
      .catch(err => reject(err));
   });
  });
}

// 生成js文件
readSvgs().then(data => {
  let svgFile = 'export default ' + JSON.stringify(Object.assign.apply(this, data));
  fs.writeFile(path.resolve(__dirname, './index.js'), svgFile, function(err) {
    if(err) throw new Error(err);
  })
}).catch(err => {
    throw new Error(err);
  });