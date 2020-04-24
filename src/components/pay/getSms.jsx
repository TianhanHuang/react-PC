import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './getSms.scss';
import {withRouter} from 'react-router-dom'
// import { Button, Input, Form } from 'antd';
import { Icon, Divider } from 'antd'
class GetSmsCode extends Component {
  //   static propTypes = {
  //     amount: PropTypes.number.isRequired,
  //   }
  state = {
    inputArr: [{}, {}, {}, {}, {}, {}],
    isShow: false,
    params: {},
    _time: 60,
    coutDown: '',
    timeover: false
  }
  componentDidMount() {
    this.props.onRef(this)
    // this.input.focus()

    // console.log('input', this.input)
    // setTimeout(() => {
    //   this.goNextInput('.inputEl')
    // }, 1000)
    // this.goNextInput('.inputEl')
  }
  // input框输入1位数字后自动跳到下一个input聚焦
goNextInput(el){
  var txts = document.querySelectorAll(el);
  let that = this
  for(var i = 0; i<txts.length;i++){
    var t = txts[i];
    t.index = i;
    t.setAttribute("readonly", true);
    t.onkeyup=function(){
        this.value=this.value.replace(/^(.).*$/,'$1')
        var next = this.index + 1;
        console.log({next})
        if(next === 6) {
          
          that.props.getChildren(that.state.inputArr)
          return
        };
        txts[next].removeAttribute("readonly");
        if (this.value) {
          txts[next].focus();
        }
    }
  }
  txts[0].removeAttribute("readonly");
}
  change(index, input) {
    console.log(input)
    let inputArr = this.state.inputArr
    inputArr[index] = input
    // this.setState({
    //   inputArr
    // })
  }
  sendSms() {
    this.setState({
      _time: 60,
      timeover: false
    })
    this.props.confirmPay()
  }
  close() {
    this.setState({
      isShow: false
    })
    clearInterval(this.state.coutDown)
  }
  showPopup() {
    console.log('12332')
    let time = this.state._time
    this.setState({
      isShow: true
    }, () => {
      let coutDown = setInterval(() => {
        if (this.state._time < 2) {
          clearInterval(this.state.coutDown)
          this.setState({
            _time: 60,
            timeover: true
          })
        }
        this.setState({
          _time: --time
        })
      }, 1000);
      this.setState({
        coutDown
      })
      this.goNextInput('.inputEl')
    })
  }
  componentWillUnmount() {
    clearInterval(this.state._time)
  }
  changeInput(e, index) {
    console.log(e.target.value)
    let arr = this.state.inputArr
    arr[index] = e.target.value
    this.setState({
      inputArr: arr
    })
  }
  render() {
    const { isShow, timeover } = this.state
    return (
      <div>
        {
          isShow && <div className={styles.getSmsCode}>
          <div className={styles.contentWrap}>
            <div className={styles.close}><Icon type='close' onClick={() => this.close()}></Icon></div>
            <div className={styles.sendTips}>请输入短信验证码</div>
            <div className={styles.Price}>￥{this.props.price}</div>
            <Divider className={styles.divider} />
            <div className={styles.sendTips2}>
              <div className={styles.sendLeft}>已发送至手机号{this.props.phone}</div>
              {
                timeover ? 
                <div className={styles.sendRight} onClick={() => this.sendSms()} style={{cursor: 'pointer'}}>重新发送</div>
                :<div className={styles.sendRight}>{this.state._time}s</div>
              }
            </div>
            <div className={styles.inputs}>
              {this.state.inputArr.map((item, index) =>
                <div key={index} className={styles.numberInput}>
                  <input maxLength='1'  value={item.value} onChange={(e) => this.changeInput(e, index)} className='inputEl'></input>
                </div>
              )}
            </div>
          </div>
        </div>
        }
      </div>
    )
  }
}
export default withRouter(GetSmsCode)
// export default App;
