/**
 *  richForm的slider组件
 *    设计思路：
 *      根据传进来的props.value,在组件里进行修改,不影响父组件;
 *      每次数据变化都需要执行props.onChange(value),value为后台需要的数据,该函数会返回错误信息,无为{}
 *      field支持的属性：
 *      {
 *        readOnly: bool false 是否可读
 *        style: object {} 显示的text样式
 *        min: number 0 最小值
 *        max: number 100 最大值
 *        step: number 10 间隔值
 *      }
 *
 *  props
 *    field: object {} 此字段的值定义
 *    value: any '' 字段的值
 *    onChange: func ()=>{} 传递val到父组件的方法
 *
 *  例子
 */
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { reactT, reactW } from '~/utils/getScreenProps';

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingRight: reactW(20),
  },
  slider: {
    flex: 1,
  },
  valueText: {
    color: 'grey',
    fontSize: reactT(40),
    width: reactW(30),
  },
});

export default function SliderComponent(props) {
  const field = props.field;
  const [value, setVal] = useState(props.value);
  return (
    <View style={styles.box}>
      <Slider
        style={[styles.slider, field.style]}
        value={value}
        disabled={field.readOnly}
        maximumValue={field.max || 100}
        minimumTrackTintColor={field.minimumTrackTintColor || '#1F7CCC'} // 激活进度条的颜色
        minimumValue={field.min || 0}
        thumbTintColor={field.thumbTintColor || '#1F7CCC'} // 滑块的颜色
        step={field.step || 10}
        onValueChange={(value) => {
          props.onChange(value);
          setVal(value);
        }}
      />
      <Text style={[styles.valueText, props.field.style]}>{value}</Text>
    </View>
  );
}
SliderComponent.propTypes = {
  field: PropTypes.object,
  value: PropTypes.number,
};
SliderComponent.defaultProps = {
  field: {},
  value: 0,
};
