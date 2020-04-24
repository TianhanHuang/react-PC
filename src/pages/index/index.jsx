import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addAmount } from '@/store/action'
import { Button } from 'antd';
import './index.scss';

class App extends Component {
  // constructor(props) {
  //   super(props)
  //   console.log(this.state)
  // }
  static propTypes = {
    amount: PropTypes.number.isRequired,
  }
  state = {
    hasAlert: false,
    alertText: '请在手机APP中打开',
    logout: false
  }
  componentDidMount() {
    console.log(this)
    console.log('alertText', this.state.alertText)
    console.log(this.props.amount)
    this.props.addAmount2(99)
    setTimeout(() => {
      console.log(this.props.amount)
    }, 500)
    this.testFun()
    function fn() {
      this.user = '追梦子';
      return null;
    }
    var a = new fn;
    console.log(a.user)
  }
  testFun(params) {
    alert('123')
  }
  testFun = (value) => {
    return (e) => {
      console.log(value, e)
    }
  }
  handClick(e, e1) {
    console.log(e)
  }
  jumpPage() {
    this.props.history.push({ pathname: '/testPage/testPage1/123' })
  }
  render() {
    return (
      <div>
        <div className='abc'></div>
        <div className='testword'>测试1测试两行超出溢出测试测试两行超出溢出测试测试两行超出溢出测试试两行超出溢出测试测试两行超出溢出测试测试两行超出溢出测试测试两行超出溢出</div>
        <button onClick={this.testFun('value')}>点击跳转</button>
        <button onClick={(e) => this.handClick('123')}>点击额</button>
        <button onClick={() => this.jumpPage()}>go</button>
        <Button>ant Button</Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    amount: state.amount
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addAmount2: (value) => dispatch(addAmount(value))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
// export default App;
