import React, { Component } from 'react'
import styles from './index.scss'
import { Skeleton, Button, Modal, message } from 'antd'
import API from '@/api/api'
import { withRouter } from 'react-router-dom'
import constant from '../../../utils/constant'
const { confirm } = Modal;
class Close extends Component {
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
  actions(item) {
    switch (item.button_type) {
      case constant.BUTTON_TYPE_BUYER_UNPAY_CANCEL:
        this.cancelOrder()
        break;
      case constant.BUTTON_TYPE_BUYER_ORDER_DELETE:
        this.deleteOrder()
        break;
      default:
        break;
    }
  }
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
  deleteOrder() {
    let that = this
    confirm({
      title: '提示',
      content: '是否确定删除该订单？',
      okText: '确定',
      okType: 'danger',
      cancelText: '再想想',
      onOk() { // 确定删除订单
        console.log(that.props)
        API.deleteOrder({order_id: that.props.status.orderId}).then((res) => {
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
  render() {
    let data = this.props.status
    return (
      <div className={styles.orderInfoContent}>
        {
          data ? <div className={styles.closeWrap}>
                    <p>订单状态：{data.button_top.order_status_name}</p>
                    <p>{data.button_top.order_status_msg.content}</p>
                    <p>{data.button_top.order_status_msg.tip}</p>
                    {/* { data.orderType === 'order_cancel' && !data.buyer_del_status ? <Button className={styles.delBtn} onClick={() => this.deleteOrder()}>删除订单</Button> : <p>该订单于{data.buyer_del_time} 删除</p>} */}
                    {
                      data.button_bottom.order_status_button && <React.Fragment>
                        {data.button_bottom.order_status_button.map((item) => 
                          <Button className={styles.delBtn} onClick={() => this.actions(item)}>{item.button_name}</Button>
                        )}
                      </React.Fragment>
                    }
                  </div>
            : <Skeleton active />
        }

      </div>
    )
  }
}
export default withRouter(Close)
// export default App;
