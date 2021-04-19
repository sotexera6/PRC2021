module.exports = {
    devServer: {
     proxy: {
       '/site': {
         target: 'http://localhost:3000/',
         secure: true,
         changeOrigin: true,
         pathRewrite: {
           '^/site': ''
         }
       },
     }
   } 
   };