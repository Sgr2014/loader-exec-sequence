const { runLoaders } = require('loader-runner')
const path = require('path')
const fs = require('fs')

// 功能 2：同步 / 异步 Loader 示例（raw-loader）
runLoaders({
  resource: './src/raw.text',
  loaders: [
    {
      loader: path.resolve(__dirname, './loaders/raw-loader.js'),
      options: {
        name: 'test'
      }
    }
  ],
  readResource: fs.readFile.bind(fs)
}, (err, result) => {
  err ? console.error(err) : console.log(result)
})
