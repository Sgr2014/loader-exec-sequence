const spritesmith = require('spritesmith')
const fs = require('fs')
const path = require('path')

module.exports = function (source) {
  // 异步
  const callback = this.async()

  // 匹配需要合并的图片
  const imgs = source.match(/url\(\.\/imgs\/\w*\.jpg/g)
  const matchedImgs = []
  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i].match(/\/imgs\/sprite\w+\.jpg/g)[0]
    matchedImgs.push(path.join(__dirname, '../src', img))
  }
  
  spritesmith.run({src: matchedImgs}, (err, result) => {
    // 合成新的图片
    fs.writeFileSync(path.join(process.cwd(), 'dist/sprite.jpg'), result.image)
    // 替换新生成的图片地址，并生成新的样式文件
    source = source.replace(/url\(\.\/imgs\/\w*\.jpg\)/g, () => {
      return 'url("dist/sprite.jpg")'
    })
    fs.writeFileSync(path.join(process.cwd(), 'dist/index.css'), source)

    // 返回处理后的资源
    callback(null, source)
  })
}
