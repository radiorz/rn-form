/**
 *  richForm的input组件
 *    设计思路：
 *      根据传进来的props.value,在组件里进行修改,不影响父组件;
 *      每次数据变化都需要执行props.onChange(value),value为后台需要的数据,该函数会返回错误信息,无为{}
 *      field支持的属性：
 *      {
 *        schema: object {} 字段值的验证方法
 *        readOnly: bool false 是否可读
 *        style: object {} 显示的text样式
 *        min: number 1 最小值
 *        max: number 100 最大值
 *        step: number 1 间隔值
 *        scale: number 1 支持缩放,用于时间的显示等显示和实际不同的字段
 *      }
 *
 *  props
 *    field: object {} 此字段的值定义
 *    value: any '' 字段的值
 *    onChange: func ()=>{} 传递val到父组件的方法
 *
 *  例子
 */
import Icon from '~/components/icon';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { reactT } from '~/utils/getScreenProps';

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center' },
  input: {
    color: 'grey',
    paddingVertical: 0,
    fontSize: reactT(40),
  },
});

export default function InputNumber(props) {
  const max = props.field.max || 100;
  const min = props.field.min !== undefined ? props.field.min : 0;
  const step = props.field.step || 1;
  const scale = props.field.scale || 1;
  const [value, setVal] = useState(props.value * scale + '' || '0');
  function changeVal(value) {
    // 只读则不可修改
    if (props.field.readOnly) return;
    let val = value + '';
    // 防止输入非数字
    if (!/^(-|\d)\d*$/.test(val)) val = min;
    // 改为数字判断大小
    val = parseInt(val);
    if (val > max) val = max;
    if (val < min) val = min;
    setVal(val + '');
    props.onChange(val / scale);
  }
  return (
    <View style={styles.box}>
      <Icon
        onPress={() => {
          changeVal(parseInt(value) - step);
        }}
        name="minus-box"
        color="grey"
        size={reactT(70)}
      />
      <TextInput
        style={[styles.input, props.field.style]}
        keyboardType="numeric"
        selectionColor={'#0260B3'}
        value={value}
        editable={!props.field.readOnly}
        onChangeText={(value) => {
          changeVal(value);
        }}
      />
      <Icon
        onPress={() => {
          changeVal(parseInt(value) + step);
        }}
        name="plus-box"
        color="grey"
        size={reactT(70)}
      />
    </View>
  );
}
InputNumber.propTypes = {
  field: PropTypes.object,
  value: PropTypes.number,
  onChange: PropTypes.func,
};
InputNumber.defaultProps = {
  field: {},
  value: 0,
  onChange: () => {},
};
