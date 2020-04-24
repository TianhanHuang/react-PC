import React, { Component } from 'react'
import styles from './index.scss'
import { withRouter } from 'react-router-dom'
import arrive from '@/images/order/arrive.png'
import notArrive from '@/images/order/notArrive.png'
class Steps extends Component {
  static propTypes = {
  }
  state = {
    orderStatus: [ {name: '下单', value: 'order_create'}, {name: '付款', value: ''}, {name: '卖家发货', value: ''}, {name: '确认收货/自提', value: ''}, {name: '已完成', value: ''}]
  }
  componentDidMount() {
    console.log(this.props)
  }
  render() {
    let status = this.props.orderStatus
    let paymentStatus = this.props.paymentStatus
    let _index = null
    if (status === 'order_create' && paymentStatus === 'unpaid') {
      _index = 0 // 已下单未付款
    }
    if (status === 'order_create' && paymentStatus === 'paid') {
      _index = 1 // 已下单 已付款
    }
    if (status === 'order_ship') {
      _index = 2 // 已发货
    }
    if (status === 'order_received') {
      _index = 3 // 已确认收货 已自提
    }
    if (status === 'order_finish') {
      _index = 4 // 已完成
    }
    return (
      <div className={styles.stepsWrap}>
        {
          this.state.orderStatus.map((item, index) => 
          <div className={styles.itemWrap} key={index}>
            <div className={styles.status}>
              <div className={styles.statusTop} style={{color: (index <= _index) && '#ff8008'}}>{item.name}</div>
              <img src={index <= _index ? arrive : notArrive} alt='icon' />
              {
                index !== 4 && <div className={styles.line} style={{background: (index < _index) && '#ff8008'}}></div>
                }
            </div>
          </div>
          )
        }
      </div>
    )
  }
}
export default withRouter(Steps)
// export default App;
