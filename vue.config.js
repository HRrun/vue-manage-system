module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://192.168.0.5:8001',
                //target:'http://www.kmjn.net.cn:8001',
                changeOrigin:false,
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    }
}