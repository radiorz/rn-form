// 让字体和宽高自适应屏幕
/**
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 *
 * 例子
 * const style = StyleSheet.create({
 *   view: {
 *     flexDirection: 'row',
 *     height: _reactH(500),
 *     width: _reactW(750),
 *     font-size: _reactT(30)
 *   }
 * })
 */
import { Dimensions, PixelRatio } from 'react-native';

// 获取屏幕的dp
let screenW = Dimensions.get('window').width;
let screenH = Dimensions.get('window').height;
let fontScale = PixelRatio.getFontScale();
let pixelRatio = PixelRatio.get();
// 高保真的宽度和高度
const designWidth = 750.0;
const designHeight = 1334.0;

// 根据dp获取屏幕的px
let screenPxW = PixelRatio.getPixelSizeForLayoutSize(screenW);
let screenPxH = PixelRatio.getPixelSizeForLayoutSize(screenH);

/**
 * 设置text
 * @param size  px
 * @returns {Number} dp
 */
export function reactT(size) {
  var scaleWidth = screenW / designWidth;
  var scaleHeight = screenH / designHeight;
  var scale = Math.min(scaleWidth, scaleHeight);
  size = Math.round((size * scale) / fontScale + 0.5);
  return size;
}

/**
 * 设置高度
 * @param size  px
 * @returns {Number} dp
 */
export function reactH(size) {
  var scaleHeight = (size * screenPxH) / designHeight;
  size = Math.round(scaleHeight / pixelRatio + 0.5);
  return size;
}

/**
 * 设置宽度
 * @param size  px
 * @returns {Number} dp
 */
export function reactW(size) {
  var scaleWidth = (size * screenPxW) / designWidth;
  size = Math.round(scaleWidth / pixelRatio + 0.5);
  return size;
}

/**
 * 1像素
 */
export const onePx = 1 / pixelRatio;
