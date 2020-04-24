import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addAmount } from '@/store/action'
import { is, fromJS } from 'immutable'
import './index.scss'
import API from '@/api/api'
import {Button } from 'antd';
class App extends Component {

  state = {
    hasAlert: false,
    alertText: '请在手机APP中打开',
    logout: false,
    value: 'Hell Word'
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
    console.log(this)
    console.log(this.props.amount)
    console.log('name', this.props.match.params.name)
    // console.log('name', this.props.location.query.name) // query传参 页面刷新数据丢失
    this.props.addAmount2(this.props.amount)
    setTimeout(() => {
      console.log(this.props.amount)
    }, 500)
    this.getHttp()
    // console.log(this.props.amount)
  }
  async getHttp() {
    let result = await API.getArticle()
    console.log({ result })
  }
  changeInput(e) {
    console.log(e.target.value)
    this.setState({
      value: e.target.value
    })
  }
  outputValue(e) {
    alert(12)
    console.log(this.state.value)
  }
  onRef(ref) {
    console.log({ ref })
    this.childFun = ref
  }
  getChild() {
    console.log(this)
    this.childFun.outPutChild()
  }
  outputLi(e) {
    console.log({ e })
  }
  render() {
    let arr = [1, 2, 3, 4, 5]
    let arrLayout = arr.map((item, index) =>
      <li key={index} className={index % 2 === 0 ? 'testLi activeColor' : 'testLi'} onClick={() => this.outputLi(item)}>{item}</li>
    )
    return (
      <div className='wrap'>
        {/* <Header title='头部' onRef={(ref) => this.onRef(ref)} outputValue={() => this.outputValue()} /> */}
          <div className='testword2'>测试测试两行超出溢出测试测试两行超出溢出测试测试两行超出溢出测试试两行超出溢出测试测试两行超出溢出测试测试两行超出溢出测试测试两行超出溢出</div>
          <input className='inputClass' value={this.state.value} onChange={(e) => this.changeInput(e)} />
          <Button onClick={(e) => this.outputValue(e)} >输出</Button>
          <Button onClick={() => this.getChild()}>调用子组件的方法</Button>
          {
            this.props.match.params.name === 'testPage' && <div>is testPage</div>
          }
          {
            this.props.match.params.id === '123' && <div>is testPage Params id</div>
          }
          <ul>
            {arrLayout}
          </ul>
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
