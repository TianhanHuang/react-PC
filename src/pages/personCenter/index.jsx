import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './index.scss';
import { Form, Input, Radio, DatePicker, Button, message, Upload } from 'antd'
import API from '@/api/api'
import { getBirthDay } from '@/utils/common'
import localforage from 'localforage'
import moment from 'moment'
import axios from 'axios'
import dp_logo from '../../images/person/dp_logo.png'
class PersonCenter extends Component {
  static propTypes = {
  }
  state = {
    nav: ['基本资料', '头像照片'],
    _index: 0,
    confirmDirty: false,
    nickname: '',
    fileList: [],
    showImg: false,
    userInfo: ''
  }
  componentDidMount() {
    this.getUserInfo()
    console.log(JSON.parse(localStorage.getItem('user')))
  }
  handleUpload = () => {
    console.log('99')
    if (!this.state.fileList.length) {
      return message.error('请选择要上传的图片')
    }
    const { fileList } = this.state;
    const formData = new FormData();
    formData.append('image', fileList[0]);
    this.setState({
      uploading: true,
    });

    // You can use any AJAX library you like
    let account
    let token
    localforage.getItem('user').then((res) => {
      account = res.account_id
      token = res.token
      axios({
        url: `https://devwww.nongline.cn/buyer/api/user/update-user-image?account_id=${account}&token=${token}&platform=pc`,
        method: 'post',
        processData: true,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        if (res.data.result === 1) {
          message.success(res.data.msg)
          this.getUserInfo()
          localforage.getItem('userInfo').then((res1) => {
            let data = res1
            data.avatar_thumb = res.data.data.url
            console.log({data})
            localforage.setItem('userInfo', data)
            localStorage.setItem('user', JSON.stringify(data))
            window.location.reload()
          })
        }
      })
    })
  };
  // 获取用户信息
  getUserInfo() {
    API.getUserInfo().then((res) => {
      console.log({ res })
      this.setState({
        userInfo: res.data
      })
      this.props.form.setFieldsValue({
        nickname: res.data.nickname || '',
        realname: res.data.realname || '',
        sex: res.data.sex
      })
      this.setState({
        birthday: res.data.birthday
      })
    })
  }
  handleSubmit = e => {
    e.preventDefault();
    let that = this
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('123', values.birthday._d)
      if (!err) {
        console.log('Received values of form: ', values);
        that.save({ ...values, birthday: getBirthDay(values.birthday._d) })
      }
    });
  };
  onChange(e) {
    // this.setState({
    //   value: e.target.value,
    // });
  }
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  changeStatus(item, index) {
    if (index === 0) {
      this.getUserInfo()
    }
    this.setState({
      _index: index
    })
  }
  save(formParams) {
    API.updateUserInfo(formParams).then((res) => {
      console.log({ res })
      if (res.result === 1) {
        message.success(res.msg)
        // this.changeLocal(res)
      }
    })
  }
  // 改变更新本地缓存信息
  changeLocal(res) {
    localforage.getItem('userInfo').then((res1) => {
      localforage.setItem('userInfo', { ...res1, ...res.data })
      localStorage.setItem('user', JSON.stringify({ ...res1, ...res.data }))
      window.location.reload()
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { fileList } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
    };
    const config = {
      initialValue: moment(this.state.birthday, 'YYYY-MM-DD'),
      rules: [{ type: 'object', required: false, message: '请选择出生日期' }],
    };
    let { _index } = this.state
    let layout = null
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        console.log(file)
        this.setState(state => ({
          fileList: [file],
        }));
        return false;
      },
      onChange: file => {
        this.setState({
          showImg: true
        }, () => {
          var imgFile = file.file;
          var fr = new FileReader();
          fr.onload = function () {
              document.getElementById('previewImg').src = fr.result;
          };
          fr.readAsDataURL(imgFile);
          })
      },
      fileList,
    }
    if (_index === 0) {
      layout = <div className={styles.baseInfo}>
        <p>亲爱的{JSON.parse(localStorage.getItem('user')).realname || JSON.parse(localStorage.getItem('user')).nickname}，请填写真实的资料，方便商家快速找到你哦。</p>
        <Form {...formItemLayout} onSubmit={this.handleSubmit} className={styles.form}>
          <Form.Item label="用户头像">
            <img src={this.state.userInfo.avatar_thumb} alt='用户头像' />
          </Form.Item>
          <Form.Item label="用户昵称">
            {getFieldDecorator('nickname', {
              rules: [
                {
                  required: true,
                  message: '请输入 您的昵称',
                },
              ],
            })(<Input size='default' placeholder='请输入您的昵称' />)}
          </Form.Item>
          <Form.Item label="真实姓名">
            {getFieldDecorator('realname', {})(<Input size='default' placeholder='请输入您的真实姓名' />)}
          </Form.Item>
          <Form.Item label="性别">
            {getFieldDecorator('sex', {
              rules: [
                {
                  required: true,
                  message: '请选择您的性别',
                },
              ],
            })(
              <Radio.Group onChange={(e) => this.onChange(e)}>
                <Radio value={1}>男</Radio>
                <Radio value={2}>女</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="生日">
            {getFieldDecorator('birthday', config)(
              <DatePicker />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.saveBtn}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    } else {
      layout = <div className={styles.headPhoto}>
        <Upload {...props}>
          <Button className={styles.uploadImg}>选择你要上传的图片</Button>
        </Upload>
        <div className={styles.uploadForm}>
          <div className={styles.formLeft}>
            <p>仅支持JPG、GIF、PNG、JPEG、BMP格式，文件小于4M</p>
            <div className={styles.imgBox}>
              {
                !this.state.showImg ? <p>选择一张本地图片编辑后上传为图像</p> : <img id='previewImg' src='' alt='previewImg' />
              }
            </div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.formRight}>
            <p>你上传的图片会自动生成2种尺寸，请注意小尺寸的头像</p>
            <div className={styles.imgs}>
              <div className={styles.img1}>
                <img src={dp_logo} alt='dp_logo'></img>
                <p>100x100像素</p>
              </div>
              <div className={styles.img2}>
                <img src={dp_logo} alt='dp_logo'></img>
                <p>50x50像素</p>
              </div>
            </div>
          </div>
        </div>
        <Button type="primary" className={styles.saveBtn2} onClick={() => this.handleUpload()}>保存</Button>
      </div>
    }
    return (
      <div className={styles.personCenterWrap}>
        <div className={`${styles.classfiy} ${styles.flex_dom}`}>
          {
            this.state.nav.map((item, index) => <div className={`${styles.item} ${_index === index && styles.active}`} key={index} onClick={() => this.changeStatus(item, index)}><div className={styles.itemWrap}>{item}</div></div>)
          }
        </div>
        {
          layout
        }
      </div>
    )
  }
}
const WrappedRegistrationForm = Form.create({ name: 'UserInfo' })(PersonCenter);
export default connect('', '')(WrappedRegistrationForm)
