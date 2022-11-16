/*该组件只能在 react-native中使用
 * 先安装 yarn add  react-native-picker
 * 然后 链接 react-native link react-native-picker
 * cback -- 选择后的回调方法 返回值
 *
 * */
import { Svg as Icon } from '@components/icon';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Picker from 'react-native-picker';
import { reactT } from '~/utils/getScreenProps';
let _Picker = Picker;
export function TimePicker(props) {
  useEffect(() => {
    return () => _Picker.hide();
  });
  //时间
  time = (type) => {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let data = [[], []];
    if (props.startHour) {
      maxHour = props.startHour;
      while (maxHour < 24) {
        data[0].push(maxHour);
        maxHour++;
      }
    } else {
      data = [
        [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23,
        ],
        [],
      ];
    }
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        data[1].push('0' + i);
      } else {
        data[1].push(i);
      }
    }
    pickerInit(data, [h, m], 'timeSetting.select_time', type);
  };
  //组件初始化
  pickerInit = (data, selectedValue, title, type) => {
    Picker.init({
      pickerData: data,
      selectedValue: selectedValue,
      pickerTitleText: title,
      pickerConfirmBtnText: _t('common.check'),
      pickerCancelBtnText: _t('common.cancel'),
      //确定
      onPickerConfirm: (data) => {
        data = data.join(':') + ':00';
        if (type === 'start') {
          setStart(data);
        } else {
          setEnd(data);
        }
      },
    });
    _Picker.show();
  };
  //显示Picker组件
  onPresss = (type) => {
    // 只读属性
    if (props.field.readOnly) return;
    time(type);
  };
  const [startTime, setStart] = useState(props.value.startTime);
  const [endTime, setEnd] = useState(props.value.endTime);
  const [isError, setError] = useState(false);
  useEffect(() => {
    if (startTime && endTime) {
      setError(props.onChange({ startTime, endTime }));
    }
  }, [startTime, endTime]);
  return (
    <View style={styles.valueBox}>
      <TouchableWithoutFeedback onPress={() => onPresss('start')}>
        <Text style={[styles.value, props.field.style]}>
          {startTime || _t('timeSetting.select_time')}
        </Text>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => onPresss('end')}>
        <Text style={[styles.value, props.field.style]}>
          {'-' + (endTime || _t('timeSetting.select_time'))}
        </Text>
      </TouchableWithoutFeedback>
      <Icon name={'chevron-right'} color="grey" size={reactT(50)} />
      {isError ? (
        <View style={styles.errorBox}>
          <Icon name="alert-circle" color="red" size={reactT(50)} />
          <Text style={styles.errorText}>
            {props.field.schema.errorMessage}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  valueBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  value: { color: 'grey', textAlign: 'right', fontSize: reactT(40) },
});
TimePicker.propTypes = {
  field: PropTypes.object,
  value: PropTypes.any,
  onChange: PropTypes.func,
};
TimePicker.defaultProps = {
  field: {},
  value: {},
  onChange: () => {},
};
