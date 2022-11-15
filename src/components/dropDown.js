/**
 * 下拉框组件
 */

import ModalDropdown from '~/components/modalDropDown';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { reactH, reactT, reactW } from '~/utils/getScreenProps';

export default function DropDown(props = {}) {
  const { data, defaultValue, onSelect, multipleSelect } = props;

  const _onSelect = (...args) => {
    onSelect(...args);
  };

  return (
    <ModalDropdown
      defaultValue={defaultValue}
      options={data}
      multipleSelect={multipleSelect}
      onSelect={_onSelect}
      style={styles.drop}
      textStyle={styles.dropText}
      dropdownStyle={styles.dropdown}
      dropdownTextStyle={styles.dropdownText}
      dropdownTextHighlightStyle={styles.dropdownTextHighlight}
      // renderRightComponent={() => (
      //     <Icon name='decrease' size={reactT(50)} style={styles.iconStyle} />
      // )}
      renderButtonText={(rowData) => {
        return `${rowData.title}`;
      }}
      renderRow={(rowData) => {
        return <Text style={styles.dropdownText}>{rowData.title}</Text>;
      }}
    />
  );
}

DropDown.propTypes = {
  data: PropTypes.array,
  defaultValue: PropTypes.string,
};

DropDown.defaultProps = {
  data: [],
  defaultValue: '请选择',
};
const styles = StyleSheet.create({
  drop: {
    width: reactW(400),
    height: reactH(90),
    borderWidth: reactT(2),
    borderRadius: reactT(10),
    borderColor: '#B4C7E7',
    justifyContent: 'space-between',
  },
  dropText: {
    fontSize: reactT(32),
    color: '#B4C7E7',
    height: reactH(90),
    marginLeft: reactW(5),
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  dropdown: {
    width: reactW(400),
  },
  dropdownText: {
    fontSize: reactT(30),
    paddingVertical: reactH(20),
    paddingHorizontal: reactW(10),
    color: '#777',
  },
  dropdownTextHighlight: {
    flex: 1,
    backgroundColor: '#53a3fd',
    color: '#FFFFFF',
  },
  iconStyle: {
    position: 'absolute',
    right: 0,
    marginLeft: reactW(300),
  },
});
