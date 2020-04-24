import React, { Component } from 'react'
import layoutStyles from './index.scss';
import Sider from './sider'
import Header from './header'
class MainLayout extends Component {
  state = {
    collapsed: false,
  };
  componentDidMount() {
    console.log('12333', this.props)
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  // componentDidMount() {
  //   console.log(this.props)
  // }
  render() {
    return (
      <div className={layoutStyles.layout_wrap}>
        <Header prop={this.props} />
        <div className={`${layoutStyles.layoutContent} ${layoutStyles.flex_dom}`}>
          <Sider history={this.props.history} />
          <div className={layoutStyles.content}>
            {this.props.children}
          </div>
        </div>
        <div className={layoutStyles.footerTips}>
              <p>©&nbsp;2020农联产融（厦门）科技有限公司版权所有</p>
              <p>增值电信业务经营许可证:闽B2-20180137&nbsp;&nbsp;|&nbsp;&nbsp;闽ICP备17002063号-2</p>
            </div>
      </div>
    )
  }
}

export default (MainLayout)
