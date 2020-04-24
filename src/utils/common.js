export function _countDown(time) { // 传入秒 返回 hh:mm:ss
  let result = parseInt(time)
　　let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
　　let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
　　let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
　　result = `${h}:${m}:${s}`
　　return result
}
export function getSearchDate(type) {
  let today = new Date(new Date().setHours(0,0,0,0)).getTime() / 1000 // 当天凌晨的时间戳一天的时间是86400秒
  let oneDay = 86400
  let time = null
  switch (type) {
    case '昨天':
      time = today - oneDay // 昨天的秒数
      break;
    case '今天':
      time = today
      break;
    case '最近七天':
      time = today - oneDay * 7
      break;
    case '最近15天':
      time = today - oneDay * 15
      break;
    case '最近30天':
      time = today - oneDay * 30
      break;
    default:
      break;
  }
  return time
}

export function getBirthDay(value) {
  let apartDay = datedifference(YYYYMMDD(), YYYYMMDD(value))
  console.log({apartDay})
  let timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000; // 今天凌晨的时间戳
  return timeStamp - 86400 * apartDay
}
function YYYYMMDD(time) {
  let date = time ? new Date(time) : new Date()
  let year = date.getFullYear()
  let mounth = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  return `${year}-${mounth}-${day}`
}
function datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
  console.log(sDate1, sDate2)
  var dateSpan,
      iDays;
  sDate1 = Date.parse(sDate1);
  sDate2 = Date.parse(sDate2);
  dateSpan = sDate2 - sDate1;
  dateSpan = Math.abs(dateSpan);
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
  return iDays
}
export default {
  _countDown,
  getSearchDate
}