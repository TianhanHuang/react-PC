import React, { Component } from 'react'
import styles from './index.scss'
import { Button, Modal} from 'antd'
// import API from '@/api/api'
// import { _countDown } from '@/utils/common'
import { withRouter } from 'react-router-dom'
import QRcode from './QRcode'
import constant from '../../../utils/constant'
import API from '@/api/api'
const { confirm } = Modal
class Delivery extends Component {
  // constructor(props) {
  //   super(props)
  //   console.log(this.state)
  // }
  static propTypes = {
  }
  state = {
    isShow: false
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
  // 确认收货
  confirmReceived(name, record) {
    console.log({record})
    let sumAmount = 0
    let confirmAmount = 0
    record.order_product_detail.forEach((item) => {
      sumAmount += item.confirm_num
      confirmAmount += item.confirm_received_num
    })
    confirm({
      title: `请确认是否收${name}?`,
      content: `下单数量：${sumAmount}，收货数量：${confirmAmount}`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        API.confirmReceipt({order_id: record.order_id}).then((res) => {
          if (res.result === 1 ) {
            window.location.reload()
          }
        })
      },
      onCancel() { },
    });
  }
  // 申请退款
  applyRefund(item) {
    console.log(constant.BUTTON_TYPE_BUYER_APPLY_REFUND)
    switch (item.button_type) {
      case constant.BUTTON_TYPE_BUYER_CONFIRM_SELF_TAKE:
        this.confirmReceived('自提', this.props.status)
        break;
      case constant.BUTTON_TYPE_BUYER_ORDER_AFTER_SALE:
        this.setState({
          isShow: true
        })
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
    const { isShow } = this.state
    // let seconds = data.button_top.order_status_msg.label
    // setInterval(() => {
    //   // console.log(data.button_top.order_status_msg.label)
    //   time = _countDown(seconds)
    //   data = { ...data, button_top: {order_status_msg: {label: --seconds}}}
    // }, 1000)
    return (
      <div className={styles.orderInfoContent}>
        <div className='orderDelivery'>
          <p>订单状态：{data.button_top.order_status_name}</p>
          <p>{data.button_top.order_status_msg.content}</p>
          <div className={styles.orderBtns}>
            {
              data.button_bottom.order_status_button && <React.Fragment>
                {data.button_bottom.order_status_button.map((item) => 
                  <Button className={styles.cancelOrder} style={{ 'background': '#e1e1e1', 'marginRight': '10px', 'color': '#fff' }} onClick={() => this.applyRefund(item)}>{item.button_name}</Button>
                )}
              </React.Fragment>
            }
          </div>
          {
            isShow && <QRcode close={() => this.closeHandle()} />
          }
        </div>
      </div>
    )
  }
}
export default withRouter(Delivery)
