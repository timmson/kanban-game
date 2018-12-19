const path = require('path');

module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, './')
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
};