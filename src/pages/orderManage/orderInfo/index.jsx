import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Skeleton } from 'antd'
import styles from './index.scss'
import store from '@/store/index'
import Close from '@/components/goodsManage/orderInfo/close'
import WaitPay from '@/components/goodsManage/orderInfo/waitPay'
import Steps from '@/components/goodsManage/steps/index'
import Delivery from '@/components/goodsManage/orderInfo/delivery'
import PendMention from '@/components/goodsManage/orderInfo/pendmention'
import Finish from '@/components/goodsManage/orderInfo/finish'
import API from '@/api/api'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_596292_ip517qpqxx.js',
});
class orderInfo extends Component {
  state = {
    orderId: this.props.match.params.orderId,
    orderInfo: {},
    isRequested: false,
    orderStatus: '',
    orderGoods: [],
    feeInfo: [],
    data: {},
    paymentStatus: '',
    showAmount: 1
  }
  componentDidMount() {
    // console.log(this.props.match.params.orderId)
    this.getOrderInfo()
    store.subscribe(() => {
      console.log('改变了', store.getState())
    })
  }
  getOrderInfo() {
    console.log({ API })
    API.orderDetail({ order_id: this.state.orderId }).then((res) => {
      console.log('orderInfo', { res })
      if (res.result === 1) {
        let data = res.data
        let orderInfo = {}
        let orderStatus = {
          orderId: this.state.orderId
        }
        let paymentStatus
        let orderGoods = []
        let feeInfo = []
        data.order_data.forEach((item) => {
          if (item.type === 'order_status') {
            orderStatus = {...orderStatus, ...item}
          }
          if (item.type === 'logistics_info') {
            orderInfo.address = item.content.delivery_address
            orderInfo.tel = item.content.delivery_user_mobile
            orderStatus.logisticsName = item.content.logistics_name
            console.log(item)
            orderStatus.trackingNumber = item.content.tracking_number
          }
          if (item.type === 'order_product_detail') {
            orderInfo.storeName = item.store_info.store_name
            orderGoods = item.order_product_detail
            feeInfo = item.fee_info || []
            let orderNum = 0
            let confirmNum = 0
            item.order_product_detail.forEach((item) => {
              orderNum += item.order_num
              confirmNum += item.confirm_received_num
              // return ''
            })
            orderStatus.order_product_detail = item.order_product_detail
            orderStatus.orderNum = orderNum
            orderStatus.confirmNum = confirmNum
          }
          if (item.type === 'order_memo') {
            orderInfo.order_memo = item.order_memo
          }
          if (item.type === 'order_info') {
            orderInfo.orderNo = item.order_info.order_no
            orderStatus.buyer_del_status = item.order_info.buyer_del_status
            orderStatus.buyer_del_time = item.order_info.buyer_del_time
            orderStatus.orderType = item.order_info.order_status
            orderStatus.order_info = item.order_info
            paymentStatus = item.order_info.payment_status
          }
        })
        orderStatus.button_bottom = res.data.button_bottom ? res.data.button_bottom : ''
        this.setState({
          isRequested: true,
          data,
          orderInfo,
          orderStatus,
          orderGoods,
          feeInfo,
          paymentStatus
        }, () => {
          if (this.state.orderStatus.orderType === 'order_ship' ||(this.state.orderStatus.orderType === 'order_create' && this.state.paymentStatus === 'unpay')) { //在待支付的情况下
            let data = this.state.orderStatus
            this.timer = setInterval(() => { // 添加倒计时
              --data.button_top.order_status_msg.label
              this.setState({
                orderStatus: data
              })
            }, 1000)
          }
          this.setState({
            showAmount: this.state.orderGoods.length > 2 ? 3 : 999
          })
        })
      }
    })
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  // 点击问题
  getQuestion() {

  }
  // 展开更多信息
  showMore() {
    this.setState({
      showAmount: (this.state.showAmount === 3) && this.state.orderGoods.length > 2 ? 999 : 3
    })
  }
  goBack() {
    sessionStorage.setItem('isGetSession', true)
    this.props.history.goBack()
  }
  render() {
    let orderInfo = this.state.orderInfo
    let statusLayOut = null
    let showStep = true
    if (this.state.orderStatus.orderType === 'order_create' && this.state.paymentStatus === 'unpay') {
      statusLayOut = <WaitPay status={this.state.orderStatus} />
    } else if (this.state.orderStatus.orderType === 'order_create' && this.state.paymentStatus === 'paid') {
      statusLayOut = <Delivery status={this.state.orderStatus} />
    } else if (this.state.orderStatus.orderType === 'order_ship') {
      statusLayOut = <PendMention status={this.state.orderStatus} />
    }  else if (this.state.orderStatus.orderType === 'order_finish') {
      statusLayOut = <Finish status={this.state.orderStatus} />
    }else {
      statusLayOut = <Close status={this.state.orderStatus} />
      showStep = false
    }
    return (
      <div className={styles.orderInfoWrap}>
        <div className={styles.pageHead} onClick={() => this.goBack()}>
          <IconFont type='icon-navfanhui' />
          返回列表</div>
          {
            showStep && <Steps orderStatus={this.state.orderStatus.orderType} paymentStatus={this.state.paymentStatus} />
          }
        <div className={styles.detailWrap}>
          <div className={styles.detailLeft}>
            <div className={styles.detailTitle}>订单信息</div>
            <div className={styles.detailContent}>
              {
                this.state.isRequested ? <ul>
                  <li>
                    收货地址：<span>{orderInfo.address}</span>
                  </li>
                  <li>
                    买家留言：<span>{orderInfo.order_memo ? orderInfo.order_memo : '无'}</span>
                  </li>
                  <li>
                    订单编号：<span>{orderInfo.orderNo}</span>
                  </li>
                  <li>
                    店铺名称：<span>{orderInfo.storeName}</span>
                  </li>
                  <li>
                    联系方式：<span>{orderInfo.tel}</span>
                  </li>
                </ul> : <Skeleton active />
              }
            </div>
          </div>
          <div className={styles.detailRight}>
            {statusLayOut}
          </div>
        </div>
        <div className={styles.tableWrap}>
          <div className={styles.head}>
            <ul>
              <li>商品</li>
              <li>单价</li>
              <li>数量</li>
              <li>商品总价</li>
            </ul>
          </div>
          <div className={styles.content}>
            {
              this.state.orderGoods.map((item, index) =>
              <React.Fragment key={item.goods_id}>
                {
                  index < this.state.showAmount &&
                  <div className={styles.td}>
                  <div className={styles.goodsDetail}>
                    <div className={styles.imgtitle}>
                      <img src={item.goods_logo} alt='商品图' />
                      <div className={styles.title}>
                        <p>{item.order_goods_name}</p>
                        <p>规格：{item.spec_name}</p>
                      </div>
                    </div>
                    <div className={styles.goodsPrice}>
                      {
                        item.spec_price_format !== item.confirm_price_format && <p className={styles.linePrice}>￥{item.spec_price_format}</p>
                      }
                      <p>￥{item.confirm_price_format}</p>
                    </div>
                    <div className={styles.amount}>
                      <p>x{item.order_num}</p>
                    </div>
                  </div>
                  <div className={styles.price}>￥{item.confirm_total_amount}</div>
                </div>
                }
                </React.Fragment>
              )
            }
            {
                  this.state.orderGoods.length > 3 && 
                  <div className={styles.moreInfo} onClick={() => this.showMore()}>
                    {this.state.showAmount === 3 ? '展开更多信息' : '收起更多信息'} <IconFont type='icon-shouyexiala' className={`${styles.moreIcon} ${this.state.showAmount !== 3 && styles.tranformTop}`} />
                  </div>
                }
          </div>
        </div>
        <div className={styles.total}>
          <ul>
            {
              Object.keys(this.state.feeInfo).map(key =>
                <li key={key}>
                  {
                    this.state.feeInfo[key].fee_type === 'order_other' && 
                    <div className={styles.tipsWrap}>
                      <div className={styles.tips}>包括运费、包装费、运输费、装车费以及其他费用</div>
                      <IconFont className={styles.liIcon} type='icon-qitafeiyongshuoming' />
                    </div>
                  }
                  <div className={styles.title}>{this.state.feeInfo[key].fee_type_name}：</div>
                  <div className={`${styles.price} ${this.state.feeInfo[key].fee_type === 'order_discount' && styles.fontColor}`}>￥{this.state.feeInfo[key].fee_amount}</div>
                </li>
              )
            }
            {
              this.state.feeInfo.length ? <div className={styles.line}></div> : ''
            }
            <li>
              <div className={styles.title}>订单总价：</div>
              <div className={styles.price}>￥{this.state.data.order_final_amount}</div>
            </li>
            <li>
              <div className={styles.title}>实付款：</div>
              <div className={styles.price}>￥{this.state.data.order_amount}</div>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
export default connect('', '')(orderInfo)
// export default App;
