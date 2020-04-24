import React, { Component } from 'react'
import styles from './index.scss';
import { Modal, ConfigProvider } from 'antd'
import logo from '../../../images/common/logo2.png'
import bank from '../../../images/pay/yinlian_logo.png'
import localforage from 'localforage'
import api from '../../../api/api'
import zhCN from 'antd/es/locale/zh_CN';
console.log({styles})
const { confirm } = Modal
class Header extends Component {
  state = {
    collapsed: false,
    userInfo: {}
  };
  
  componentDidMount() {
    localforage.getItem('userInfo').then((res) => {
      if (res) {
        this.setState({
          userInfo: res
        })
      }
    })
  }
  showConfirm() {
    let that = this
    confirm({
      title: '提示',
      content: '是否确定退出登录？',
      onOk() {
        console.log('OK');
        that.loginOut()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }  
  loginOut() {
    api.sellerLoginOut().then((res) => {
      if (res.result === 1) {
        console.log('登出成功')
        sessionStorage.clear()
        localStorage.removeItem('user')
        localforage.clear().then((res) => {
          window.location.href='https://www.nongline.com'
        })
      }
    })
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  downLoad() {
    window.open('https://www.nongline.com/download')
  }
  // componentDidMount() {
  //   console.log(this.props)
  // }
  render() {
    let content
    if (this.props.type === 'cashier') {
      content = <div className={styles.word}>收银台</div>
    }
    if (this.props.type === 'payOnline') {
      content = <img src={bank} alt='logo' />
    }
    return (
      <ConfigProvider locale={zhCN}>
      <div className={styles.layoutHeaderWrapper}>
        <div className={`${styles.layoutContent} ${styles.flex_dom} ${styles.flex_item_between} ${styles.commonHeader}`}>
          <div className={`${styles.logoBox} ${styles.flex_dom} ${styles.flex_item_mid}`}>
            <img src={logo} className={styles.img} alt='logo' />
            {this.props.type && <div className={styles.line}></div>}
            {content}
          </div>
          <div className={`${styles.headerRight} ${styles.flex_dom} ${styles.flex_item_mid}`}>
            <div className={`${styles.appdownload} ${styles.mr60}`} onClick={() => this.downLoad()}>APP下载</div>
            <div className={styles.userInfo}>
              <span className={styles.mr10}>{this.state.userInfo.realname || this.state.userInfo.nickname}</span>
              <span onClick={() => this.showConfirm()}>[ 退出 ]</span>
            </div>
          </div>
        </div>
      </div>
      </ConfigProvider>
    )
  }
}

export default (Header)
