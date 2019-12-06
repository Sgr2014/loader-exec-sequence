/**
 * node特点：
 * 1. 非阻塞（异步）
 * 2. 事件驱动node
 * 
 */
console.log('hello, nodejs!')
// 全局安装个nodemon，监视文件改动
// 执行报错：nodemon : 无法加载文件 C:\Users\huxub\AppData\Roaming\npm\nodemon.ps1，因为在此系统上禁止运行脚本
// 解决：1.管理员身份打开powerShell；2.执行set-ExecutionPolicy RemoteSigned；3.选择Y/A
console.log('test nodemon')

// 模块
// 内置模块
const os = require('os')
const mem = os.freemem() / os.totalmem() * 100;
console.log(`内存占用率${mem.toFixed(2)}%`)

// 第三方模块，如download-git-repo
const download = require('download-git-repo')
const ora = require('ora')
const process = ora('开始下载...')
process.start()
// github:owner/name or simply owner/name
download('github:snoilednad/front-end-api-test', '../public/download', (err)=> {
    // download success: err是undefined
    if (err) {
        process.fail()
        console.log('download fail')
    } else{
        process.succeed()
        console.log('download success')
    }
})