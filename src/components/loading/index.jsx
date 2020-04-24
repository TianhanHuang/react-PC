import React, { Component } from 'react'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import styles from './index.scss';

class Loading extends Component {
  //   static propTypes = {
  //     amount: PropTypes.number.isRequired,
  //   }
  state = {
    
  }
  componentDidMount() {
  }
  render() {
    return (
        <div className={styles.loadingWarp}>
          <Spin tip='加载中...' size='large' />
          {/* <div className={styles.mask}></div> */}
        </div>
    )
  }
}

export default connect('', '')(Loading)
// export default App;
