import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Row, Col } from 'antd'
import styles from './index.scss'
import store from '@/store/index'
import NoData from '@/components/goodsManage/myOrder/noData'
import API from '@/api/api'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_596292_ip517qpqxx.js',
});
class accountPeriodDetail extends Component {
  state = {
    time: ['昨天', '今天', '最近七天', '最近15天', '最近30天'],
    _timeIndex: -1,
    log:[],
    info:{}
  }
  componentDidMount() {
    console.log(this.props.match.params.periodId)
    this.getPeriodInfo(this.props.match.params.periodId)
    store.subscribe(() => {
      console.log('改变了', store.getState())
    })
  }
  getPeriodInfo(id) {
    API.getPeriodInfo({period_id: id}).then((res) => {
      console.log({res})
      if (res.result === 1) {
        this.setState({
          log: res.data.log,
          info: res.data.info
        })
      }
    })
  }
  goBack() {
    sessionStorage.setItem('isGetSession', true)
    this.props.history.goBack()
  }
  render() {
    const { info, log } = this.state
    return (
      <div className={styles.accountPeriodDetail}>
        <div className={styles.pageHead} onClick={() => this.goBack()}>
          <IconFont type='icon-navfanhui' />
          <span>返回列表</span>
          </div>
          <div className={styles.periodWrap}>
            <div className={styles.head}>账期总汇</div>
            <div className={styles.content}>
              <Row className={styles.row}>
                <Col span={7}>账期编号：{info.period_no}</Col>
                <Col span={6}>到期时间：{info.period_expire_time_date}</Col>
                <Col span={6}>账期状态：{info.delay_status_name}</Col>
              </Row>
              <Row className={styles.row}>
                <Col span={6}>账期金额：{info.payment_amount}</Col>
                <Col span={6}>已支付金额：{info.period_payment_amount}</Col>
                <Col span={6}>未支付金额：{info.period_unpay_amount}</Col>
              </Row>
            </div>
          </div>
          <div className={`${styles.periodWrap} ${styles.periodWrap2}`}>
            <div className={styles.head}>账期支付流水</div>
            <div className={styles.content}>
              {/* <div className={`${styles.timeChoose} ${styles.flex_dom} ${styles.flex_item_mid}`}>
                <div className={styles.time}>时间选择：</div>
                {
                  this.state.time.map((item, index) => <div className={`${styles.item} ${styles.mr10} ${_timeIndex === index && styles.bgActive}`} key={item} onClick={() => this.chooseTime(index, item)}>{item}</div>)
                }
              </div> */}
              {
                log.length ? <React.Fragment>
                  <Row className={`${styles.row} ${styles.row1}`}>
                    <Col span={6}>时间</Col>
                    <Col span={6}>支付方式</Col>
                    <Col span={6}>交易号</Col>
                    <Col span={6}>支付金额</Col>
                  </Row>
                  {
                    log.map((item) => 
                    <Row className={styles.row} key={item.period_pay_id}>
                      <Col span={6}>{item.payment_finish_time_date}</Col>
                      <Col span={6}>{item.trade_method_name}</Col>
                      <Col span={6}>{item.period_no}</Col>
                      <Col span={6}>￥{item.trade_amount}</Col>
                    </Row>
                    )
                  }
                </React.Fragment>
                : 
                <NoData />
              }
            </div>
          </div>
      </div>
    )
  }
}
export default connect('', '')(accountPeriodDetail)
// export default App;
