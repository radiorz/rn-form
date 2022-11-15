/**
 *  richForm的layout组件
 *
 *  props
 *
 *  例子
 */
import Button from '~/components/button';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { reactW } from '~/utils/getScreenProps';

const styles = StyleSheet.create({
  actions: {
    paddingHorizontal: reactW(20),
    flexDirection: 'row',
  },
  action: {
    backgroundColor: '#40a9ff',
    marginHorizontal: reactW(20),
  },
});

export default function Actions(props) {
  return (
    <View style={styles.actions}>
      {props.actions.map((action, index) => (
        <Button
          key={action.name}
          style={Object.assign({}, styles.action, action.style)}
          onPress={() => props.onActionClick(action.name)}
        >
          {action.title}
        </Button>
      ))}
    </View>
  );
}
Actions.propTypes = {
  actions: PropTypes.array,
  onActionClick: PropTypes.func,
};
Actions.defaultProps = {
  actions: [],
  onActionClick: () => {},
};
