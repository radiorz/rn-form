/**
 *  richForm的router组件
 *    设计思路：
 *      根据传进来的props.value,在组件里进行修改,不影响父组件;
 *      每次数据变化都需要执行props.onChange(value),value为后台需要的数据,该函数会返回错误信息,无为{}
 *      点击文本跳转页面，并支持接收页面数据，返回给父组件。
 *      field支持的属性：
 *      {
 *        style: object {} 显示的text样式
 *        navigationParams: {
 *           navigation: props.navigation,    // 路由
 *           key: 'Bell',                     // 路由key
 *           routeName: 'Bell'                // 路由名称
 *        }
 *      }
 *
 *  props
 *    field: object {} 此字段的值定义
 *    value: any '' 字段的值
 *    onChange: func ()=>{} 传递val到父组件的方法
 *
 *  例子
 */
import { Svg as Icon } from '@components/icon';
import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { reactT } from '~/utils/getScreenProps';
const styles = StyleSheet.create({
  box: { flexDirection: 'row', flex: 1, justifyContent: 'flex-end' },
  label: {
    color: 'grey',
    fontSize: reactT(40),
  },
});

export const Router = memo((props) => {
  const { navigation, key, routeName } = props.field.navigationParams || {};
  const [value, setValue] = useState(props.value);
  const onNavigate = () => {
    if (navigation) {
      navigation.navigate({
        key,
        routeName,
        params: {
          onSelect: (newVal) => {
            if (newVal) {
              setValue(newVal);
              props.onChange(newVal);
            }
          },
        },
      });
    }
  };
  return (
    <TouchableWithoutFeedback onPress={onNavigate}>
      <View style={styles.box}>
        <Text style={[styles.label, props.field.style]}>{value}</Text>
        <Icon name="chevron-right" size={reactT(60)} />
      </View>
    </TouchableWithoutFeedback>
  );
});
Router.propTypes = {
  field: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
};
Router.defaultProps = {
  field: {},
  value: '',
  onChange: () => {},
};
