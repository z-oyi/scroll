
import pluginBabel from '@rollup/plugin-buble'
import resolve from 'rollup-plugin-node-resolve'

module.exports = {
    input: 'lib/scroll.js',
    output: {
        file: 'lib/srcoll.umd.js',
        format: 'umd',
        name: 'Scroll'
    },
    plugins: [
        resolve(),
        pluginBabel()
    ]
};