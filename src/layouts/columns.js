/**
 *  richForm的layout组件
 *
 *  props
 *
 *  例子
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
const styles = StyleSheet.create({});

export default function Columns(props) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {props.field.columns.map((column, index) => (
        <View key={index} style={{ flex: 1 }}>
          {props.getLayout({ layout: column }, props.values)}
        </View>
      ))}
    </View>
  );
}
Columns.propTypes = {
  field: PropTypes.object,
  values: PropTypes.object,
  getLayout: PropTypes.func,
};
Columns.defaultProps = {
  field: {},
  values: {},
  getLayout: () => {},
};
