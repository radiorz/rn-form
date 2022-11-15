/**
 *  richForm的upload组件
 *    设计思路：
 *      根据传进来的props.value,在组件里进行修改,不影响父组件;
 *      每次数据变化都需要执行props.onChange(value),value为后台需要的数据,该函数会返回错误信息,无为{}
 *      field支持的属性：
 *      {
 *        readOnly: bool false 是否可读
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
import Modal from '~/components/modal';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { reactT } from '~/utils/getScreenProps';

import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { onePx, reactH, reactW } from '~/utils/getScreenProps';

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: reactH(300),
    width: reactW(70),
    backgroundColor: '#ddd',
    borderColor: '#ccc',
    borderWidth: onePx,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectType: {
    color: 'grey',
    textAlign: 'center',
    paddingVertical: reactH(14),
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
  },
});

export default function Upload(props) {
  const modalRef = useRef();
  const [url, setUrl] = useState(props.value);
  function onselect(url) {
    setUrl(url);
    props.onChange(url);
  }
  function pickImg() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        onselect(image.path);
        modalRef.current.closeModal();
      })
      .catch((e) => {
        _logger.warn(`PICK_IMAGE_FAIL:${e}`);
      });
  }
  function openCamera() {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        onselect(image.path);
        modalRef.current.closeModal();
      })
      .catch((e) => {
        _logger.warn(`OPEN_CAMERA_FAIL:${e}`);
      });
  }
  return (
    <View style={styles.box}>
      <Modal closeByModal={true} ref={modalRef}>
        <TouchableWithoutFeedback onPress={openCamera}>
          <Text style={styles.selectType}>{_t('拍照')}</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <Text style={styles.selectType} onPress={pickImg}>
            {_t('图库中选择')}
          </Text>
        </TouchableWithoutFeedback>
      </Modal>
      <TouchableWithoutFeedback onPress={() => modalRef.current.openModal()}>
        <View style={styles.image}>
          {url ? (
            <View>
              <Image
                source={{ uri: url }}
                style={{
                  height: reactH(300),
                  width: reactW(70),
                }}
              />
              <Icon
                style={styles.closeIcon}
                onPress={() => {
                  if (url === props.value) {
                    onselect('');
                  } else {
                    onselect(props.value);
                  }
                }}
                name="close"
                size={reactT(30)}
              />
            </View>
          ) : (
            <Icon name="plus" color="grey" size={reactW(30)} />
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
Upload.propTypes = {
  field: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
Upload.defaultProps = {
  field: {},
  value: '',
  onChange: () => {},
};
