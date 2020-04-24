import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './index.scss';
import logo from '@/images/login/logo.png'
import { changeLoginStatus } from '@/store/action'
// import { Button } from 'antd';
// import { register } from '../../../serviceWorker';
// import classnames from 'classnames'
class Header extends Component {
	//   static propTypes = {
	//     amount: PropTypes.number.isRequired,
	//   }
	state = {
		isLogin: true
	}
	componentDidMount() {
	}
	register() {
		this.setState({isLogin: false})
		this.props.changeLoginStatus2(2)
	}
	login() {
		this.setState({isLogin: true})
		this.props.changeLoginStatus2(1)
	}
	render() {
		return (
			<div className={styles.loginWrapper}>
				<div className='login-header'>
					<div className={`${styles.layoutContent} ${styles.flex_dom} ${styles.flex_item_between} ${styles.flex_item_mid}`}>
						<img src={logo} alt='logo' />
						<div className={`${styles.loginButtons} ${styles.flex_dom}`}>
							<div className={ this.state.isLogin ? `${styles.active} ${styles.login} ${styles.mr30}` : `${styles.login} ${styles.mr30}`}  onClick={() => this.login()}>登录</div>
							<div className={ !this.state.isLogin ? `${styles.active} ${styles.register}` : `${styles.register}`} onClick={() => this.register()}>注册</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
const mapStateToProps = (state) => {
  return {
    isLogin: state.isLogin
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeLoginStatus2: (value) => dispatch(changeLoginStatus(value))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Header)
// export default App;
