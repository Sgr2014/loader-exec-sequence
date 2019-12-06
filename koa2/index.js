/**
 * Koa
 * 致力于更小、更富表现力、更健壮的Web框架
 * 由Express原班人马打造
 * 
 */
const Koa = require('koa')
const app = new Koa()

app.use((ctx, next)=> {
    ctx.body = [{
        name: 'Tom'
    }]
    next() // 执行下一个
})

app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(3000);