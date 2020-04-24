import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './index.scss';
import { Form, Input, Checkbox, Table, Divider, Popconfirm, Button, message, Cascader } from 'antd'
import API from '@/api/api'
import { Link } from 'react-router-dom'
const { TextArea } = Input;
class PersonAddress extends Component {
  static propTypes = {
  }
  state = {
    options: '',
    tableData: [],
    children1: [],
    children2: [],
    selectAddressArr: [],
    loading: true,
    addressId: '',
    area: [],
    edit: false,
    Checkbox: false
  }
  componentDidMount() {
    this.getAddress()
    this.getAddressArea(null, 1)
  }
  componentDidUpdate(nextProps, nextState) {
      console.log(nextProps)
      console.log(nextState)
      if (this.GetRequest(nextProps.history.location.search).id !== nextState.addressId) { // 当有id的时候为编辑状态
        this.getAddressInfo(this.GetRequest(nextProps.location.search).id)
        this.setState({
          addressId: this.GetRequest(nextProps.location.search).id
        })
      }
  }
  // 编辑的时候获取地址的详情
  getAddressInfo(id) {
    API.getAddressInfo({receipt_id: id}).then((res) => {
      console.log('详情', res)
      if (res.result === 1) {
        this.setState({
          area: [res.data.province, res.data.city, res.data.county],
          Checkbox: res.data.is_default ? true : false
        })
        this.props.form.setFieldsValue({
          address_detail: res.data.address_detail,
          zip_code: res.data.zip_code,
          receiver: res.data.receiver,
          receiver_phone: res.data.receiver_phone,
          telephone: res.data.telephone
        })
      }
    })
  }

