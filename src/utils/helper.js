import dayjs from 'dayjs';
import { ascend, descend, prop, sort } from 'ramda';
import { ToastAndroid } from 'react-native';

/**
 * 人性化时间处理 传入时间戳
 * @param { } dateTimeStamp  时间戳
 */
export function getFriendlyDate(dateTimeStamp) {
  if (!dateTimeStamp) return '';
  dateTimeStamp =
    typeof dateTimeStamp === 'number'
      ? dateTimeStamp
      : dayjs(dateTimeStamp).valueOf();
  let result = '';
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let month = day * 30;
  let now = new Date().getTime();
  let diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  let monthC = diffValue / month;
  let weekC = diffValue / (7 * day);
  let dayC = diffValue / day;
  let hourC = diffValue / hour;
  let minC = diffValue / minute;
  if (monthC >= 1) {
    result = '' + parseInt(monthC) + '月前';
  } else if (weekC >= 1) {
    result = '' + parseInt(weekC) + '周前';
  } else if (dayC >= 1) {
    result = '' + parseInt(dayC) + '天前';
  } else if (hourC >= 1) {
    result = '' + parseInt(hourC) + '小时前';
  } else if (minC >= 1) {
    result = '' + parseInt(minC) + '分钟前';
  } else {
    result = '刚刚';
  }
  return result;
}

/**
 * 格式化时间
 * @param {*} date
 */

export function formatDate(date) {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
}

export function formatDateTime(date) {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD  HH:mm');
}

export function formatDateTimeTimeSecond(date) {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD  HH:mm:ss');
}

//获取距离当天零点时间的毫秒数
export function getTodayMillisecond(timestamp) {
  return timestamp - dayjs().startOf('day').valueOf();
}

//零点毫秒数
export const getZeroMillisecond = () => {
  return dayjs().startOf('day').valueOf();
};

export function formatOffsetTime(time) {
  return dayjs().startOf('day').add(time, 'millisecond').format('HH:mm');
}

//获取本周时间范围
export function getThisWeekTimeRange() {
  if (new Date().getDay() === 0) {
    //周日（一周的开始）
    return `${dayjs().startOf('week').subtract(6, 'day').valueOf()},${dayjs()
      .startOf('week')
      .add(1, 'day')
      .valueOf()}`;
  } else {
    return `${dayjs().startOf('week').add(1, 'day').valueOf()},${dayjs()
      .startOf('week')
      .add(8, 'day')
      .valueOf()}`;
  }
}

export function getDuration(time) {
  let minutes = time / 1000 / 60;
  let minutesRound = Math.floor(minutes);
  let seconds = time / 1000 - 60 * minutesRound;
  let secondsRound = Math.floor(seconds);
  let duration =
    minutesRound !== 0
      ? `${minutesRound}分钟${secondsRound}秒`
      : `${secondsRound}秒`;
  return duration;
}

//****函数防抖是某一段时间内只执行一次，而函数节流是间隔时间执行************
//防抖,在延迟时间内重复执行只会执行最后一次，在延迟时间内下次会取消上次
export function debounce(fn, delay = 1000) {
  let timeout = null;
  return function () {
    clearTimeout(timeout); //把前一个定时器清除
    timeout = setTimeout(() => {
      // fn.call(this, ...arguments);
      fn.apply(this, arguments);
    }, delay);
  };
}

//节流
export function throttle(fn, delay = 1000) {
  let last, deferTimer;
  return function () {
    let now = +new Date(); //时间戳
    if (last && now < last + delay) {
      //间隔小于延迟时间，延迟执行，大于立即执行
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(this, arguments);
      }, delay);
    } else {
      last = now;
      fn.apply(this, arguments);
    }
  };
}

//节流首次立即执行，后面间隔执行不做延迟
export const _throttle = (fn, delay = 1000) => {
  let isfirst = true;
  let pre = +new Date(); //上一次执行的时间
  return function () {
    let now = +new Date();
    if (isfirst) {
      fn.apply(this, arguments);
      isfirst = false;
    }
    if (now - pre >= delay) {
      fn.apply(this, arguments);
      pre = now;
    }
  };
};

//组合提醒
export function combinaRemind(text, options = {}) {
  // $tts.speak(text, options)
  toast(text);
}

//升序
export function sorted(arrs = [], field = '') {
  return sort(ascend(prop(field)), arrs);
}

//降序
export function sortDescend(arrs = [], field = '') {
  return sort(descend(prop(field)), arrs);
}

//字符串转字节数组
export function stringToBytes(str) {
  let ch,
    st,
    re = [];
  for (let i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i);
    st = [];
    do {
      st.push(ch & 0xff);
      ch = ch >> 8;
    } while (ch);
    re = re.concat(st.reverse());
  }
  return re;
}

export function insertStr(soure, start, newStr) {
  return soure.slice(0, start) + newStr + soure.slice(start);
}

export function randomNumber() {
  return Math.random().toString(36).substring(2);
}

export const isNotEmpty = (arr) => Array.isArray(arr) && arr.length > 0;

export const toast = (text = '') => {
  if (text) {
    ToastAndroid.showWithGravity(text, ToastAndroid.SHORT, ToastAndroid.CENTER);
  }
};
