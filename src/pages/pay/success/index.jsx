import React, { Component } from 'react'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import styles from './index.scss'
import { Button } from 'antd';
import Header from '@/components/layout/header/index'
import { Icon } from 'antd';
import success from '@/images/pay/success@2x.png'
import { Route, Redirect } from 'react-router-dom'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_596292_ij781zrzten.js',
});
class PaySuccess extends Component {

  state = {
    redirect: false,
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
    console.log(this.props.match.params.orderId)
  }
  lookOrder() {
    this.props.history.push({pathname: `/orderManage/orderInfo/${this.props.match.params.orderId}`})
  }
  returnIndex() {
    // this.props.history.push({pathname: '/orderManage/myOrder'})
    this.setState({
      redirect: true
    })
  }
  render() {
    if (this.state.redirect) {
      return <Redirect push to="/orderManage/myOrder" />; //or <Redirect push to="/sample?a=xxx&b=yyy" /> 传递更多参数
    }  
    return (
        <div className={styles.paySuccessWrapper}>
          <Header type='payOnline' />
            <div className={styles.content}>
              <img src={success} className={styles.successIcon} alt=''/>
              <p className={styles.mt20}>支付成功</p>
              <p className={styles.mt18}>请等待商家发货</p>
              <div className={styles.btns}>
                <Button className={styles.look} onClick={() => this.lookOrder()}>查看订单</Button>
                <Button onClick={() => this.returnIndex()}>返回首页</Button>
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
export default connect('', '')(PaySuccess)
// export default App;