  //如果条件不存在必须要返回null   
  static getDerivedStateFromProps(props, current_state) {
    return true
  }
  GetRequest(search) {
    let url = search; //获取url中"?"符后的字串
    // let theRequest = new Object();
    let theRequest = {}
    if (url.indexOf("?") !== -1) {
      let str = url.substr(1);
      let strs = str.split("&");
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  }
  // 获取省市区三级联动地址
  getAddressArea(parentId, level) {
    console.log({ level })
    API.getAddressArea({ parent_id: parentId }).then((res) => {
      console.log('address', res)
      if (res.result === 1) {
        if (level === 1) {
          this.setState({
            parentList: res.data
          })
        } else if (level === 2) {
          this.setState({
            children1: res.data
          })
        } else if (level === 3) {
          this.setState({
            children2: res.data
          })
        }
      }
    })
  }
  // 获取收货地址
  getAddress() {
    this.setState({
      loading: true
    })
    API.getAddressList().then((res) => {
      console.log('list', res)
      if (res.result === 1) {
        this.setState({
          tableData: res.data,
          loading: false
        })
      }
    })
  }
  // 设置默认地址
  setDefault(item) {
    console.log({ item })
    API.saveAddress({ receipt_address: { ...item, is_default: 1 } }).then((res) => {
      console.log("address", res)
      if (res.result) {
        message.success('设置成功')
        this.getAddress()
      }
    })
  }
  // 删除收货地址
  deleteAddress(item) {
    API.deleteAddress({ receipt_id: item.receipt_id }).then((res) => {
      console.log('delete', res)
      if (res.result === 1) {
        message.success(res.msg)
        this.getAddress()
      }
    })
  }
  loadData = (selectedOptions) => {
    console.log({ selectedOptions })
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.getAddressArea(targetOption.area_id, parseInt(targetOption.level) + 1)
    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;
      if (parseInt(targetOption.level) === 1) {
        targetOption.children = this.state.children1
        let arr = this.state.parentList
        arr.forEach((item) => {
          if (item.area_id === targetOption.parentId) {
            item = targetOption
          }
        })
        this.setState({
          parentList: arr,
        });
      }
      if (parseInt(targetOption.level) === 2) {
        targetOption.children = this.state.children2
        let arr = this.state.parentList
        arr.forEach((item) => {
          if (item.area_id === selectedOptions[0].parentId) {
            item = targetOption
          }
        })
        this.setState({
          parentList: arr,
        });
      }
      if (parseInt(targetOption.level) === 3) {
        this.setState({
          parentList: [...this.state.parentList],
        });
      }
      console.log({ targetOption })

    }, 1000);
  };
  onChangeAddress(value, selectedOptions) {
    console.log(value, selectedOptions)
    this.setState({
      selectAddressArr: selectedOptions
    })
  }
  onChange(e) {
    console.log({ e })
  }
  // 表单提交
  handleSubmit = e => {
    e.preventDefault();
    let that = this
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (this.state.edit && parseInt(that.state.selectAddressArr[that.state.selectAddressArr.length - 1].level) !== 3) {
          return message.error('请选择省市区')
        }
        that.save({
          ...values,
          address: values.address_detail,
          is_default: values.is_default ? 1 : 0,
          province: values.area && values.area[0],
          city: values.area && values.area[1],
          county: values.area && values.area[2],
          receipt_id: this.state.addressId || ''
        })
      }
    });
  }
  // 保存
  save(params) {
    console.log(params)
    // if (this.state.tableData.length === 20) {
    //   return message.error('地址添加已达上限')
    // }
    params = { ...params, lat: 1, lng: 1 }
    API.saveAddress({ receipt_address: params }).then((res) => {
      console.log({ res })
      if (res.result === 1) {
        message.success(res.data)
        setTimeout(() => {
          if (this.state.addressId) {
            this.props.history.push({pathname: '/personCenter/address'})
            this.getAddress()
          } else {
            window.location.reload()
          }
        }, 1000)
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 2, offset: -4 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
    };
    const columns = [
      {
        title: '收货人',
        dataIndex: 'receiver',
        align: 'center',
        render: text => <a>{text}</a>,
      },
      {
        title: '所在地区',
        dataIndex: 'address_info',
        align: 'center',
        render: (text, record, index) => <a>{record.province + record.county + record.county}</a>
      },
      {
        title: '详细地址',
        dataIndex: 'address_detail',
        align: 'center',
      },
      {
        title: '电话/手机',
        dataIndex: 'receiver_phone',
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (text, record) => (
          <span>
            <Link
              to={{
                pathname: '/personCenter/address',
                search: `?id=${record.receipt_id}`
              }}
            >
              修改
            </Link>
            <Divider type="vertical" />
            {/* <a>删除</a> */}
            <Popconfirm
              title="是否确定删除该地址?"
              onConfirm={() => this.deleteAddress(record)}
              okText="确认"
              cancelText="取消"
            >
              <a href="#">删除</a>
            </Popconfirm>
          </span>
        ),
      },
      {
        title: '',
        key: 'action2',
        align: 'center',
        render: (text, record) => (
          <span>
            {
              record.is_default ? <Button type='primary'>默认地址</Button> : <Button onClick={() => this.setDefault(record)}>设为默认</Button>
            }
          </span>
        ),
      },
    ];
    const area = this.state.area.map((item) => `${item}`)
    return (
      <div className={styles.personCenterAddressWrap}>
        <div className={`${styles.classfiy} ${styles.flex_dom}`}>
          <div className={styles.title}>收货地址</div>
          <div className={styles.tips}>您已创建<span>{this.state.tableData.length}</span>个收货地址，还可创建<span>{20 - this.state.tableData.length}</span>个</div>
        </div>
        <div className={styles.content}>
          <p className={styles.newAddress}>{this.state.addressId ? '编辑收货地址' : '新增收货地址'}</p>
          <div className={`${styles.sendBox} ${styles.flex_dom}`}>
            <p>当前配送至</p>
            <p>中国大陆</p>
          </div>
          <div className='formWrap'>
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className={styles.form}>
              { !this.state.addressId || this.state.edit ? <Form.Item label="所在地区">
                  {getFieldDecorator('area', {
                    rules: [
                      {
                        required: true,
                        message: '请选择省市区',
                      },
                    ],
                  })(<Cascader
                    fieldNames={{ label: 'name', value: 'name' }}
                    options={this.state.parentList}
                    loadData={this.loadData}
                    onChange={(value, selectedOptions) => this.onChangeAddress(value, selectedOptions)}
                    changeOnSelect
                  />)}
                </Form.Item> :
                  <div className={`${styles.areaWrap} ${styles.flex_dom}`}>
                    <div className={styles.itemTitle}><span>*</span>所在地区：</div>
                    <p>{area}</p>
                    <span className={styles.edit} onClick={() => this.setState({edit: true})}>编辑</span>
                  </div>
                }
              <Form.Item label="详细地址">
                {getFieldDecorator('address_detail', {
                  rules: [
                    {
                      required: true,
                      message: '请输入您的详细地址',
                    },
                  ],
                })(<TextArea rows={4} placeholder='请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息' />)}
              </Form.Item>
              <Form.Item label="邮政编码">
                {getFieldDecorator('zip_code', {
                  rules: [
                    {
                      required: false,
                      message: '请填写您的邮编',
                    },
                  ]
                })(<Input size='default' placeholder='请填写邮编' />)}
              </Form.Item>
              <Form.Item label="收货人姓名">
                {getFieldDecorator('receiver', {
                  rules: [
                    {
                      required: true,
                      message: '请填写收货人姓名',
                    },
                  ]
                })(<Input size='default' placeholder='长度不超过25字符' />)}
              </Form.Item>
              <Form.Item label="手机号码">
                {getFieldDecorator('receiver_phone', {
                  rules: [
                    {
                      required: true,
                      message: '请输入您的手机号',
                    },
                  ]
                })(<Input size='default' placeholder='请输入手机号' />)}
              </Form.Item>
              <Form.Item label="固定电话">
                {getFieldDecorator('telephone', {
                  rules: [
                    {
                      required: false,
                      message: '请输入您的手机号',
                    },
                  ]
                })(<Input size='default' placeholder='请输入固定电话' />)}
              </Form.Item>
              <Form.Item label="" className={styles.formItem}>
                {getFieldDecorator('is_default', {
                  valuePropName: 'checked',
                  initialValue: this.state.Checkbox
                })(
                  <Checkbox onChange={(e) => this.onChange(e)}>设置为默认收货地址</Checkbox>
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.saveBtn}>
                  保存
              </Button>
              </Form.Item>
            </Form>
          </div>
          <Table rowKey={record => record.receipt_id} loading={this.state.loading} columns={columns} bordered dataSource={this.state.tableData} pagination={false} />
        </div>
      </div>
    )
  }
}
const WrappedRegistrationForm = Form.create({ name: 'AddressInfo' })(PersonAddress);
export default connect('', '')(WrappedRegistrationForm)
