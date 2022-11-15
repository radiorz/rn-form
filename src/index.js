/**
 *  richform 组件,字段的验证在每一个字段里面单独进行,默认不能输入错误的值,可以进行提示,对于字段的详细样式取决于layout的field对象值
 *  传递新的props.newForm时,即为新的表单
 *
 *  props
 *    id: string '' 表单的id,用于更新
 *    values: object {}, 表单会对传入的values产生影响
 *    form: object {}  表单的样式
 *                 {
 *                  style: object {} form的style
 *                  titleStyle: object {} field的title样式
 *                  enable: bool true 是否可用,false有灰色样式
 *                  readOnly: bool false 只读,样式不变,只是不可以做修改
 *                  titleSufix: string ':' title的后缀
 *                  actions: array [] 按钮
 *                                 [{
 *                                   name: string 按钮的id,点击传递到父组件
 *                                   title: string 按钮显示的文本
 *                                 }]
 *                  layout: array [] form的样式
 *                                [
 *                                 // 单个字段
 *                                 {
 *                                  name:'', // values对应的字段名称
 *                                  title:'', // 字段显示的标题
 *                                  component:'', // 对应dom的名称
 *                                  schema:{}, // 字段的验证规则
 *                                  enabled:{ // 依赖
 *                                           field:'', // 依赖字段名称
 *                                           schema:{}, // 校验规则
 *                                          }
 *                                  },
 *                                  // 布局
 *                                  {
 *                                   type: 'group', // 可伸缩分组
 *                                   name: string '' 分组独一id,用于分组的伸缩
 *                                   iconConfig: object - 分组的图标
 *                                                      {
 *                                                        name: string - 图标名称
 *                                                        color: string - 图标颜色
 *                                                        size: number - 图标大小
 *                                                        style: string - 图标样式
 *                                                      {
 *                                   title: string '' 分组的标题
 *                                   syncTitle: string '' 标题同步values的某一个字段
 *                                   deletable: bool false 是否可以删除,点击会触发 onActionClick 事件
 *                                   expand: bool false 分组是否展开
 *                                   layout: array [] 分组的布局
 *                                   actions: array [] 按钮,与form同
 *                                  },
 *                                  {
 *                                   type: 'columns', // 多列
 *                                   name: string '' 多列独一id
 *                                   columns: array [] 多列的布局,里面放列的行布局
 *                                                 [[],[],[]]
 *                                  },
 *                                ],
 *                }
 *
 *  events
 *    onActionClick: 点击表单的按钮时,触发的事件
 *      @params name: string - 按钮的名称
 *    onChange: values改变时,触发的事件
 *      @params
 *        values: object {} 新的values值
 *        field: string - 改变的字段名
 *        fieldVal: any - 改变的字段的值
 *
 *  methods:
 *    submit: @params options object { onlyDirty: bool true 是否只上传脏值, url: string '' 上传的url } 提交表单
 *    getDirtyVal: 返回脏值
 *    getFormData: 返回表单数据
 *    getErrors: 返回所有的错误
 *
 *  实例
 *    import RichForm from 'rn-form';
 *    import {useRef} from 'react';
 *
 *    const richformRef = useRef();
 *    <RichForm ref={richformRef} form={{}} values={{}} />
 *    richformRef.current.submit({});
 */
import PropTypes from 'prop-types';
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { path, assocPath } from 'ramda';
// layout 布局
import Columns from './layouts/columns';
import Group from './layouts/group';
import Actions from './layouts/actions';
// 字段
import Field from './field';

// 验证
import Ajv from 'ajv';
const ajv = new Ajv();

const styles = StyleSheet.create({
  form: { width: '100%' },
});

