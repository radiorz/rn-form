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
import React, { memo } from 'react';
export const Button = memo((props) => {
  function onClick() {
    props.onActionClick && props.onActionClick(props.field.name);
  }
  return <Icon name="undo-variant" color="#40a9ff" onPress={onClick} />;
});
Button.propTypes = {
  field: PropTypes.object,
  value: PropTypes.any,
  onActionClick: PropTypes.func,
};
Button.defaultProps = {
  field: {},
  value: '',
  onActionClick: () => {},
};
