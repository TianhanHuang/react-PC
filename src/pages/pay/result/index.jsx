import React, { Component } from 'react'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import styles from './index.scss'
import { Button } from 'antd';
import Header from '@/components/layout/header/index'
import { Icon } from 'antd';
import success from '@/images/pay/success.png'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_596292_ij781zrzten.js',
});
class Result extends Component {

  state = {
    arr: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5]
  }
  componentWillMount() {
    console.log('componentWillMount')
  }
  componentWillReceiveProps() {
    console.log('componentWillReceiveProps')
  }
  shouldComponentUpdate(nextProps, nextState) { // 判断是否要更新render, return true 更新  return false不更新
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
  }
  componentWillUpdate() {
    console.log('componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('componentDidUpdate')
  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className={styles.cashierWrap}>
        <Header type='payOnline' />
        <div className={styles.resultWrapper}>
          <div className={`${styles.flex_dom} ${styles.successTips} ${styles.flex_item_mid}`}>
            <img src={success} />您已成功支付<span>300000.00</span>元
          </div>
          <div className={`${styles.returns} ${styles.flex_dom} ${styles.flex_item_mid}`}>
            <p>为方便您查看商户订单状态，请点击</p>
            <Button size='small' type='primary' className={styles.btn}>返回</Button>
          </div>
          <div className={styles.orderInfo}>
            <p>
              <IconFont type='icon-chaoshijinggao' className={styles.icon}></IconFont>为了方便后续查询交易，建议留存该笔交易的商户订单号： 200031114620490621322538165，和银行订单号：052106616774226
            </p>
          </div>
        </div>
      </div>
    )
  }
}

// const mapStateToProps = (state) => {
//   return {
//     amount: state.amount
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     addAmount2: (value) => dispatch(addAmount(value))
//   }
// }
export default connect('', '')(Result)
// export default App;
