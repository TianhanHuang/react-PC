import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Avatar, Popover } from 'antd';
import './index.scss';
const content = (
  <div>
    <p>用户信息</p>
    <p>退出登录</p>
  </div>
);
class UserAvatar extends Component {
  //   static propTypes = {
  //     amount: PropTypes.number.isRequired,
  //   }
  state = {
    
  }

  componentDidMount() {
  }
  render() {
    return (
      <div>
        <Popover placement="bottom" content={content} trigger="click">
          <Avatar size="large" icon="user" className='avatar' />
        </Popover>
        <span className='admin ml10'>admin</span>
      </div>
    )
  }
}

export default connect('', '')(UserAvatar)
