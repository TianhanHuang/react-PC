import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getOrderList, changeLoading } from '@/store/action'
import styles from './index.scss';
import { Icon } from 'antd'
import API from '../../../../api/api';
import {getSearchDate} from '@/utils/common'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_596292_k1ml3to6cip.js',
});
class Search extends Component {
  // constructor(props) {
  //   super(props)
  //   console.log(this.state)
  // }
  static propTypes = {
  }
  state = {
    nav: ['全部', '待支付', '待收货/自提', '退款'],
    time: ['昨天', '今天', '最近七天', '最近15天', '最近30天'],
    orderType: ['在线支付', '金融支付', '现金', '账期支付'],
    _index: 0,
    _timeIndex: -1,
    _paymentIndex: -1,
    paramsData: {
      list_type: '',
      time_type: '',
      keyword: '',
      delivery_type: '',
      order_type: '',
      payment_method: '',
      admin_type: '',
      start_date: '',
      end_date: '',
      page: 1
    },
    paymentList: []
  }
  componentDidMount() {
    // console.log(getSearchDate('昨天'))
    console.log("onref", this.props)
    this.props.onRef(this)
    this.getNavList()
    if (sessionStorage.getItem('paramsData') && sessionStorage.getItem('isGetSession')) { // 只有在详情页面返回值列表页面的时候调用
      let data = JSON.parse(sessionStorage.getItem('paramsData'))
      this.setState({
        paramsData: data,
        _index: sessionStorage.getItem('_index'),
        _timeIndex: sessionStorage.getItem('_timeIndex'),
        _paymentIndex: sessionStorage.getItem('_paymentIndex'),
      }, () => {
        // this.changeStatus(sessionStorage.getItem('_index'), {list_type: data.list_type})
        this.getOrderList()
        sessionStorage.setItem('isGetSession', false)
      })
    } else {
      this.changeStatus(0, {list_type: 'all'})
    }
    this.orderFilter()
  }
  componentWillUnmount() {
    sessionStorage.setItem('paramsData', JSON.stringify(this.state.paramsData))
    sessionStorage.setItem('_index', this.state._index)
    sessionStorage.setItem('_timeIndex', this.state._timeIndex)
    sessionStorage.setItem('_paymentIndex', this.state._paymentIndex)
  }
  async orderFilter() {
    await API.orderFilter({}).then((res) => {
      console.log('filter', res)
      if (res.result === 1) {
        let arr = res.data.filter((item) => {
          return item.type === "payment_method"
        })[0].info
        console.log({arr})
        this.setState({
          paymentList: arr
        })
      }
    })
  }
  changeStatus(index, item) {
    this.setState({
      _index: index,
      paramsData: {...this.state.paramsData, list_type: item.list_type, page: 1}
    }, () => {
      this.getOrderList()
    })
  }
  async getNavList() {
    await API.getNavList({type: 'order'}).then((res) => {
      console.log('nav', res)
      if (res.result === 1) {
        this.setState({
          nav: res.data
        })
      }
    })
  }
  async getOrderList() {
    this.props.changeLoading(true)
    await API.getOrderList(this.state.paramsData).then((res) => {
      if (res.result === 1) {
        let list = res.data.list
        list.forEach(item => {
            // item.showMoreHeight = item.order_product_detail.length * 110
            // item.hiddenHeight = 3 * 110
            item.showAmount = 3
        })
        this.props.sendOrderList({list: res.data.list, hasMore: res.data.hasMore, pageNo: this.state.paramsData.page, total: parseInt(res.data.count), list_type: this.state.paramsData.list_type})
        this.props.changeLoading(false)
        // setTimeout(() => { console.log(this.props)}, 1000)
      }
    })
  }
  changeInput(e) {
    this.setState({
      paramsData: {...this.state.paramsData, keyword: e.target.value}
    })
  }
  chooseTime(index, item) {
    console.log(index, item)
    let timeIndex = index !== this.state._timeIndex ? index : -1
    // let time = (new Date(new Date().setHours(0,0,0,0)).getTime() / 1000) + 86400
    let data
    if (index > 1) {
      data = index !== this.state._timeIndex ? {...this.state.paramsData, start_date: getSearchDate(item), end_date: getSearchDate('今天')} : {...this.state.paramsData, start_date: '', end_date: ''}
    } else {
     data = index !== this.state._timeIndex ? {...this.state.paramsData, start_date: getSearchDate(item), end_date: getSearchDate(item)} : {...this.state.paramsData, start_date: '', end_date: ''}
    }
    this.setState({
      _timeIndex: timeIndex,
      paramsData: data
    }, () => {
      this.getOrderList()
    })
  }
  changePayment(index, value) {
    let paymentIndex = index !== this.state._paymentIndex ? index : -1
    let data = index !== this.state._paymentIndex ? {...this.state.paramsData, payment_method: value} : {...this.state.paramsData, payment_method: ''}
    this.setState({
      _paymentIndex: paymentIndex,
      paramsData: data
    }, () => {
      this.getOrderList()
    })
  }
  orderSearch() {
    this.setState({
      paramsData: {...this.state.paramsData, page: 1}
    }, () => {
      this.getOrderList()
    })
  }
  render() {
    let _index = this.state._index
    let _timeIndex = this.state._timeIndex
    let _paymentIndex = this.state._paymentIndex
    return (
      <div className={styles.myorderCateWrap}>
        <div className={`${styles.head} ${styles.flex_dom} ${styles.flex_item_between} ${styles.flex_item_mid}`}>
          <div className={`${styles.classfiy} ${styles.flex_dom}`}>
            {
              this.state.nav.map((item, index) => <div className={`${styles.item} ${_index === index && styles.active}`} key={index} onClick={() => this.changeStatus(index, item)}><div className={styles.itemWrap}>{item.nav_name} &nbsp;{parseInt(item.order_count) !== 0 && <span>{item.order_count}</span>}</div></div>)
            }
          </div>
          <div className={styles.line} style={_index < 4 ? {'left': (_index * 120) + 'px'} : {'right': '0px'}}></div>
          <div className={`${styles.recycle} ${_index === 4 && styles.active}`} onClick={() => this.changeStatus(4, {list_type: 'buyer_delete'})}><IconFont className={styles.icon} type='icon-huishou' />
            订单回收站</div>
        </div>
        <div className={styles.searchWrap}>
          <div className={`${styles.inputWrap} ${styles.flex_dom}`}>
            <input placeholder='输入商品名称/订单号进行搜索' onKeyPress={() => this.orderSearch()} value={this.state.paramsData.keyword} onChange={(e) => this.changeInput(e)} />
            <div className={styles.searchBtn} onClick={() => this.orderSearch()}>订单搜索</div>
          </div>
        </div>
        <div className={`${styles.timeChoose} ${styles.flex_dom} ${styles.flex_item_mid}`}>
          <div className={styles.time}>时间选择：</div>
          {
            this.state.time.map((item, index) => <div className={`${styles.item} ${styles.mr10} ${_timeIndex === index && styles.bgActive}`} key={item} onClick={() => this.chooseTime(index, item)}>{item}</div>)
          }
        </div>
        <div className={`${styles.timeChoose} ${styles.flex_dom} ${styles.flex_item_mid}`}>
          <div className={styles.time}>支付方式：</div>
          {
            this.state.paymentList.map((item, index) => <div className={`${styles.item} ${styles.mr10} ${_paymentIndex === index && styles.bgActive}`} key={item.value} onClick={() => this.changePayment(index, item.value)}>{item.name}</div>)
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.orderList,
    loading: state.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendOrderList: (value) => dispatch(getOrderList(value)),
    changeLoading: (value) => dispatch(changeLoading(value))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Search)
// export default App;
