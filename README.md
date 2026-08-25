# loader-exec-sequence

Webpack **自定义 Loader** 学习示例。各功能入口独立，无需改配置切换。

## 功能 × 命令

| # | 功能 | 命令 | 入口文件 |
|---|------|------|----------|
| 1 | Loader 执行顺序 | `npm run build` | `webpack.config.js` |
| 2 | 同步 / 异步处理 | `npm run demo:raw` | `run-raw-loader.js` |
| 3 | 雪碧图合成 | `npm run demo:sprite` | `run-sprite-loader.js` |
| 4 | 雪碧图预览 | `npm run preview:sprite` | `run-sprite-loader.js` + 打开预览页 |

等价写法：

```bash
npm run build              # = webpack
npm run demo:raw           # = node run-raw-loader.js
npm run demo:sprite        # = node run-sprite-loader.js
npm run preview:sprite     # = node run-sprite-loader.js && start dist/preview.html
```

## 快速开始

```bash
# 安装依赖（推荐 pnpm；也可用 npm / yarn）
pnpm install
# 或: npm install

# 1. 观察 Loader 执行顺序
npm run build

# 2. 同步 / 异步 Loader（raw-loader）
npm run demo:raw

# 3. 雪碧图合成（sprite-loader）
npm run demo:sprite

# 4. 雪碧图合成并打开预览页（Windows）
npm run preview:sprite
```

产物目录：`dist/`（已加入 `.gitignore`）。

### 雪碧图预览产物

执行 `npm run demo:sprite` 或 `npm run preview:sprite` 后：

| 文件 | 说明 |
|------|------|
| `dist/preview.html` | 浏览器预览（整图 + 各 class 裁切区域） |
| `dist/sprite.jpg` | 合成后的雪碧图 |
| `dist/index.css` | 带 `background-position` 的样式 |

## 核心结论

Webpack 对同一资源配置多个 Loader 时：

| 阶段 | 方向 | 说明 |
|------|------|------|
| Pitch | 从左到右 | `use` 数组从前到后 |
| Normal（真正处理源码） | 从右到左 | `use` 数组从后到前 |

本仓库 `webpack.config.js` 中：

```js
use: [
  './loaders/a-loader.js',  // 后执行
  './loaders/b-loader.js'   // 先执行
]
```

`npm run build` 时控制台会先打印 `exec b loader...`，再打印 `exec a loader...`。

## 环境要求

- Node.js 14+
- npm / pnpm / yarn 均可（本仓库含 `pnpm-lock.yaml`，推荐 pnpm）

## 项目结构

```
.
├── loaders/
│   ├── a-loader.js          # 同步透传，用于观察执行顺序
│   ├── b-loader.js          # 同步透传 + emitFile
│   ├── raw-loader.js        # 选项 / 异步 / 缓存 / callback
│   └── sprite-loader.js     # 雪碧图合成 + 预览页生成
├── src/
│   ├── index.js             # Webpack 入口
│   ├── raw.text             # raw-loader 示例资源
│   ├── async.text           # raw-loader 异步读取资源
│   ├── sprite.css           # sprite-loader 示例样式
│   └── imgs/                # 待合并的 JPG
├── webpack.config.js        # 功能 1：a / b loader 执行顺序
├── run-raw-loader.js        # 功能 2：独立跑 raw-loader
├── run-sprite-loader.js     # 功能 3 / 4：独立跑 sprite-loader
└── package.json
```

## 运行方式说明

### 1. Webpack 构建（功能 1）

```bash
npm run build
```

编译 `src/index.js`，对 `.js` 依次执行 `b-loader` → `a-loader`。

`b-loader` 还会通过 `this.emitFile` 把源文件写出到 `dist/`。

### 2. 独立调试 raw-loader（功能 2）

```bash
npm run demo:raw
```

入口：`run-raw-loader.js`，处理 `src/raw.text`。控制台会打印 options（`name: test`）以及 loader-runner 的结果。

### 3. 独立调试 sprite-loader（功能 3 / 4）

```bash
npm run demo:sprite       # 只生成产物
npm run preview:sprite    # 生成并打开 dist/preview.html
```

入口：`run-sprite-loader.js`，处理 `src/sprite.css`。成功后得到：

- `dist/sprite.jpg`
- `dist/index.css`（含 `background-position`）
- `dist/preview.html`

以上入口均基于 [loader-runner](https://github.com/webpack/loader-runner)，无需启动完整 Webpack。

## Loaders 说明

### a-loader / b-loader（功能 1）

最小同步 Loader，只做日志与透传，验证 **Normal 阶段从右到左**。

命令：`npm run build`

`b-loader` 额外演示：

- `loaderUtils.interpolateName` 生成输出文件名
- `this.emitFile` 写出额外资源

### raw-loader（功能 2）

演示较完整的 Loader API：

- `loaderUtils.getOptions(this)` 读取 options
- `this.cacheable(false)` 关闭缓存
- 同步 `return` 与异步 `this.async()` / `callback`

命令：`npm run demo:raw`

### sprite-loader（功能 3 / 4）

基于 [spritesmith](https://github.com/twolfson/spritesmith)：

1. 从 CSS 中匹配 `url(./imgs/xxx.jpg)`
2. 合成雪碧图
3. 按 `coordinates` 写出带 `background-position` 的 CSS
4. 写出 `dist/sprite.jpg` 与 `dist/preview.html`
5. 通过 `callback(null, source)` 异步交回结果

命令：

```bash
npm run demo:sprite
npm run preview:sprite
```

## 依赖说明

| 包 | 用途 |
|----|------|
| webpack / webpack-cli | 正式构建（`npm run build`） |
| loader-runner | 独立跑 Loader（`demo:raw` / `demo:sprite`） |
| loader-utils | Loader 工具（options、文件名插值） |
| spritesmith | 雪碧图合成 |

## License

ISC
