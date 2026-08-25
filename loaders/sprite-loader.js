const spritesmith = require('spritesmith')
const fs = require('fs')
const path = require('path')

module.exports = function (source) {
  const callback = this.async()
  const distDir = path.join(process.cwd(), 'dist')

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
  }

  const imgs = source.match(/url\(\.\/imgs\/\w*\.jpg/g)
  if (!imgs) {
    return callback(null, source)
  }

  const matchedImgs = []
  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i].match(/\/imgs\/sprite\w+\.jpg/g)[0]
    matchedImgs.push(path.join(__dirname, '../src', img))
  }

  spritesmith.run({ src: matchedImgs }, (err, result) => {
    if (err) {
      return callback(err)
    }

    fs.writeFileSync(path.join(distDir, 'sprite.jpg'), result.image)

    const classMatches = source.match(/\.[a-zA-Z0-9_-]+(?=\s*\{)/g) || []
    const coordByNormPath = {}
    for (const [key, value] of Object.entries(result.coordinates)) {
      coordByNormPath[path.normalize(key)] = value
    }

    const cssRules = []
    const classNames = []

    matchedImgs.forEach((absPath, index) => {
      const coord = coordByNormPath[path.normalize(absPath)]
      if (!coord) {
        return
      }

      const className = (classMatches[index] || `.sprite-${index}`).replace(/^\./, '')
      classNames.push({ className, coord })

      cssRules.push(`.${className} {
        width: ${coord.width}px;
        height: ${coord.height}px;
        background-image: url(sprite.jpg);
        background-position: -${coord.x}px -${coord.y}px;
        background-repeat: no-repeat;
      }`)
    })

    const css = cssRules.join('\n\n') + '\n'
    fs.writeFileSync(path.join(distDir, 'index.css'), css)

    const scale = 0.25
    const cards = classNames.map(({ className, coord }) => {
      const displayW = Math.round(coord.width * scale)
      const displayH = Math.round(coord.height * scale)
      const sheetW = Math.round(result.properties.width * scale)
      const sheetH = Math.round(result.properties.height * scale)
      const posX = Math.round(coord.x * scale)
      const posY = Math.round(coord.y * scale)

      return `<div class="card">
      <h2>.${className}（裁切区域）</h2>
      <div class="crop" style="
        width: ${displayW}px;
        height: ${displayH}px;
        background-image: url(sprite.jpg);
        background-size: ${sheetW}px ${sheetH}px;
        background-position: -${posX}px -${posY}px;
        background-repeat: no-repeat;
      "></div>
    </div>`
    }).join('\n')

    const previewHtml = `<!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sprite Preview</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 32px;
            font-family: "Segoe UI", system-ui, sans-serif;
            background: #0f1419;
            color: #e7ecf3;
          }
          h1 { font-size: 22px; font-weight: 600; margin: 0 0 8px; }
          p { margin: 0 0 28px; color: #9aa7b8; line-height: 1.5; }
          .grid {
            display: grid;
            gap: 24px;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            align-items: start;
          }
          .card {
            background: #1a2330;
            border: 1px solid #2a3648;
            border-radius: 12px;
            padding: 16px;
          }
          .card h2 {
            margin: 0 0 12px;
            font-size: 14px;
            font-weight: 500;
            color: #9aa7b8;
          }
          .full-sprite {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            display: block;
          }
          .crop {
            border-radius: 8px;
            border: 1px solid #2a3648;
          }
        </style>
      </head>
      <body>
        <h1>雪碧图预览</h1>
        <p>上方为整张合成图；下方为各 class 通过 background-position 裁切出的区域（预览已缩小）。</p>
        <div class="grid">
          <div class="card" style="grid-column: 1 / -1;">
            <h2>合成后的 sprite.jpg</h2>
            <img class="full-sprite" src="sprite.jpg" alt="sprite" />
          </div>
          ${cards}
        </div>
      </body>
    </html>
    `

    fs.writeFileSync(path.join(distDir, 'preview.html'), previewHtml)
    callback(null, css)
  })
}
