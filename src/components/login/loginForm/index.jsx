import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './index.scss';
import { Button, Input, Form, message } from 'antd';
import store from '../../../store'
import API from '@/api/api'
import MD5 from 'md5'
import localforage from 'localforage'
class LoginForm extends Component {
  //   static propTypes = {
  //     amount: PropTypes.number.isRequired,
  //   }
  state = {
    login_tips: '验证码登录',
    pwdLogin: false,
    isForgetPwd: false,
    loginForm: 1,
    countNumber: 60,
    showTime: false // 是否显示倒计时
  }
  componentDidMount() {
    // this.sort([8,2,1,9,99,3])
    store.subscribe(() => {
      console.log('改变了', store.getState())
      this.setState({
        loginForm: store.getState().loginForm === 1 ? true : false
      })
      if (store.getState().loginForm === 1) {
        this.setState({
          login_tips: '密码登录',
          pwdLogin: true,
          isForgetPwd: false
        })
      }
    })
  }
  sort(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i -1; j++) { 
        if (arr[j] > arr[j + 1]) {
            let item = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = item;
        }
      }
    }
    console.log(arr)
  }
  changeButton() {
    console.log(this.state.isForgetPwd)
    if (this.state.isForgetPwd) {
      this.setState({
        isForgetPwd: false,
        login_tips: '密码登录',
        pwdLogin: true
      })
      return
    }
    this.setState({
      pwdLogin: !this.state.pwdLogin,
      login_tips: this.state.pwdLogin ? '验证码登录' : '密码登录'
    })
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let type = this.state.pwdLogin ? 1 : 2
        if (!this.state.loginForm) { // 表示点击的是注册按钮
          this.register(values)
          return
        }
        if (this.state.isForgetPwd) { // 是否忘记密码
          this.submitForm(values)
        } else {
          this.postLogin(type, values)
        }
      }
    });
  }
  // 注册接口
  async register(values) {
    console.log({ values })
    await API.userRegister({ mobile: values.phone, code: values.code, passwd: (MD5(values.password)).toUpperCase() }).then((res) => {
      if (res.result === 1) {
        this.setState({
          isForgetPwd: false,
          login_tips: '密码登录',
          pwdLogin: true,
          loginForm: true // 切换至登录
        })
      }
    })
  }
  // 倒计时 60s
  countDown() {
    this.timer = setInterval(() => {
      this.setState({
        countNumber: this.state.countNumber - 1
      }, () => {
        if (this.state.countNumber === 0) {
          clearInterval(this.timer)
          this.setState({
            countNumber: 60,
            showTime: false
          })
        }
      })
    }, 1000)
  }
  // 忘记密码 -- 提交数据
  async submitForm(values) {
    console.log(values)
    if (values.newPwd !== values.repeatPwd) {
      message.error('两次新密码输入不一致')
      return
    }
    await API.findPwd({ mobile: values.phone, passwd: (MD5(values.newPwd)).toUpperCase(), type: 3, code: values.code }).then((res) => {
      console.log({ res })
      if (res.result === 1) {
        this.setState({
          isForgetPwd: false,
          login_tips: '密码登录',
          pwdLogin: true
        })
      }
    })
  }
  // 获取验证码
  async getCode(type) {
    if (!this.props.form.getFieldValue('phone')) {
      message.error('请填写手机号码')
      return
    }
    await API.getSmsCode({ mobile: this.props.form.getFieldValue('phone') }, type).then((res) => {
      if (res.result === 1) {
        this.setState({
          showTime: true
        })
        this.countDown()
      }
    })
  }
  async postLogin(type, values) {
    let passwd = type === 1 ? (MD5(values.password)).toUpperCase() : ''
    await API.sellerLogin({ mobile: values.phone, passwd, type, code: values.code }).then((res) => {
      console.log({ res })
      if (res.result === 1) {
        message.success(res.msg);
        localforage.setItem('user', res.data).then(() => {
          this.getUserInfo()
        })
      }
    })
  }
  async getUserInfo() {
    await API.getUserInfo().then((res) => {
      console.log('userInfo', res)
      localforage.setItem('userInfo', res.data).then((res) => {
        localStorage.setItem('user', JSON.stringify(res))
        this.props.history.push({pathname: '/orderManage/myOrder'})
      })
    })
    // setTimeout(() => {
    //   this.props.history.push({ pathname: '/orderManage/myOrder' })
    // }, 1000)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const phone = this.props.form.getFieldValue('phone')
    let pwdInput
    if (this.state.pwdLogin && !this.state.isForgetPwd) {
      pwdInput = <Form.Item className={styles.password} >{getFieldDecorator('password', {
        rules: [{ required: true, message: 'Please input your Password!' }],
      })(
        <Input
          type="password"
          placeholder="密码"
        />,
      )}</Form.Item>
    } else {
      if (this.state.isForgetPwd) {
        pwdInput = ''
      } else {
        pwdInput = <div className={`${styles.password} ${styles.flex_dom} ${styles.flex_item_between}`}><Form.Item>{getFieldDecorator('code', {
          rules: [{ required: true, message: 'Please input your code!' }],
        })(<Input placeholder='请输入验证码' type='password' />)}</Form.Item>
        {
          this.state.showTime ? <div className={styles.countNumber}>{this.state.countNumber}秒后重新获取</div> :
          <div className={`${styles.getSmsCode} ${!phone && styles.sendColor}`} onClick={() => this.getCode(1)}>获取短信验证码</div>
        }
        </div>
      }
    }
    return (
      <Form onSubmit={(e) => this.handleSubmit(e)} className={styles.loginForm}>
        {/* true 代表登录 */}
        {this.state.loginForm  ?
          <div className={styles.form}>
            <h2>{this.state.login_tips}</h2>
            <Form.Item className={styles.tel}>
              {getFieldDecorator('phone', {
                rules: [{ required: true, message: 'Please input your phone!' }],
              })(
                <Input
                  placeholder="手机号"
                />,
              )}
            </Form.Item>
            {pwdInput}
            {
              this.state.isForgetPwd &&
              <div>
                <div className={`${styles.password} ${styles.flex_dom} ${styles.flex_item_between}`}><Form.Item>{getFieldDecorator('code', {
                  rules: [{ required: true, message: 'Please input your code!' }],
                })(<Input placeholder='请输入验证码' type='password' />)}</Form.Item>
                {
                  this.state.showTime ? <div className={styles.countNumber}>{this.state.countNumber}秒后重新获取</div> :
                  <div className={`${styles.getSmsCode} ${!phone && styles.sendColor}`} onClick={() => this.getCode(2)}>获取短信验证码</div>
                }
                </div>
                <Form.Item className={styles.tel}>
                  {getFieldDecorator('newPwd', {
                    rules: [{ required: true, message: 'Please input your newPwd!' }],
                  })
                    (<Input placeholder='设置新密码' type='password' />)}
                </Form.Item>
                <Form.Item className={styles.tel}>
                  {getFieldDecorator('repeatPwd', {
                    rules: [{ required: true, message: 'Please input your repeatPwd!' }],
                  })
                    (<Input placeholder='重复新密码' type='password' />)}
                </Form.Item>
              </div>
            }
            {
              !this.state.isForgetPwd && 
                <div className={`${styles.checkTips} ${styles.flex_dom} ${styles.flex_item_between} ${styles.mt20}`}>
                  <div className={styles.changeButton} onClick={() => this.changeButton()}>
                    {this.state.pwdLogin ? '验证码登录' : '密码登录'}
                  </div>
                  <div className={styles.forget} onClick={() => this.setState({ isForgetPwd: true, login_tips: '忘记密码' })}>
                    忘记密码？
                  </div>
                </div>
            }
            <Form.Item>
              <Button type="primary" htmlType="submit" size='large' className={`${styles.loginButton} ${styles.mt20}`}>{this.state.isForgetPwd ? '提交' : '立即登录'}</Button>
            </Form.Item>
          </div> :
          <div className={styles.form}>
            <h2>注册</h2>
            <Form.Item className={styles.tel}>
              {getFieldDecorator('phone', {
                rules: [{ required: true, message: 'Please input your phone!' }],
              })(
                <Input
                  placeholder="手机号"
                />,
              )}
            </Form.Item>
            <div className={`${styles.password} ${styles.flex_dom} ${styles.flex_item_between}`}><Form.Item>{getFieldDecorator('code', {
              rules: [{ required: true, message: 'Please input your code!' }],
            })(<Input placeholder='请输入验证码' type='password' />)}</Form.Item>
              {
                  this.state.showTime ? <div className={styles.countNumber}>{this.state.countNumber}秒后重新获取</div> :
                  <div className={`${styles.getSmsCode} ${!phone && styles.sendColor}`} onClick={() => this.getCode(3)}>获取短信验证码</div>
                }
            </div>
            <Form.Item className={styles.tel}>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your password!' }],
              })
                (<Input placeholder='设置密码' type='password' />)}
            </Form.Item>
            <Form.Item>
              <Button type="primary" size='large' htmlType="submit" className={`${styles.loginButton} ${styles.mt20}`}>立即注册</Button>
            </Form.Item>
            <div className={`${styles.loginTips} ${styles.mt20}`}>注册即代表你同意<span>《农联在线注册服务条款》</span></div>
          </div>
        }
        {/* <div className='form'>
          <h2>{this.state.login_tips}</h2>
          <div className='tel'>
            <input placeholder='手机号' />
          </div>
          <div className='password flex_dom flex_item_between'><input placeholder='请输入验证码' style={{'width': '60%'}} type='password' />
            <div className='getSmsCode'>获取短信验证码</div>
          </div>
          <div className='tel'>
            <input placeholder='设置密码' type='password' />
          </div>
          <Button type="primary" size='large' className='login-button mt20'>立即注册</Button>
          <div className='loginTips mt20'>注册即代表你同意<span>《农联在线注册服务条款》</span></div>
        </div> */}
        {/* <div className='form'>
          <h2>{this.state.login_tips}</h2>
          <div className='tel'>
            <input placeholder='手机号' />
          </div>
          {pwdInput}
          {
            this.state.isForgetPwd == true && 
            <div>
                <div className='password flex_dom flex_item_between'><input placeholder='请输入验证码' style={{'width': '60%'}} type='password' /><div className='getSmsCode'>获取短信验证码</div></div>
                <div className='tel'>
                  <input placeholder='设置新密码' type='password' />
                </div>
                <div className='tel'>
                  <input placeholder='重复新密码' type='password' />
                </div>  
            </div>
          }
          <div className='check-tips flex_dom flex_item_between mt20'>
            <div className='change-button' onClick={() => this.setState({pwdLogin: !this.state.pwdLogin})}>
              {this.state.pwdLogin ? '密码登录' : '验证码登录'}
            </div>
            <div className='forget' onClick={() => this.setState({isForgetPwd: true})}>
              忘记密码？
            </div>
          </div>
          <Button type="primary" size='large' className='login-button mt20'>立即登录</Button>
        </div> */}
      </Form>
    )
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(LoginForm);
export default connect('', '')(WrappedNormalLoginForm)
// export default App;
