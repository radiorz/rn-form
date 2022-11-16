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

import { ButtonComponent as Button } from '@components/button';
import { Svg as Icon } from '@components/icon';
import Color from 'color';
import PropTypes from 'prop-types';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { reactH, reactT, reactW } from '~/utils/getScreenProps';
const styles = StyleSheet.create({
  box: { flex: 1 },
  modalBox: {
    backgroundColor: 'rgba(0,0,0,.6)',
    width: '100%',
    height: '100%',
  },
  modal: {
    flex: 1,
    marginHorizontal: reactW(100),
    marginVertical: reactH(200),
  },
  valueBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBtn: {
    backgroundColor: '#015EAB',
  },
  rgbColor: { marginTop: reactH(30), flexDirection: 'row' },
  colorLabel: {
    textAlign: 'center',
    paddingTop: reactH(20),
    paddingHorizontal: reactW(5),
    marginHorizontal: reactW(5),
    backgroundColor: '#ddf0ff',
    color: 'gray',
  },
  colorValue: {
    width: reactW(50),
    backgroundColor: '#ddf0ff',
    marginHorizontal: reactW(5),
    textAlign: 'center',
    color: 'gray',
  },
  value: { flex: 1, alignItems: 'flex-end' },
  btnBox: {
    width: '100%',
    marginTop: reactH(80),
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export function ColorPickers(props, ref) {
  const [showMenu, setShowMenu] = useState(false);
  const [currentColor, setColor] = useState(props.value);
  const [selectedColor, setSelectColor] = useState(props.value);
  const [colorR, setColorR] = useState(Color(props.value).object().r + '');
  const [colorG, setColorG] = useState(Color(props.value).object().g + '');
  const [colorB, setColorB] = useState(Color(props.value).object().b + '');
  useImperativeHandle(ref, () => {
    return {
      openModal: openModal,
    };
  });
  function openModal() {
    setShowMenu(true);
  }
  // 关闭modal
  function closeModal() {
    setShowMenu(false);
  }
  function onChangeColor() {
    setSelectColor(currentColor);
    props.onChange(currentColor);
    closeModal();
  }

  useEffect(() => {
    const { r, g, b } = Color(currentColor).object();
    setColorR(r + '');
    setColorG(g + '');
    setColorB(b + '');
  }, [currentColor]);
  function onValueChange(type, value) {
    switch (type) {
      case 'r':
        setColorR(value);
        if (value && parseInt(value) >= 0 && parseInt(value) <= 255)
          setSelectColor(Color(`rgb(${value}, ${colorG}, ${colorB})`).hex());
        break;
      case 'g':
        setColorG(value);
        if (value && parseInt(value) >= 0 && parseInt(value) <= 255)
          setSelectColor(Color(`rgb(${colorR}, ${value}, ${colorB})`).hex());
        break;
      case 'b':
        setColorB(value);
        if (value && parseInt(value) >= 0 && parseInt(value) <= 255)
          setSelectColor(Color(`rgb(${colorR}, ${colorG}, ${value})`).hex());
        break;
    }
  }
  const onClick = () => {
    // 只读属性
    if (props.field.readOnly) return;
    setShowMenu(true);
  };
  return (
    <View style={styles.box}>
      <TouchableWithoutFeedback onPress={onClick}>
        <View style={styles.valueBox}>
          <Icon
            style={[styles.value, props.field.style]}
            name={'checkbox-blank-circle'}
            color={selectedColor}
            size={reactT(50)}
          />
          <Icon
            name={showMenu ? 'chevron-down' : 'chevron-right'}
            color="grey"
            size={reactT(50)}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal transparent={true} visible={showMenu} onRequestClose={closeModal}>
        <View style={styles.modalBox}>
          <View style={styles.modal}>
            <ColorPicker
              color={selectedColor}
              onColorChangeComplete={(color) => {
                setColor(color);
              }}
              thumbSize={40}
              sliderSize={40}
              noSnap={true}
              row={false}
            />
            <View style={styles.rgbColor}>
              <Text style={styles.colorLabel}>
                {_t('RGB颜色值(输入范围0~255)：')}
              </Text>
              <TextInput
                style={styles.colorValue}
                value={colorR}
                keyboardType={'numeric'}
                placeholderTextColor={'gray'}
                onChangeText={(value) => {
                  // 传递值
                  onValueChange('r', value);
                }}
              />
              <TextInput
                style={styles.colorValue}
                value={colorG}
                keyboardType={'numeric'}
                placeholderTextColor={'gray'}
                onChangeText={(value) => {
                  // 传递值
                  onValueChange('g', value);
                }}
              />
              <TextInput
                style={styles.colorValue}
                value={colorB}
                keyboardType={'numeric'}
                placeholderTextColor={'gray'}
                onChangeText={(value) => {
                  // 传递值
                  onValueChange('b', value);
                }}
              />
            </View>

            <View style={styles.btnBox}>
              <Button
                style={styles.checkBtn}
                children={'确定'}
                onPress={onChangeColor}
              />
              <Button
                style={styles.checkBtn}
                children={'取消'}
                onPress={closeModal}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
ColorPickers = forwardRef(ColorPickers);
ColorPickers.propTypes = {
  field: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
};
ColorPickers.defaultProps = {
  field: {},
  value: '#ffffff',
  onChange: () => {},
};
