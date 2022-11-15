/**
 *  richForm的layout组件
 *
 *  props
 *
 *  例子
 */
import Icon from '~/components/icon';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { onePx, reactH, reactT, reactW } from '~/utils/getScreenProps';

const styles = StyleSheet.create({
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: reactW(10),
    paddingVertical: reactH(8),
    borderBottomColor: '#dfe4ed',
    borderBottomWidth: onePx,
  },
  groupTitle: {
    flex: 1,
    color: '#40a9ff',
    fontSize: reactT(40),
  },
});
// 保存上次的展开,即使表单关闭了
let expandFields = {};
export default function Group(props) {
  const field = props.field;
  // 如果设置是否展开,则取设置值,否则取上次保留的值
  const [expand, setExpand] = useState(
    'expand' in field ? field.expand : expandFields[field.name]
  );
  useEffect(() => {
    expandFields[field.name] = expand;
  }, [expand]);
  return (
    <View>
      <TouchableWithoutFeedback
        onPress={() => {
          setExpand(!expand);
        }}
      >
        <View style={styles.groupHeader}>
          {field.deletable ? (
            <Icon
              onPress={() => props.onActionClick(field.name)}
              name="error_circle"
              color="red"
              size={reactT(50)}
              style={{ marginRight: reactW(4) }}
            />
          ) : null}
          {field.iconConfig ? (
            <Icon
              name={field.iconConfig.name}
              color={field.iconConfig.color || '#40a9ff'}
              size={field.iconConfig.size || reactT(50)}
              style={field.iconConfig.style}
            />
          ) : null}
          <Text style={styles.groupTitle}>
            {field.syncTitle
              ? path(field.syncTitle.split('.'), props.values)
              : field.title}
          </Text>
          <Icon
            name={expand ? 'chevron-down' : 'chevron-right'}
            color="#40a9ff"
            size={reactT(50)}
          />
        </View>
      </TouchableWithoutFeedback>
      {expand ? props.getLayout(field, props.values) : null}
    </View>
  );
}
Group.propTypes = {
  field: PropTypes.object,
  values: PropTypes.object,
  getLayout: PropTypes.func,
  onActionClick: PropTypes.func,
};
Group.defaultProps = {
  field: {},
  values: {},
  getLayout: () => {},
  onActionClick: () => {},
};
