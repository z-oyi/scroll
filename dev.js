

const rollup = require('rollup')
const pluginBabel = require('@rollup/plugin-buble')
const resolve  = require('rollup-plugin-node-resolve') 
const ts = require('rollup-plugin-typescript2')
const path = require('path')
const join = (...args) => path.resolve(...args);
const browserSync = require("browser-sync").create();
const getPath = _path => path.resolve(__dirname, _path)
const pkg =  require('./package.json')
const dts = require('rollup-plugin-dts').default

const extensions = [
    '.js',
    '.ts',
    '.tsx'
]

const tsPlugin = ts({
    tsconfig: getPath('./tsconfig.json'),
    extensions
})

const config = [
    {
        input: join('./src/Scroll.ts'),
        output: {
            file: join('./', pkg.main),
            format: 'umd',
            name: 'Scroll', 
        },
        plugins: [
            tsPlugin,
            resolve()
        ],
    },
]

const watcher = rollup.watch(config)
watcher.on('event', event => {
    if (event.code === 'END') {}
    if (event.code === 'ERROR') console.log(event)
});
  

browserSync.init({
    server: "./",
    files: ["./lib/**/*.js", "./index.html"],
    open: false
})