/**
 *  richForm的switch组件
 *    设计思路：
 *      根据传进来的props.value,在组件里进行修改,不影响父组件;
 *      每次数据变化都需要执行props.onChange(value),value为后台需要的数据,该函数会返回错误信息,无为{}
 *      field支持的属性：
 *      {
 *        readOnly: bool false 是否可读
 *      }
 *
 *  props
 *    field: object {} 此字段的值定义
 *    value: any '' 字段的值
 *    onChange: func ()=>{} 传递val到父组件的方法
 *
 *  例子
 */
import React, { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { reactT } from '~/utils/getScreenProps';

import PropTypes from 'prop-types';
const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
  },
  switch: {
    transform: [{ scaleX: reactT(25) / 10 }, { scaleY: reactT(25) / 10 }],
    marginRight: reactT(25), // 扩大后要相应增加边距
  },
});

export default function SwitchDom(props) {
  const [value, setVal] = useState(props.value);
  return (
    <View style={styles.box}>
      <Switch
        style={styles.switch}
        value={value}
        disabled={props.field.readOnly}
        trackColor={{ false: '#767577', true: '#4472C4' }} // 背景色
        thumbColor={'#D9D9D9'} // 按钮的颜色
        onValueChange={(value) => {
          setVal(value);
          props.onChange(value);
        }}
      />
    </View>
  );
}
SwitchDom.propTypes = {
  field: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
};
SwitchDom.defaultProps = {
  field: {},
  value: '',
  onChange: () => {},
};
