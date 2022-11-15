/**
 * 可支持多选下拉框组件
 * author: xyxu
 * date: 20220722
 */
import Icon from '~/components/icon';
import { isNotEmpty, randomNumber } from '~/utils/helper';
import PropTypes from 'prop-types';
import React, { useImperativeHandle, useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { reactH, reactT, reactW } from '~/utils/getScreenProps';

export default function MultipleDropDown(props = {}) {
  const { myRef, name, value = [], pk = 'id' } = props;
  const [visible, setVisible] = useState(false);
  const [randomNum, setRandomNum] = useState(1);
  const [selectedValue, setSelectedValue] = useState(value);

  //接收父组件下发的事件
  useImperativeHandle(myRef, () => ({
    hide() {
      setVisible(false);
    },
  }));

  const _onModalPress = () => {
    setVisible(!visible);
    Keyboard.dismiss();
    const fn = props.onPress;
    if (typeof fn === 'function') fn();
  };

  //选中删除
  const _onclose = (item, freeze = false) => {
    const values = selectedValue;
    const index = values.findIndex((v) => v[pk] === item[pk]);
    values.splice(index, 1);
    setSelectedValue(values);
    emit(values); //最新值向上触发
    setRandomNum(randomNumber());
    setVisible(freeze);
  };

  //选择
  const _onSelect = (item) => {
    const values = selectedValue;
    const hasValue = values.some((v) => v[pk] === item[pk]);
    if (!hasValue) {
      values.push(item);
      setSelectedValue(values);
      emit(values);
      setRandomNum(randomNumber());
    } else {
      _onclose(item, true);
    }
  };

  function _renderItem({ item, index }) {
    const isSelected = selectedValue.some((v) => v[pk] === item[pk]);
    return (
      <TouchableWithoutFeedback
        key={index}
        onPress={() => {
          _onSelect(item);
        }}
      >
        <View style={styles.selectWrap}>
          <Text
            style={[styles.dropdownText, isSelected ? styles.highlight : {}]}
          >
            {item.title}
          </Text>
          {isSelected ? (
            <Icon
              name="choose"
              style={styles.chooseIcon}
              size={reactT(40)}
              color="#42B983"
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  const emit = (value) => {
    const fn = props.onSelect;
    if (typeof fn === 'function') {
      fn(name, value);
    }
  };

  const selectedDom = useMemo(() => {
    return (
      <TouchableWithoutFeedback onPress={_onModalPress}>
        <View style={styles.inputWrap}>
          {isNotEmpty(selectedValue) ? (
            selectedValue.map((item, index) => {
              return (
                <View key={index} style={styles.selectBtn}>
                  <Text style={styles.selectText}>{item.title}</Text>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => {
                      _onclose(item);
                    }}
                  >
                    <Icon name="close" size={reactT(20)} color="#0E6E5D" />
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={styles.tipText}>请选择</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }, [selectedValue, randomNum, visible]);

  return (
    <View style={styles.main}>
      {selectedDom}
      {visible ? (
        <FlatList
          style={styles.list}
          data={props.data}
          keyExtractor={(item, i) => `key-${i}`}
          renderItem={_renderItem}
        />
      ) : null}
    </View>
  );
}

MultipleDropDown.propTypes = {
  name: PropTypes.string,
  value: PropTypes.array,
  onSelect: PropTypes.func,
};
MultipleDropDown.defaultProps = {
  value: [],
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'flex-start',
    position: 'relative',
    left: 0,
    top: 0,
  },
  tipText: {
    fontSize: reactT(32),
    color: '#B4C7E7',
    marginTop: reactH(30),
    marginLeft: reactW(5),
  },
  inputWrap: {
    minHeight: reactH(90),
    flexDirection: 'row',
    borderWidth: reactT(2.5),
    borderColor: '#fff',
    borderRadius: reactH(10),
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  selectBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: reactH(10),
    backgroundColor: '#789E8D',
    marginLeft: reactW(3),
    marginTop: reactH(5),
    marginBottom: reactH(5),
    paddingVertical: reactH(10),
    paddingLeft: reactW(5),
    borderWidth: reactT(3),
    borderColor: '#0E6E5D',
  },
  closeBtn: {
    padding: reactW(5),
  },
  selectWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chooseIcon: {
    marginLeft: reactW(10),
  },
  selectText: {
    color: '#0E6E5D',
    fontSize: reactT(32),
  },
  list: {
    height: reactH(450),
    borderWidth: reactT(2.5),
    borderColor: '#fff',
    borderRadius: reactH(5),
    backgroundColor: '#fff',
    position: 'absolute',
    top: reactH(90),
    // bottom:0,
    left: 0,
    zIndex: 1000,
    width: '100%',
  },
  dropdownText: {
    fontSize: reactT(32),
    color: '#777',
    paddingVertical: reactH(10),
    paddingHorizontal: reactW(5),
  },
  highlight: {
    color: '#42B983',
  },
});
