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
import Icon from '~/components/icon';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { reactT, reactW } from '~/utils/getScreenProps';

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: reactW(30),
  },
  input: {
    flex: 1,
    color: 'grey',
    paddingVertical: 0,
    paddingLeft: 0,
    fontSize: reactT(32),
  },
  errorBox: {
    flexDirection: 'row',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: reactT(40),
    marginLeft: reactW(5),
  },
});

export default function Input(props) {
  const [value, setVal] = useState(props.value + '');
  const [isError, setError] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(false);
  useEffect(() => {
    setSecureTextEntry(props.field.security ? props.field.security : false);
  }, []);
  return (
    <View style={[styles.box]}>
      <TextInput
        secureTextEntry={secureTextEntry}
        style={[styles.input, props.field.style]}
        value={value}
        selectionColor={'#0260B3'}
        placeholder={props.field.placeholder}
        placeholderTextColor={'grey'}
        editable={!props.field.readOnly}
        onChangeText={(value) => {
          // 传递值
          setVal(value);
          setError(props.onChange(value));
        }}
      />
      {isError ? (
        <View style={styles.errorBox}>
          <Icon name="alert-circle" color="red" size={reactT(50)} />
          <Text style={styles.errorText}>
            {props.field.schema.errorMessage}
          </Text>
        </View>
      ) : null}
      {props.field.security ? (
        <TouchableWithoutFeedback
          onPress={() => {
            setSecureTextEntry(!secureTextEntry);
          }}
        >
          <View style={{ width: reactT(50), height: reactT(50) }}>
            <Icon
              name={secureTextEntry ? 'eye' : 'hide'}
              color="grey"
              size={reactT(50)}
            />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </View>
  );
}
Input.propTypes = {
  field: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
};
Input.defaultProps = {
  field: {},
  value: '',
  onChange: () => {},
};
