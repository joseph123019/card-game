const path = require('path');
module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@src', path.join(__dirname, '/src'));
  }
  
}