export default function RichForm(props, ref) {
  //以下是组件暴露的函数
  useImperativeHandle(ref, () => {
    return {
      submit,
      getDirtyVal: () => dirtyVal,
      getFormData: () => formData,
      getErrors: () => errors,
    };
  });
  // form的数据
  const [formData, setFormData] = useState({});
  // 有错误的字段
  const [errors, setErrors] = useState([]);
  // 脏值
  const [dirtyVal, setDirtyVal] = useState({});
  // 被依赖的字段,只有当表单更新时,才重置,可以进行直接修改,不会触发更新
  const [dependFields, setDependFields] = useState({});
  // 上传表单数据 TODO:未完成
  function submit({ onlyDirty = true, url = '' }) {
    if (errors.length) return;
    let submitData = {};
    if (onlyDirty) {
      submitData = dirtyVal;
    } else {
      submitData = formData;
    }
  }
  // 获取默认的form值,便于对深度嵌套的字段组件进行管理
  function getDefalutForm(form) {
    return Object.assign(
      // form的一些默认值
      {
        readOnly: false,
        enabled: true,
      },
      props.form,
      // 除了layout和actions其他全部继承props.form
      { layout: [], actions: [] },
      form
    );
  }
  // 用于修改对应的values值,以及对字段进行验证,返回{isError}判断是否符合
  function onFieldChange(values, fieldVal, field) {
    const fieldNameArr = field.name.split('.');
    // 设置脏值
    setDirtyVal((dirtyVal) => assocPath(fieldNameArr, fieldVal)(dirtyVal));
    // 更新form的数据
    values = Object.assign(values, assocPath(fieldNameArr, fieldVal)(values));
    setFormData(values);
    // 当依赖值变化时,重新刷新表单
    if (dependFields[field.name]) {
      setLayout(getLayout(props.form, values));
    }
    // 是否有错误
    let isError = false;
    if (!ajv.compile(field.schema)(fieldVal)) {
      isError = true;
      setErrors((errors) => {
        if (!errors.includes(field.name)) {
          errors.push(field.name);
        }
        return errors;
      });
    } else {
      setErrors((errors) => errors.filter((error) => error !== field.name));
    }
    // 传递值到父组件
    props.onChange(values, field.name, fieldVal);
    // 返回是否有错误
    return isError;
  }
  // 获取form的布局,需要重复回调,所以采用函数
  function getLayout(form, values) {
    form = getDefalutForm(form);
    return (
      <View>
        {form.layout.map((initField) => {
          // 接收form的统一设置,暂时只支持readOnly属性
          const field = Object.assign({ readOnly: form.readOnly }, initField);
          const type = field.type;
          // 多列的布局
          if (type === 'columns') {
            return (
              <Columns
                key={field.name}
                field={field}
                getLayout={getLayout}
                values={values}
              />
            );
          } else if (type === 'group') {
            return (
              <Group
                key={field.name || field.id}
                field={field}
                getLayout={getLayout}
                values={values}
                onActionClick={props.onActionClick}
              />
            );
          } else {
            // 是否依赖成立
            let enabled = form.enabled;
            if (field.enabled) {
              let dependField = field.enabled.field.split('.');
              let defaultVal = path(dependField)(values);
              enabled = ajv.compile(field.enabled.schema)(defaultVal);
              // 保存依赖值,当依赖值变化时,更新表单
              dependFields[field.enabled.field] = true;
              setDependFields(dependFields);
            }
            return (
              <Field
                key={field.name + props.id}
                form={form}
                field={field}
                enabled={enabled}
                onFieldChange={onFieldChange}
                values={values}
              />
            );
          }
        })}
        <Actions
          actions={form.actions}
          onActionClick={(name) => props.onActionClick(name)}
        />
      </View>
    );
  }
  const [Layout, setLayout] = useState(<View />);
  useEffect(() => {
    setErrors([]);
    setDependFields({});
    setDirtyVal({});
    setFormData(props.values);
    setLayout(getLayout(props.form, { ...props.values }));
  }, [props.id]);
  return (
    <ScrollView style={[styles.form, props.form.style]}>{Layout}</ScrollView>
  );
}
RichForm = forwardRef(RichForm);
RichForm.propTypes = {
  onChange: PropTypes.func,
  onActionClick: PropTypes.func,
  id: PropTypes.any,
  form: PropTypes.object,
  values: PropTypes.object,
};
RichForm.defaultProps = {
  onChange: () => {},
  onActionClick: () => {},
  id: '',
  form: {},
  values: {},
};
