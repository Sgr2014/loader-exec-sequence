const loaderUtils = require('loader-utils')
const fs = require('fs')
const path = require('path')

module.exports = function (source) {

  const { name } = loaderUtils.getOptions(this)
  console.log('name:' + name)

  // 缓存
  this.cacheable(false)

  const json = JSON.stringify(source)
  .replace('John', 'John Bull')

  // 抛出异常
  // throw new Error('error...')
  // this.callback(new Error('error...'), json)
  // this.callback(null, json, 1, 2, 3)

  // 异步
  const callback = this.async()
  fs.readFile(path.join(__dirname, '../src/async.text'), 'utf-8', (err, data) => {
    callback(null, data)
  })

  return `export default ${json}`
}