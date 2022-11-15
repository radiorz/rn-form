/**
 *  richForm的picker组件,传进来的值转换为字符串
 *    设计思路：
 *      根据传进来的props.value,在组件里进行修改,不影响父组件;
 *      每次数据变化都需要执行props.onChange(value),value为后台需要的数据,该函数会返回错误信息,无为{}
 *      field支持的属性：
 *      {
 *        schema: object {} 字段值的验证方法
 *        readOnly: bool false 是否可读
 *        style: object {} 显示的text样式
 *        multiple: bool false 是否可以多选
 *        dict: object {} 字典
 *                      {
 *                          [value]: {
 *                                        value: any '' 字段的值,
 *                                        text: string
 *                                    }
 *                      }
 *        connectSymbol: string ',' 多选时,值的连接符号
 *      }
 *  props
 *    field: object {} 此字段的值定义
 *    value: any '' 字段的值
 *    onChange: func ()=>{} 传递val到父组件的方法
 *
 *  例子
 */
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from '~/components/icon';
import { onePx, reactH, reactT, reactW } from '~/utils/getScreenProps';

const styles = StyleSheet.create({
  box: { flex: 1, color: 'grey' },
  modalBox: {
    backgroundColor: 'rgba(0,0,0,.6)',
    width: '100%',
    height: '100%',
  },
  modal: {
    borderRadius: reactT(10),
    backgroundColor: 'white',
    marginHorizontal: '20%',
    marginTop: '10%',
    maxHeight: reactH(700),
  },
  valueBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: { flex: 1, color: 'grey', textAlign: 'right', fontSize: reactT(40) },
  selection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: reactW(10),
    paddingVertical: reactH(20),
    borderBottomColor: '#eee',
  },
  selectionTitle: {
    color: 'grey',
    flex: 1,
    fontSize: reactT(40),
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

export default function Picker(props) {
  const initVal = props.value + '';
  const [values, setValues] = useState(initVal ? initVal.split(',') : []);
  const [showMenu, setShowMenu] = useState(false);
  const [isError, setError] = useState(false);
  // 关闭modal
  function closeModal() {
    setShowMenu(false);
  }
  const dict = useMemo(() => props.field.dict || {}, [props.field.dict]);
  const multiple = props.field.multiple;
  // 选择时触发的事件
  function pickItem(picked) {
    let newVal = [];
    if (multiple) {
      if (values.includes(picked)) {
        newVal = values.filter((item) => item !== picked);
      } else {
        newVal = [...values, picked];
      }
    } else {
      newVal = [picked];
      closeModal();
    }
    setValues(newVal);
    setError(props.onChange(newVal.join(',')));
  }
  const friendVal = useMemo(() => {
    let _friendVal = '';
    values.forEach((val, index) => {
      if (index !== 0) {
        _friendVal = _friendVal + (props.field.connectSymbol || ',');
      }
      _friendVal = _friendVal + (dict[val] ? dict[val].text : val);
    });
    return _friendVal;
  }, [values]);
  return (
    <View style={styles.box}>
      <TouchableWithoutFeedback
        onPress={() => {
          // 只读属性
          if (props.field.readOnly) return;
          setShowMenu(true);
        }}
      >
        <View style={styles.valueBox}>
          <Text style={[styles.value, props.field.style]}>{friendVal}</Text>
          {isError ? (
            <View style={styles.errorBox}>
              <Icon name="alert-circle" color="red" size={reactT(50)} />
              <Text style={styles.errorText}>
                {props.field.schema.errorMessage}
              </Text>
            </View>
          ) : null}
          <Icon
            name={showMenu ? 'chevron-down' : 'chevron-right'}
            color="grey"
            size={reactT(50)}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal transparent={true} visible={showMenu} onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBox}>
            <View style={styles.modal}>
              <ScrollView>
                {Object.values(dict).map((item, index) => (
                  <TouchableWithoutFeedback
                    key={item.value}
                    onPress={() => pickItem(item.value + '')}
                  >
                    <View
                      style={[
                        styles.selection,
                        {
                          borderBottomWidth:
                            index === Object.values(dict).length - 1
                              ? 0
                              : onePx,
                        },
                      ]}
                    >
                      <Text style={styles.selectionTitle}>
                        {dict[item.value] ? dict[item.value].text : item.value}
                      </Text>
                      {values.includes(item.value + '') ? (
                        <Icon
                          name="check-circle"
                          color="#16e918"
                          size={reactT(50)}
                        />
                      ) : null}
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
Picker.propTypes = {
  field: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
};
Picker.defaultProps = {
  field: {},
  value: '',
  onChange: () => {},
};
