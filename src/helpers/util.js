export function friendlyDate(datsStr) {
  let dateObj = typeof datsStr === "object" ? datsStr : new Date(datsStr);
  let time = dateObj.getTime();
  let now = Date.now();
  let period = now - time;
  let str = "";

  switch (true) {
    case period < 60000:
      str = "刚刚";
      break;
    case period < 1000 * 3600:
      str = Math.floor(period / 60000) + "分钟前";
      break;
    case period < 1000 * 3600 * 24:
      str = Math.floor(period / (1000 * 3600)) + "小时前";
      break;
    default:
      str = Math.floor(period / (1000 * 3600 * 24)) + "天前";
  }
  return str;
}
