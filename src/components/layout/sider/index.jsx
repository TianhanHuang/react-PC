import React, { Component } from 'react'
import styles from './index.scss';
import { Icon } from 'antd';
import localforage from 'localforage';
import { withRouter } from 'react-router-dom'
import API from '@/api/api'
class Sider extends Component {
  state = {
    collapsed: false,
    _navIndex: '',
    _navIndex2: '',
    navList: [
      { name: '订单管理', status: false, children: [
        { name: '我的订单', status: false, url: '/orderManage/myOrder'},
        { name: '我的账期', status: false, url: '/orderManage/accountPeriod' }]
      },
      { name: '个人中心', status: false, children: [
        { name: '个人信息', status: false, url: '/personCenter/index'},
        { name: '收货地址', status: false, url: '/personCenter/address' }]
      }
    ],
    userInfo: {}
  };
  componentDidMount() {
    // localforage.getItem('userInfo').then((res) => {
    //   if (res) {
    //     this.setState({
    //       userInfo: res ? res : null
    //     })
    //   }
    // })
    this.getUserInfo()
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  openNav(index) {
    this.setState({
      navList: this.state.navList.map((item, _index) => _index === index ? { ...item, status: !this.state.navList[index].status } : item)
    })
  }
  // 获取用户信息
  getUserInfo() {
    API.getUserInfo().then((res) => {
      if (res.result === 1) {
        this.setState({
          userInfo: res.data
        })
      }
    })
  }
  openChildren(index, index2) {
    this.setState({
      _navIndex: index,
      _navIndex2: index2
    })
    this.props.history.push({
      pathname: this.state.navList[index].children[index2].url
    })
    // let navList = this.state.navList
    // navList[index].children[index2].status = !navList[index].children[index2].status
    // this.setState({
    //   navList
    // })
  }
  // componentDidMount() {
  //   console.log(this.props)
  // }
  render() {
    let _navIndex = this.state._navIndex
    let _navIndex2 = this.state._navIndex2
    return (
      <div className={styles.layoutSiderWrapper}>
        <div className={`${styles.user} ${styles.flex_dom}`}>
          <img src={this.state.userInfo.avatar_thumb} className={styles.mr20} alt='logo' />
          <div className={`${styles.userName} ${styles.flex_column}`}>
            <div className={styles.name}>{this.state.userInfo.realname || this.state.userInfo.nickname}</div>
            <div className={`${styles.logos} ${styles.mt10} ${styles.flex_dom}`}>
              {
                this.state.userInfo.is_auth === 1 && <div className={`${styles.auth} ${styles.mr15}`}>认</div>
              }
            </div>
          </div>
        </div>
        <div className={`${styles.menu} ${styles.mt10}`}>
          {
            this.state.navList.map((item, index) =>
              <div className={styles.menu_item} key={item.name}>
                <div className={`${styles.menu_title} ${styles.flex_dom} ${styles.flex_item_mid} ${styles.flex_item_between}`} onClick={() => this.openNav(index)}>{item.name}
                  {item.status ? <Icon type="minus" /> : <Icon type="plus" />}
                  {item.status ? <div className={styles.leftline}></div> : ''}
                </div>
                {
                  item.status && item.children.map((item2, index2) => <div className={`${styles.menu_title_children} ${index === _navIndex && index2 === _navIndex2 ? styles.active : ''}`} key={item2.name} onClick={() => this.openChildren(index, index2)}>{item2.name}</div>
                  )
                }
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

// export default (Sider)
export default withRouter(Sider)