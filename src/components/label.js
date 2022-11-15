/**
 *  richForm的label组件
 *    设计思路：
 *      根据传进来的props.value,在组件里进行修改,不影响父组件;
 *      每次数据变化都需要执行props.onChange(value),value为后台需要的数据,该函数会返回错误信息,无为{}
 *      field支持的属性：
 *        style: object {} 显示的text样式
 *
 *  props
 *    field: object {} 此字段的值定义
 *    value: any '' 字段的值
 *
 *  例子
 */
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { reactT } from '~/utils/getScreenProps';

const styles = StyleSheet.create({
  box: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  label: {
    color: 'grey',
    fontSize: reactT(40),
  },
});

export default function Label(props) {
  return (
    <View style={styles.box}>
      <Text style={[styles.label, props.field.style]}>{props.value}</Text>
    </View>
  );
}
Label.propTypes = {
  field: PropTypes.object,
  value: PropTypes.any,
};
Label.defaultProps = {
  field: {},
  value: '',
};
