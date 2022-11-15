/**
 *  richForm的field组件
 *
 *  props
 *
 *  例子
 */
import { path } from 'ramda';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// 单个组件
import PropTypes from 'prop-types';
import { reactT, reactW } from '~/utils/getScreenProps';
import Input from './components/input';
import InputNumber from './components/inputNumber';
import Label from './components/label';
import Picker from './components/picker';
import Slider from './components/slider';
import Switch from './components/switch';
import Upload from './components/upload';

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: reactW(10),
  },
  fieldTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: reactW(10),
    width: reactW(50),
    height: '100%',
  },
  fieldTitle: {
    color: 'grey',
    textAlign: 'right',
    flex: 1,
  },
  titleSuffix: {
    color: 'grey',
    fontSize: reactT(40),
  },
  fieldValue: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: reactW(10),
  },
});
// 所有字段可以渲染的组件
const components = {
  input: { component: Input },
  picker: { component: Picker },
  label: { component: Label },
  slider: { component: Slider },
  switch: { component: Switch },
  inputNumber: { component: InputNumber },
  upload: { component: Upload },
};

export default function Field(props) {
  // 渲染 field 的dom
  const field = Object.assign({ schema: {} }, props.field);
  const form = Object.assign({ titleStyle: {} }, props.form);
  const Component = components[field.component]
    ? components[field.component].component
    : Label;
  // 字段的值
  const value = path(field.name.split('.'), props.values);
  const titleStyle = Object.assign({}, styles.fieldTitle, {
    fontSize: form.titleStyle.fontSize || reactT(40),
  });
  // 如果enable为false,也是只读的,enabled不传递到子组件,样式统一在field处理,减少麻烦
  field.readOnly = field.readOnly || !props.enabled;
  return (
    <View
      key={field.name}
      style={[styles.field, { opacity: props.enabled ? 1 : 0.3 }]}
    >
      <View style={[styles.fieldTitleBox, form.titleStyle, field.titleStyle]}>
        <Text style={titleStyle}>{field.title || field.name}</Text>
      </View>
      <Text style={styles.titleSuffix}>
        {form.titleSuffix === undefined ? ':' : form.titleSuffix}
      </Text>
      <View style={[styles.fieldValue, form.valueStyle, field.valueStyle]}>
        <Component
          key={value}
          field={field} // 字段样式
          value={value} // 字段值
          onChange={(val) => props.onFieldChange(props.values, val, field)} // 字段改变时
        />
      </View>
    </View>
  );
}
Field.propTypes = {
  field: PropTypes.object,
  values: PropTypes.object,
  form: PropTypes.object,
  enabled: PropTypes.bool,
  onFieldChange: PropTypes.func,
};
Field.defaultProps = {
  field: {},
  values: {},
  form: {},
  enabled: true,
  onFieldChange: () => {},
};
