const { runLoaders } = require('loader-runner')
const path = require('path')
const fs = require('fs')

// 功能 3 / 4：雪碧图 Loader 独立调试（sprite-loader）
runLoaders({
  resource: './src/sprite.css',
  loaders: [path.resolve(__dirname, './loaders/sprite-loader.js')],
  readResource: fs.readFile.bind(fs)
}, (err, result) => {
  err ? console.error(err) : console.log(result)
})
