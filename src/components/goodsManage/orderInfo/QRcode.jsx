import React, { Component } from 'react'
import styles from './index.scss'
import { Icon } from 'antd'
import downLoad from '../../../images/common/downLoad.png'
// import API from '@/api/api'
// import { _countDown } from '@/utils/common'
import { withRouter } from 'react-router-dom'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_596292_gnu6pjejeen.js',
});
class QRCode extends Component {
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
  // componentDidUpdate(props){
  //   console.log({props})
  // }
  // static getDerivedStateFromProps() {
  //   return null
  // }
  // 调用父组件方法关闭弹窗
  close() {
    this.props.close()
  }
  render() {
    // let data = this.props.status
    // let seconds = data.button_top.order_status_msg.label
    // setInterval(() => {
    //   // console.log(data.button_top.order_status_msg.label)
    //   time = _countDown(seconds)
    //   data = { ...data, button_top: {order_status_msg: {label: --seconds}}}
    // }, 1000)
    return (
      <div className={styles.orderInfoContent}>
        <div className={styles.QRcodeWrap}>
          <IconFont type='icon-guanbi' className={styles.closeIcon} onClick={() => this.close()} />
          <p className={styles.p1}>电脑版暂不支持操作</p>
          <p className={styles.p2}>请用手机app扫码下方二维码操作</p>
          <div className={styles.codeImg}>
            <img src={downLoad} alt='' />
          </div>
        </div>
        <div className={styles.mask}></div>
      </div>
    )
  }
}
export default withRouter(QRCode)
// export default App;
