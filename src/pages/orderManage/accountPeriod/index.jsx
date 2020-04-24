import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './index.scss';
import store from '@/store/index'
import { Table, Button, Icon } from 'antd'
import API from '@/api/api'
import { getSearchDate, _countDown }  from '@/utils/common'
import localforage from 'localforage'
console.log({ styles })
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_596292_ip517qpqxx.js',
});
class accountPeriod extends Component {
  state = {
    nav: [{name: '全部', count: 0, status: ''}, {name: '待支付', count: 0, status: 'period_activate'}, {name: '已支付', count: 0, status: 'period_finish'}],
    time: ['昨天', '今天', '最近七天', '最近15天', '最近30天'],
    _index: 0,
    _timeIndex: -1,
    data: [],
    paramsData: {
      page: 1,
      period_state: '', // period_activate 未支付， period_finish 已支付
      period_end_time: '',
      period_begin_time: ''
    },
    arr: [],
    pagination: {
      pageSize: 15,
      current: 1,
      total: 1,
      onChange: (current) => this.changePage(current)
    }
  }
  changePage(current) {
    this.setState({
      paramsData: {...this.state.paramsData, page: current}
    })
    this.getList()
  }
  changeStatus(index, item) {
    this.setState({
      _index: index,
      paramsData: {...this.state.paramsData, period_state: item.status, page: 1}
    }, () => {
      this.getList()
    })
  }
  componentDidMount() {
    store.subscribe(() => {
      console.log('改变了', store.getState())
    })
    this.getList()
  }
  _clearInterval() {
    if (!this.state.arr.length) return
    this.state.arr.forEach((item) => {
      clearInterval(item)
    })
  }
  periodInfo(record) {
    this.props.history.push({pathname: `/orderManage/accountPeriod/detail/${record.period_id}`})
  }
  getList() {
    this._clearInterval()
    API.getperiodList(this.state.paramsData).then((res) => {
      console.log({res})
      if (res.result === 1) {
        let nav = this.state.nav
        nav[0].count = res.data.pay_all_count
        nav[1].count = res.data.unpay_count
        nav[2].count = res.data.pay_count
        this.setState({
          data: res.data.list,
          pagination: {...this.state.pagination, current: this.state.paramsData.page, total: res.data.pay_all_count},
          nav
        }, () => {
          let arr = []
          console.log(this.state.data)
          this.state.data.forEach((item, index) => {
            if (item.period_state === 'period_activate' && !item.is_delay) { // 未逾期并且为完成
              let arrItem = setInterval(() => {
                let list = this.state.data
                list[index].period_expire_time_date_timestamp -= 1
                list[index].countTime = _countDown(list[index].period_expire_time_date_timestamp)
                this.setState({
                  data: list
                })
              }, 1000);
              arr.push(arrItem)
            }
          })
          this.setState({
            arr
          })
        })
      }
    })
  }
  chooseTime(index, item) {
    console.log(index, item)
    let timeIndex = index !== this.state._timeIndex ? index : -1
    let data
    // let time = (new Date(new Date().setHours(0,0,0,0)).getTime() / 1000) + 86400
    if (index > 1) {
      // data = {...this.state.paramsData, period_begin_time: getSearchDate('今天'), period_end_time: time, page: 1}
      data = index !== this.state._timeIndex ? {...this.state.paramsData, period_begin_time: getSearchDate(item), period_end_time: getSearchDate('今天'), page: 1} : {...this.state.paramsData, period_begin_time: '', period_end_time: '', page: 1}
    } else {
      data = index !== this.state._timeIndex ? {...this.state.paramsData, period_begin_time: getSearchDate(item), period_end_time: getSearchDate(item), page: 1} : {...this.state.paramsData, period_begin_time: '', period_end_time: '', page: 1}
    }
    this.setState({
      _timeIndex: timeIndex,
      paramsData: data
    }, () => {
      this.getList()
    })
  }
  lookOrder(item) {
      console.log(({item}))
      this.props.history.push({pathname: `/orderManage/orderInfo/${item.order_id}`})
  }
  toPay(item) {
    // this.props.history({pathname: '/pay/cashier'})
    localforage.setItem('order', {...item, type: 2}).then((res) => {
      console.log({ res })
      this.props.history.push({ pathname: '/pay/cashier' })
    })
  }
  render() {
    const { _index, _timeIndex, data } = this.state
    const columns = [
      {
        title: '账期编号',
        dataIndex: 'order_no', // 产品要求 账期编号取账期订单号展示 2020/04/01
        align: 'center',
        className: 'cellItem',
        render: text => <a>{text}</a>,
      },
      {
        title: '账期状态',
        align: 'center',
        className: 'cellItem',
        dataIndex: 'delay_status_name',
        render: (text, record) => <p style={{color: record.is_delay && '#EA2717'}}>{text}</p>
      },
      {
        title: '账期金额',
        align: 'center',
        className: 'cellItem',
        dataIndex: 'payment_amount',
      },
      {
        title: '未支付金额',
        align: 'center',
        className: 'cellItem',
        dataIndex: 'period_unpay_amount'
      },
      {
        title: '到期时间',
        align: 'center',
        className: 'cellItem',
        dataIndex: 'period_expire_time_date'
      },
      {
        title: '交易操作',
        align: 'center',
        className: 'cellItem',
        render: (text, record) => (
          <div className={styles.action}>
            {
              (record.period_state === "period_activate" && !record.is_delay) && <div className={styles.coutDown}><IconFont type='icon-daojishi' />{record.countTime}</div>
            }
            {
              record.button.map((item, index) => 
                <React.Fragment key={index}>
                  {
                    item.button_type === 131 && <Button type='primary' size='small' onClick={() => this.toPay(record)}>去付款</Button>
                  }
                </React.Fragment>
              )
            }
            <p onClick={() => this.lookOrder(record)}>查看订单</p>
            <p onClick={() => this.periodInfo(record)}>账期详情</p>
          </div>
        ),
      },
    ];
    return (
      <div className={styles.accountPeriod}>
        <div className={`${styles.head} ${styles.flex_dom} ${styles.flex_item_between} ${styles.flex_item_mid}`}>
          <div className={`${styles.classfiy} ${styles.flex_dom}`}>
            {
              this.state.nav.map((item, index) => <div className={`${styles.item} ${_index === index && styles.active}`} key={index} onClick={() => this.changeStatus(index, item)}><div className={styles.itemWrap}>{item.name} &nbsp;{parseInt(item.count) !== 0 && <span>{item.count}</span>}</div></div>)
            }
          </div>
        </div>
        <div className={styles.content}>
          <div className={`${styles.timeChoose} ${styles.flex_dom} ${styles.flex_item_mid}`}>
            <div className={styles.time}>时间选择：</div>
            {
              this.state.time.map((item, index) => <div className={`${styles.item} ${styles.mr10} ${_timeIndex === index && styles.bgActive}`} key={item} onClick={() => this.chooseTime(index, item)}>{item}</div>)
            }
          </div>
          <Table rowKey={record => record.period_id} pagination={this.state.pagination} columns={columns} dataSource={data} bordered className={styles.mt20}></Table>
        </div>
      </div>
    )
  }
}
export default connect('', '')(accountPeriod)
// export default App;
