import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { getOrderList, changeLoading } from '@/store/action'
import styles from './index.scss';
// import API from '../../../../api/api';
import nodata from '../../../../images/order/no_order.png'
class NoData extends Component {
  // constructor(props) {
  //   super(props)
  //   console.log(this.state)
  // }
  static propTypes = {
  }
  state = {
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className={`${styles.NodataWrap} ${styles.flex_column} ${styles.flex_item_mid} ${styles.flex_item_center}`}>
        <img src={nodata} alt='暂无数据图片' />
        <p>~暂无数据</p>
      </div>
    )
  }
}
export default connect('', '')(NoData)
// export default App;
