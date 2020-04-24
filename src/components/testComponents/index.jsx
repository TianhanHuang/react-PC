import React, { Component } from 'react'
import { connect } from 'react-redux'
import './index.scss';

class Head extends Component {
  //   static propTypes = {
  //     amount: PropTypes.number.isRequired,
  //   }
  state = {
    hasAlert: false,
    alertText: '请在手机APP中打开',
    logout: false,
    name: '我是子组件'
  }
  componentDidMount() {
    console.log(this.props)
    this.props.onRef(this)
  }
  testFun = (value) => {
    return (e) => {
      console.log(value, e)
    }
  }
  handClick(e, e1) {
    console.log(e)
  }
  outPutChild() {
    console.log(this.state.name)
  }
  jumpPage() {
    this.props.history.push({ pathname: '/testPage/testPage/123' })
  }
  render() {
    return (
      <div>
        <div className='header'>{this.props.title}</div>
      </div>
    )
  }
}

export default connect('', '')(Head)
// export default App;
