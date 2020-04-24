import React, { Component } from 'react'
import styles from './index.scss'
import {  Button, Modal, message, Icon } from 'antd'
import API from '@/api/api'
import { _countDown } from '@/utils/common'
import { withRouter } from 'react-router-dom'
import constant from '@/utils/constant'
import localforage from 'localforage'
const { confirm } = Modal;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_596292_gnu6pjejeen.js',
});
class WaitClose extends Component {
  // constructor(props) {
  //   super(props)
  //   console.log(this.state)
  // }
  static propTypes = {
  }
  state = {
  }
  componentDidMount() {
    console.log(this.props)
  }
  // componentDidUpdate(props){
  //   console.log({props})
  // }
  // static getDerivedStateFromProps() {
  //   return null
  // }
  cancelOrder() {
    let that = this
    confirm({
      title: '提示',
      content: '是否确定取消该订单？',
      okText: '确定',
      okType: 'danger',
      cancelText: '再想想',
      onOk() { // 确定删除订单
        console.log(that.props)
        API.orderCancel({order_id: that.props.status.orderId}).then((res) => {
          if (res.result === 1 ) {
            message.success(res.msg)
            that.props.history.goBack();
          }
        })
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  actions(item) {
    switch (item.button_type) {
        case constant.BUTTON_TYPE_BUYER_UNPAY_CANCEL:
          this.cancelOrder()
          break;
          case constant.BUTTON_TYPE_BUYER_PAY:
            // alert('敬请期待')
            console.log(this.props)
            localforage.setItem('order', { ...this.props.status.order_info, type: 1 }).then((res) => {
              console.log({ res })
              this.props.history.push({ pathname: '/pay/cashier' })
            })
          break;
        default:
          alert('敬请期待')
          break;
      }
    }
  render() {
    let data = this.props.status
    // let seconds = data.button_top.order_status_msg.label
    // setInterval(() => {
    //   // console.log(data.button_top.order_status_msg.label)
    //   time = _countDown(seconds)
    //   data = { ...data, button_top: {order_status_msg: {label: --seconds}}}
    // }, 1000)
    return (
      <div className={styles.orderInfoContent}>
        <div className={styles.waitPayWrap}>
          <p>订单状态：{data.button_top.order_status_name}</p>
          <div className={`${styles.waitPay_countdown} ${styles.countdown}`}><span><IconFont type='icon-daojishi' />{_countDown(this.props.status.button_top.order_status_msg.label)}</span>请及时支付，超时订单将自动关闭</div>
          <div className='orderBtns'>
            {/* <Button className={styles.cancelOrder} style={{'background': '#e1e1e1','marginRight': '10px', 'color': '#fff'}} onClick={() => this.cancelOrder()}>取消订单</Button>
            <Button className={styles.goPay} style={{'background': '#ff8008','color': '#fff'}}>去付款</Button> */}
            {
            data.button_bottom.order_status_button && <React.Fragment>
              {data.button_bottom.order_status_button.map((item) => <React.Fragment>
                {
                  item.button_highlight ? <Button className={styles.buttonClass} onClick={() => this.actions(item)} type='primary'>{item.button_name}</Button> :
                  <Button className={`${styles.delBtn} ${styles.buttonClass}`} onClick={() => this.actions(item)}>{item.button_name}</Button>
                }
                </React.Fragment>
              )}
            </React.Fragment>
          }
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(WaitClose)
// export default App;
