/**
 *  显示页面头部menu
 *    由于父组件要调用openModal方法,所以采用react类的构造形式
 *
 *  props
 *   title: PropTypes.string, // modal的标题,未定义则不显示
 *   children: PropTypes.any, // modal的内容
 *   closeByModal: PropTypes.bool, // 是否点击modal关闭
 *   onCheck: PropTypes.func, // 点击确认按钮执行的事件,未定义则不显示
 *   primaryColor: PropTypes.string, // 主色调
 *  methods
 *  events
 *
 *  实例
 *  import Modal from '~/components/modal'
 *  // 父组件为类时的引用
 *  <Modal ref='modal' title='gaga' onCheck={()=>{}} >gaga</Modal>
 *  this.refs.modal
 *  // 父组件为函数时的引用
 *  const modalRef = useRef();
 *  <Modal ref={modalRef} title='gaga' onCheck={()=>{}} >gaga</Modal>
 *  modalRef.current
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Button from '~/components/button';
import Icon from '~/components/icon';
import { reactH, reactT, reactW, onePx } from '~/utils/getScreenProps';
const styles = StyleSheet.create({
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
    overflow: 'hidden',
  },
  header: {
    paddingVertical: reactH(6),
    paddingHorizontal: reactW(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
  },
  main: { minHeight: reactH(40), overflow: 'scroll' },
  actions: {
    justifyContent: 'space-between',
    borderTopColor: '#dcdfe6',
    borderTopWidth: onePx,
    flexDirection: 'row',
  },
  buttons: {
    flexDirection: 'row',
  },
  actionText: {
    fontSize: reactT(30),
    paddingHorizontal: reactW(10),
    paddingVertical: reactH(8),
  },
});
export default class ModalComponent extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    primaryColor: PropTypes.string,
    closeByModal: PropTypes.bool,
    children: PropTypes.any,
    onCheck: PropTypes.any,
  };
  static defaultProps = {
    title: '',
    primaryColor: '#409eff',
    children: '',
    onCheck: undefined,
    closeByModal: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }
  closeModal() {
    this.setState({ showMenu: false });
  }
  openModal() {
    this.setState({ showMenu: true });
  }
  render() {
    return (
      <Modal
        transparent={true}
        visible={this.state.showMenu}
        onRequestClose={this.closeModal.bind(this)}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            if (this.props.closeByModal) {
              this.closeModal();
            }
          }}
        >
          <View style={styles.modalBox}>
            <View style={styles.modal}>
              {this.props.title === '' ? null : (
                <View
                  style={[
                    styles.header,
                    { backgroundColor: this.props.primaryColor },
                  ]}
                >
                  <Text style={styles.title}>{this.props.title}</Text>
                  <TouchableWithoutFeedback
                    onPress={this.closeModal.bind(this)}
                  >
                    <View>
                      <Icon name="close" size={reactT(36)} color="white" />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
              <View style={styles.main}>
                {typeof this.props.children === 'string' ? (
                  <Text>{this.props.children}</Text>
                ) : (
                  this.props.children
                )}
              </View>
              {typeof this.props.onCheck === 'function' ? (
                <View style={styles.actions}>
                  <View />
                  <View style={styles.buttons}>
                    <Button
                      onPress={this.props.onCheck.bind(this)}
                      style={{
                        backgroundColor: this.props.primaryColor,
                        ...styles.actionText,
                      }}
                    >
                      确认
                    </Button>
                    <Button
                      style={{
                        color: 'black',
                        ...styles.actionText,
                      }}
                      onPress={this.closeModal.bind(this)}
                    >
                      取消
                    </Button>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
