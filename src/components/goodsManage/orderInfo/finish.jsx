import React, { Component } from 'react'
import styles from './index.scss'
import { Skeleton, Modal, message, Button } from 'antd'
import API from '@/api/api'
import { withRouter } from 'react-router-dom'
const { confirm } = Modal;
class Finish extends Component {
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
        API.deleteOrder({ order_id: that.props.status.orderId }).then((res) => {
          if (res.result === 1) {
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
  action(type) {
    console.log({ type })
    // if (type === 28) {
    //   alert('敬请期待~')
    // } else{
    //   alert()
    // }
    switch (type) {
      case 28:
        alert('敬请期待~')
        break;
      default:
        alert('敬请期待')
        break;
    }
  }
  render() {
    let data = this.props.status
    return (
      <div className={styles.orderInfoContent}>
        {
          data ? <React.Fragment>
            <div className={styles.firstP}>订单状态：{data.button_top.order_status_name}</div>
            {
              data.logisticsName && <div className={styles.logistics}>物流：{data.logisticsName} &nbsp;&nbsp;&nbsp;&nbsp;运单号码：{data.trackingNumber}</div>
            }
            <div className={styles.mt20}>
              {
                data.button_bottom.order_status_button && <React.Fragment> {
                  data.button_bottom.order_status_button.map((item) => <Button type='primary' onClick={() => this.action(item.button_type)}>{item.button_name}</Button>
                  )}
                </React.Fragment>
              }
            </div>
          </React.Fragment>
            : <Skeleton active />
        }

      </div>
    )
  }
}
export default withRouter(Finish)
// export default App;
