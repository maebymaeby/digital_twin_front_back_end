/********************debug提示相关********************/

// 配置
let debugMode = true;
let baseURL = 'http://127.0.0.1:10001';
let baseURLExpress = 'http://localhost:3000'


/********************默认参数相关********************/

let topnavHeight = 80; // 比默认topnav高度多20

/********************数据格式验证相关********************/

// 手机号码格式验证
let isPhone = /^1[3-9][0-9]\d{8}$/;
// 邮箱格式验证
let isEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;

/********************格式化相关********************/

// 返回特定的时间格式
function getDatetimeFormat(rawDatetime, format) {
  let datetime = new Date(rawDatetime);
  let o = {
    "M+": datetime.getMonth() + 1, //月份 
    "d+": datetime.getDate(), //日 
    "h+": datetime.getHours(), //小时 
    "m+": datetime.getMinutes(), //分 
    "s+": datetime.getSeconds(), //秒 
    "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度 
    "S": datetime.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return format;
}

// 保留指定小数点后x位
function getFixedTo(number, n) {
  return Math.floor(number * Math.pow(10, n)) / Math.pow(10, n);
}

export default {
  // debug提示相关
  debugMode,
  baseURL,
  baseURLExpress,

  // 默认参数相关
  topnavHeight,

  // 数据格式验证相关
  isPhone,
  isEmail,

  // 格式化相关
  getDatetimeFormat,
  getFixedTo,
}