import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styles from './index.scss';
import { Button, Icon, Pagination, ConfigProvider, Dropdown, Menu, Modal } from 'antd';
// import { is, fromJS } from 'immutable'
import Search from '@/components/goodsManage/myOrder/search/index'
import Loading from '@/components/loading/index'
import store from '@/store/index'
import { _countDown } from '@/utils/common'
import NoData from '@/components/goodsManage/myOrder/noData/index'
import zhCN from 'antd/es/locale/zh_CN';
import API from '@/api/api'
import constant from '@/utils/constant'
import localforage from 'localforage'
console.log({ styles })
const { confirm } = Modal
// import classnames
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_596292_ip517qpqxx.js',
});
class myOrder extends Component {
  static propTypes = {
  }
  state = {
    loading: true,
    tableData: {
      list: [],
    },
    arr: [], // 所有定时器 数组
    pageType: this.props.match.params.orderType
  }
  componentDidMount() {
    console.log('props', this.props)
    if (this.state.pageType === 'platform_period') {
      this.child.changeStatus(0, { list_type: 'period_list' })
    }
    store.subscribe(() => {
      console.log('改变了', store.getState())
      if (this.state.arr) { // 每次更新数据的时候都要进行判断是否有定时器开着
        this.state.arr.forEach((item) => {
          clearInterval(item)
        })
      }
      let orderList = store.getState().orderList
      this.setState({
        tableData: orderList
      }, () => {
        this.countDown(orderList)
      })
    })
  }
  shouldComponentUpdate(nextProps, nextState) { // 判断是否要更新render, return true 更新  return false不更新
    if (nextProps.match.params.orderType !== nextState.pageType) {
      this.setState({
        pageType: nextProps.match.params.orderType
      }, () => {
        if (nextProps.match.params.orderType === 'platform_period') {
          this.child.changeStatus(0, { list_type: 'period_list' })
        } else {
          this.child.changeStatus(0, { list_type: 'all' })
        }
      })
      return true
    }
    return true
  }
  componentWillUnmount() {
    console.log('arr', this.state.arr)
    // alert('123')
    this.state.arr.forEach((item) => {
      clearInterval(item)
    })
  }
  // 确认收货
  confirmReceived(name, record) {
    console.log({ record })
    let sumAmount = 0
    let confirmAmount = 0
    record.order_product_detail.forEach((item) => {
      sumAmount += item.confirm_num
      confirmAmount += item.confirm_received_num
    })
    confirm({
      title: `请确认是否收${name}?`,
      content: `下单数量：${sumAmount}，收货数量：${confirmAmount}`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        API.confirmReceipt({ order_id: record.order_id }).then((res) => {
          if (res.result === 1) {
            window.location.reload()
          }
        })
      },
      onCancel() { },
    });
  }
  // 点击操作按钮
  buttonAction(item, record) {
    switch (item.button_type) {
      case constant.BUTTON_TYPE_BUYER_CONFIRM_SELF_TAKE:
        this.confirmReceived('自提', record)
        break;
      case constant.BUTTON_TYPE_BUYER_CONFIRM_RECEIPT:
        this.confirmReceived('收货', record)
        break;
      case constant.BUTTON_TYPE_BUYER_PAY:
        // this.props.history({pathname: '/pay/cashier'})
        localforage.setItem('order', { ...record, type: 1 }).then((res) => {
          console.log({ res })
          this.props.history.push({ pathname: '/pay/cashier' })
        })
        break;
      case constant.BUTTON_TYPE_BUYER_PERIOD_WAIT_PAY:
        // this.props.history({pathname: '/pay/cashier'})
        localforage.setItem('order', { ...record, type: 1 }).then((res) => {
          console.log({ res })
          this.props.history.push({ pathname: '/pay/cashier' })
        })
        break;
      default:
        break;
    }
    console.log({ item })
  }
  countDown() {
    let arr = []
    this.state.tableData.list.forEach((item, index) => {
      if (item.fee_info) {
        let total = 0
        item.fee_info.forEach((item2) => {
          if (item2.fee_type === 'order_shipping' || item2.fee_type === 'order_other') {
            total += parseFloat(item2.fee_amount)
          }
        })
        item.total = total // 自定义字段 配送费和其他物品的总费用
      }
      if (item.order_status === 'order_create' && item.payment_status === 'unpay') {
        let arrItem = setInterval(() => {
          let data = this.state.tableData
          data.list[index].exp_time -= 1
          data.list[index].countDownTime = _countDown(data.list[index].exp_time)
          this.setState({
            tableData: data
          })
        }, 1000)
        console.log({ arrItem })
        arr.push(arrItem)
      }
    })
    this.setState({
      arr
    })
  }
  onChange(page) {
    console.log({page})
    this.child.setState({
      paramsData: { ...this.child.state.paramsData, page }
    }, () => {
      this.child.getOrderList()
    })
  }

  handClick(e, e1) {
    console.log(e)
  }
  // 翻页
  turnPage(type) {
    console.log(this.child)
    let page = type === 'nextPage' ? ++this.child.state.paramsData.page : --this.child.state.paramsData.page
    this.child.setState({
      paramsData: { ...this.child.state.paramsData, page }
    }, () => {
      this.child.getOrderList()
    })
  }
  // 获取子组件的表格列表
  getOrderList(list_type) {
    this.child.setState({
      paramsData: { ...this.child.state.paramsData, page: 1, list_type }
    }, () => {
      switch (list_type) {
        case 'all':
          this.child.changeStatus('', { list_type })
          break;
        case 'wait_pay':
          this.child.changeStatus('', { list_type })
          break;
        case 'wait_deliver':
          this.child.changeStatus('', { list_type })
          break;
        case 'wait_receive':
          this.child.changeStatus('', { list_type })
          break;
        case 'order_finish':
          this.child.changeStatus('', { list_type })
          break;
        default:
          this.child.getOrderList()
          break;
      }
    })
  }
  onRef(ref) {
    this.child = ref
  }
  // 展开更多信息
  showMore(index) {
    let data = this.state.tableData
    data.list[index].showAmount = data.list[index].showAmount === 3 ? 999 : 3
    this.setState({
      tableData: { ...this.state.tableData, ...data }
    })
  }
  // 跳转 订单详情
  toDetail(item) {
    this.props.history.push({ pathname: '/orderManage/orderInfo/' + item.order_id })
  }
  jump() {
    // this.setState({
    //   pageNo: ++this.state.tableData.pageNo
    // })
    this.setState((prevState) => {
      prevState.pageNo++
      return prevState
    })
  }
  render() {
    let tableData = this.state.tableData.list || []
    let pageNo = this.state.tableData.pageNo // 当前页数
    let list_type = this.state.tableData.list_type // 当前列表类型
    let total = this.state.tableData.total ? parseInt(this.state.tableData.total) : 1
    const menu = (
      <Menu>
        <Menu.Item onClick={() => this.getOrderList('all')}>
          <div className='menuItem'>全部</div>
        </Menu.Item>
        <Menu.Item onClick={() => this.getOrderList('wait_pay')}>
          <div className="menuItem">待付款</div>
        </Menu.Item>
        <Menu.Item onClick={() => this.getOrderList('wait_deliver')}>
          <div className="menuItem">待发货</div>
        </Menu.Item>
        <Menu.Item onClick={() => this.getOrderList('wait_receive')}>
          <div className="menuItem">待收货</div>
        </Menu.Item>
        <Menu.Item onClick={() => this.getOrderList('order_finish')}>
          <div className="menuItem">已完成</div>
        </Menu.Item>
      </Menu>
    );
    // let loading = this.props.loading
    return (
      <div className={styles.myorderWrap}>
        <Search onRef={(childThis) => this.onRef(childThis)} />
        {/* <table style={{'width': '100%'}}>
          <thead>
            <tr>
              <th colpan="2">商品</th>
              <th>商品</th>
              <th>商品</th>
              <th>商品</th>
              <th>商品</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan='2'>1</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
            </tr>
          </tbody>
        </table> */}
        <div className={styles.table}>
          {
            this.props.loading && <Loading />
          }
          <div className={`${styles.tableHeader} ${styles.flex_dom}`}>
            <div className={styles.goods}>商品</div>
            <div className={styles.price}>单价</div>
            <div className={styles.amount}>数量</div>
            <div className={styles.pay}>实付款</div>
            <div className={styles.status}>
              <div className='status'>
                {/* {
                  list_type === 'all' ? <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link">
                      订单状态 <Icon type="down" />
                    </a>
                  </Dropdown> : '订单状态'
                } */}
                <Dropdown overlay={menu} className='menuClass'>
                  <a className="ant-dropdown-link">
                    订单状态 <Icon type="down" />
                  </a>
                </Dropdown>
              </div>
            </div>
            <div className={styles.edit}>交易操作</div>
          </div>
          <div className='orderInfoWrap'>
            {
              tableData.length !== 0 && <div className={`${styles.page} ${styles.flex_dom} ${styles.flex_item_end}`}>
                <Button disabled={pageNo === 1} className={styles.mr10} onClick={() => this.turnPage('prevPage')}>上一页</Button>
                <Button onClick={() => this.turnPage('nextPage')} disabled={this.state.tableData.total <= (this.state.tableData.pageNo * 10)}>下一页</Button>
              </div>
            }
          </div>
          {
            (!tableData.length && !this.props.loading) && <NoData />
          }
          {
            tableData.map((item, index) =>
              <div key={index} className={styles.tableWrap}>
                <div className={styles.tableItem}>
                  <div className={`${styles.tableItemHead} ${styles.flex_dom}`}>
                    <div className={styles.date}>{item.create_time_date}</div>
                    <div className={`${styles.date} ${styles.orderNo}`}>
                      订单号：<span>{item.order_no}</span>
                    </div>
                    <div className={`${styles.date} ${styles.storeName}`}>{item.store_info.store_name}</div>
                  </div>
                </div>
                <div className={`${styles.tableContent} ${styles.flex_dom} ${styles.flex_item_mid}`}>
                  <div className={styles.flex_column}>
                    {
                      item.order_product_detail.map((item2, index2) =>
                        <React.Fragment key={index2}>
                          {
                            index2 < item.showAmount &&
                            <div className={`${styles.goodsInfo} ${styles.flex_dom} ${styles.flex_item_mid}`}>
                              <div className={styles.goodsImage}><img src={item2.goods_logo} alt='商品图' /></div>
                              <div>
                                <p className={styles.fontlimit2}>{item2.order_goods_name}</p>
                                <p className={styles.mt10}>规格：{item2.spec_name}</p>
                              </div>
                              <p className={styles.price}>￥{item2.confirm_price_format}</p>
                              <p className={styles.amount}>x{item2.order_num}</p>
                            </div>
                          }
                        </React.Fragment>
                      )
                    }
                  </div>

                  <div className={styles.fee} style={{ 'height': (((item.showAmount === 3) && item.order_product_detail.length > 3) ? 3 : item.order_product_detail.length) * 110 + 'px' }}>
                    <p className={styles.feePrice}>￥{item.order_final_amount}</p>
                    {
                      item.fee_info && <div><p className={styles.yunfei}>含物流费+其他费用</p>
                        <p className={styles.yunfei}>￥{item.total}</p>
                      </div>
                    }
                    <p className={styles.mobileOrder}>{item.order_from_name}</p>
                  </div>
                  <div className={styles.status} style={{ 'height': (((item.showAmount === 3) && item.order_product_detail.length > 3) ? 3 : item.order_product_detail.length) * 110 + 'px' }}>
                    <p>{item.order_status_name}</p>
                  </div>
                  <div className={styles.edit}>
                    {item.countDownTime &&
                      <div className={styles.time}><IconFont type='icon-daojishi' />{item.countDownTime}</div>
                    }
                    <div className={`${styles.flex_dom} ${styles.flex_item_mid} ${styles.flex_item_center}`}>
                      {
                        item.order_status_button && item.order_status_button.map((item1, index) =>
                          <Button className={`${styles.btn} ${item1.button_highlight && styles.highlight}`} size='small' key={index} onClick={() => this.buttonAction(item1, item)}>{item1.button_name}</Button>
                        )
                      }
                    </div>
                    <div className={styles.look_order} onClick={() => this.toDetail(item)}>查看订单</div>
                  </div>
                </div>
                {
                  item.order_product_detail.length > 3 &&
                  <div className={styles.moreInfo} onClick={() => this.showMore(index)}>
                    {item.showAmount === 3 ? '展开更多信息' : '收起更多信息'} <IconFont type='icon-shouyexiala' className={`${styles.moreIcon} ${item.showAmount !== 3 && styles.tranformTop}`} />
                  </div>
                }
              </div>
              // <div>查看订单</div>
            )
          }
        </div>
        <div className='orderInfoWrap'>
          <ConfigProvider locale={zhCN}>
            <Pagination className={styles.pagination} showQuickJumper hideOnSinglePage current={pageNo} defaultCurrent={1} total={total} onChange={(e) => this.onChange(e)} />
            <div class='jump' onClick={() => this.jump()}>跳转</div>
          </ConfigProvider>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     addAmount2: (value) => dispatch(addAmount(value))
//   }
// }
export default connect(mapStateToProps, '')(myOrder)
// export default App;
