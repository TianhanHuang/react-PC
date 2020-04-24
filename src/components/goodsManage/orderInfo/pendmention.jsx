import React, { Component } from 'react'
import styles from './index.scss'
import { Button, Modal, message, Icon } from 'antd'
import API from '@/api/api'
import { _countDown } from '@/utils/common'
import { withRouter } from 'react-router-dom'
import Qrcode from './QRcode'
import constant from '../../../utils/constant'
const { confirm } = Modal;
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_596292_gnu6pjejeen.js',
});
class Pendmention extends Component {
  // constructor(props) {
  //   super(props)
  //   console.log(this.state)
  // }
  static propTypes = {
  }
  state = {
    isShow: false,
    orderNum: 0,
    confirmNum: 0
  }
  componentDidMount() {
    console.log(this.props)
  }
  componentDidUpdate(nextProps, prevState) {
    if (nextProps.status.orderNum !== prevState.orderNum || nextProps.status.confirmNum !== prevState.confirmNum) {
      this.setState({
        orderNum: nextProps.status.orderNum,
        confirmNum: nextProps.status.confirmNum
      })
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }
  confirmReceived(type) {
    let that = this
    confirm({
      title: `请确认是否${type === 1 ? "收到货" : "自提"}?`,
      content: `下单数量：${this.state.orderNum}，${type === 1 ? "收货" : "自提"}数量：${this.state.confirmNum}`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        API.confirmReceipt({order_id: that.props.status.orderId}).then((res) => {
          if (res.result === 1 ) {
            message.success(res.msg)
            that.props.history.goBack();
          }
        })
      },
      onCancel() { },
    });
  }
  applyRefund() {
    this.setState({
      isShow: true
    })
  }
  actions(item) {
    switch (item.button_type) {
      case constant.BUTTON_TYPE_BUYER_ORDER_AFTER_SALE:
        this.applyRefund()
        break;
      case constant.BUTTON_TYPE_BUYER_CONFIRM_SELF_TAKE: // 自提
        this.confirmReceived(1)
        break;
      case constant.BUTTON_TYPE_BUYER_CONFIRM_RECEIPT: // 收货
        this.confirmReceived(2)
        break;
      default:
        break;
    }
  }
  closeHandle() {
    this.setState({
      isShow: false
    })
  }
  render() {
    let data = this.props.status
    // console.log({ data })
    return (
      <div className={styles.orderInfoContent}>
        <div className={styles.waitPayWrap}>
          <p>订单状态：{data.button_top.order_status_name}</p>
          <div className={`${styles.countdown} ${styles.waitPay_countdown}`}><span><IconFont type='icon-daojishi' />{_countDown(this.props.status.button_top.order_status_msg.label)}</span>请及时{data.button_top.order_status_name === '待自提' ? '确认自提' : '确认收货'}，超时订单将自动{data.button_top.order_status_name === '待自提' ? '确认自提' : '确认收货'}</div>
          {
            data.logisticsName && <p className={styles.logistics}>物流：{data.logisticsName} &nbsp;&nbsp;&nbsp;&nbsp;运单号码：{data.trackingNumber}</p>
          }
          {/* <div className='orderBtns'>
            <Button className={styles.cancelOrder} style={{ 'background': '#e1e1e1', 'marginRight': '10px', 'color': '#fff' }} onClick={() => this.applyRefund()}>申请退款</Button>
            <Button className={styles.goPay} style={{ 'background': '#ff8008', 'color': '#fff' }} onClick={() => this.confirmReceived()}>{data.button_top.order_status_name === '待自提' ? '确认自提' : '确认收货'}</Button>
          </div> */}
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
        {
          this.state.isShow && <Qrcode close={() => this.closeHandle()} />
        }
      </div>
    )
  }
}
export default withRouter(Pendmention)
// export default App;
