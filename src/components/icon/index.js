/**
 *  svg图片,把svg图放到svgs里面,然后执行node getSvg打包文件svgs,生成映射表,然后引用,
 *    由于2年前更新,还是采用componentWillReceiveProps,会警告,暂时注释源码
 *
 *  props
 *    size: string, // svg的大小
 *    name: string, // svg的icon名称    svg文件的名称
 *    color: string, // svg的颜色
 *    style: object, // svg的样式
 *
 *  使用示例
 *    import Icon from '~/components/icon'
 *    <Icon name='pen' size={10} color='orange' />
 *
 * */
import React from 'react';
import SvgUri from 'react-native-svg-uri';
import svgs from '~/assets/svgs/index.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { reactT } from '~/utils/getScreenProps';
export default function Svg(props) {
  // 兼容 两种icon
  const { name, color = '#fff', size = reactT(60), style } = props;
  let svgXmlData = svgs[name];
  if (svgXmlData) {
    return (
      <SvgUri
        style={{
          width: size + 4, // 为icon添加边距
          height: size + 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        width={size}
        height={size}
        svgXmlData={svgXmlData}
        fill={color || '#2374B8'} // 默认灰色grey
      />
    );
  } else {
    // svg不存在则采用MaterialCommunityIcons
    return <Icon style={style} size={size} name={name} color={color} />;
  }
}
