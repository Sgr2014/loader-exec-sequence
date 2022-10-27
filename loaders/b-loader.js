const loaderUtils = require('loader-utils')

module.exports = function(source) {
  console.log('exec b loader...')

  const url = loaderUtils.interpolateName(this, '[name].[ext]', source)
  console.log(url)
  // 会生成一个[name].[ext]文件
  this.emitFile(url, source)
  
  return source
}