/**
 *  通用的按钮组件
 *
 *  props
 *    style: PropTypes.object, // 设置button的外边距,宽高
 *    icon: PropTypes.string, // icon的名称
 *    children: PropTypes.string, // 文本内容
 *    loading: PropTypes.boolean, // 是否在加载
 *    disabled: PropTypes.boolean, // 是否禁止
 *
 *  实例
 *  import Button from '~/components/button'
 *  <Button onPress={() => {}} />
 */
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Icon from '~/components/icon';
// import { ActivityIndicator } from '@ant-design/react-native';
import PropTypes from 'prop-types';
import { onePx, reactH, reactT, reactW } from '~/utils/getScreenProps';

const styles = StyleSheet.create({
  buttonBox: {
    paddingHorizontal: reactW(20),
    marginHorizontal: reactH(10),
    marginVertical: reactH(10),
    borderRadius: reactT(10),
    borderWidth: onePx,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

export default function Button(props) {
  const color = props.style.color || 'white';
  const fontSize = props.style.fontSize || reactT(24);
  const opacity = props.disabled || props.loading ? 0.5 : 1;
  const pointerEvents = opacity === 1 ? 'auto' : 'none';
  const paddingLeft = props.style.paddingLeft || 0;
  const justifyContent = props.style.justifyContent || 'center';
  return (
    <View pointerEvents={pointerEvents}>
      <TouchableHighlight
        onPress={props.onPress}
        underlayColor="#999"
        style={[
          styles.buttonBox,
          {
            backgroundColor: props.style.backgroundColor || 'white',
            paddingVertical: props.style.paddingVertical || reactH(6),
            paddingHorizontal: props.style.paddingHorizontal || reactW(5),
            marginHorizontal: props.style.marginHorizontal || reactH(10),
            opacity,
            borderColor: props.style.backgroundColor || '#b6bcc7',
          },
        ]}
      >
        <View style={[styles.button, { justifyContent }]}>
          {props.icon ? (
            <Icon name={props.icon} color={color} size={fontSize} />
          ) : null}
          <Text style={[styles.text, { color, fontSize, paddingLeft }]}>
            {props.children}
          </Text>
          {props.loading && (
            <Text size="small" color={color}>
              Loading...
            </Text>
          )}
        </View>
      </TouchableHighlight>
    </View>
  );
}
Button.propTypes = {
  style: PropTypes.object,
  icon: PropTypes.string,
  children: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
};
Button.defaultProps = {
  style: {},
  icon: '',
  children: '',
  loading: false,
  disabled: false,
  onPress: () => {},
};
