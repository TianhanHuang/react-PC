import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from '@/components/login/header/index'
import LoginForm from '@/components/login/loginForm/index'
import loginStyles from './index.scss';
import bg from '../../images/login/login_back.png'
class test extends Component {
  static propTypes = {
  }
  state = {
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className={loginStyles.manageLogin}>
          <Header />
        <div className={`${loginStyles.layoutContent} ${loginStyles.loginBody}`}>
          <img className={loginStyles.logoBack} src={bg} alt='logo' />
          <LoginForm history={this.props.history} />
          <div className={loginStyles.footerTips}>
            <p className='mt40'>©&nbsp;2020农联产融（厦门）科技有限公司版权所有</p>
            <p>增值电信业务经营许可证:闽B2-20180137&nbsp;&nbsp;|&nbsp;&nbsp;闽ICP备17002063号-2</p>
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
export default connect('', '')(test)
// export default App;
