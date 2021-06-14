module.exports = {
    publicPath: '/',

    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false
            }
        }
    },

    productionSourceMap: false
};