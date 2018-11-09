export default {
	"extraBabelPlugins": [
    // ["import", { "libraryName": "antd-mobile", "libraryDirectory": "es", "style": true },'antd-mobile'],
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true },'antd'],
    // ["@babel/transform-runtime",{regenerator:true}],
	],
  hash:true,
  // multipage:true,
  // entry:'./src/assets/css/themes/*.less',
  // outputPath:'dist/themes',
  // hash:false,
  // output:{
  //  path:'dist/themes',
  //  filename:'[name].css',
  // },
  // entry:{
  //   index:['./src/index.js','./src/assets/css/themes/theme-white.less']
  // },
  // extraBabelPresets: ["@babel/env",'@babel/react'],
  disableCSSModules: true,
  
	"alias":{
    "LoopringJS":`loopring.js/lib`,
    "LoopringUI":`${__dirname}/src/common/loopringui/`,
    "common":`${__dirname}/src/common`,
    "modules":`${__dirname}/src/modules`,
    "mobile":`${__dirname}/src/dex`,
	},
  "theme": {
    // "@font-family-no-number"  : "Roboto ,PingFang SC",
    // "@font-family"            : "@font-family-no-number",
    "@primary-color": "#C59949",
    "@link-color": "#1c60ff",
    "@border-radius-base": "0px",
    "@line-height-base" : 1.6,
    "@normal-color" :"#eee",
    "@border-color-base" : "hsv(0, 0, 90%)",
  },
  "html": {
    "template": "./public/index.ejs",
    "favicon": './src/assets/images/favicon.ico'
  },
  sass:{},
  ignoreMomentLocale:true,
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  ignoreMomentLocale:true,
}


