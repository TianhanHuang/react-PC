import React, { Component } from 'react'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import styles from './index.scss'
import { Button, message, Row, Col } from 'antd';
import Header from '@/components/layout/header/index'
import { Icon } from 'antd';
import API from '@/api/api'
import localforage from 'localforage'
import GetSmsCode from '@/components/pay/getSms'
import $ from 'jquery'
import QRCode from 'qrcode.react';
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_596292_gbdbmcuhdww.js',
});
class Cashier extends Component {

  state = {
    arr: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    returnData: {},
    bankList: {
      pab_cross_bank: []
    },
    isShow: false,
    wanyinSelect: false,
    quickSelect: true,
    order: {},
    amount: 0,
    payBank: {
      bankType: '01',
      accNo: '****'
    },
    paramsData: {},
    arr1: [],
    arr2: [],
    arr3: [],
    payCardType: '01',
    _index: -1,
    isPerson: true,
    prevIndex: 0,
    prevIndex2: 0,
    tabIndex: 0,
    activeBankIndex: 0,
    mostIndex: 3,
    mostIndex2: 3,
    scanImg: '',
    setInt: '',
    type: 1
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
    this.getBankList()
    localforage.getItem("order").then((res) => {
      console.log(res)
      this.setState({
        type: res.type
      })
      if (res.type === 1) {
        this.getOrderDetail(res)
      } else {
        this.getPeriodDetail(res)
      }
    })
  }
  getPeriodDetail(item) {
    API.getPeriodInfo({ period_id: item.period_id }).then((res) => {
      console.log('order_info', res)
      // res.data.order_data.forEach((item) => {
      //   if (item.type === 'order_info') {
      this.setState({
        order: res.data.info,
        amount: this.numberChinese(res.data.info.actual_amount)
      })
      //   }
      // })
    })
  }
  chooseQuick(index) {
    console.log(index)
    this.setState({
      activeBankIndex: index
    })
    // let arr = this.state.bankList
    // arr.pab_cross_bank[index].isSelected = !arr.pab_cross_bank[index].isSelected
    // console.log({arr})
    // this.setState((prevState) =>{
    //   delete prevState.bankList;
    //   return prevState;
    // })
    // this.setState({
    //   bankList: arr
    // })
  }
  getOrderDetail(item) {
    API.getOrderDetail({ order_id: item.order_id }).then((res) => {
      console.log('order_info', res)
      res.data.order_data.forEach((item) => {
        if (item.type === 'order_info') {
          this.setState({
            order: item.order_info,
            amount: this.numberChinese(item.order_info.order_amount)
          })
        }
      })
    })
  }
  bindBank() {
    API.bindyinlianCard().then((res) => {
      // console.log({res})
      this.setState({
        returnData: res.data
      }, () => {
        console.log({ res }, this.state.returnData)
        // this.toBind()
        this.post(this.state.returnData.requestUrl, res.data.params)
      })

    })
  }
  numberChinese(str) {
    var num = parseFloat(str);
    var strOutput = "",
      strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
    num += "00";
    var intPos = num.indexOf('.');
    if (intPos >= 0) {
      num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
    }
    strUnit = strUnit.substr(strUnit.length - num.length);
    for (var i = 0; i < num.length; i++) {
      strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
    }
    return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元")
  }
  // 快捷
  getBankList() {
    console.log(API)
    API.getBankList().then((res) => {
      this.setState({
        bankList: res.data,
        arr1: res.data.bank[0].bank_list,
        arr2: res.data.bank[1].bank_list,
        arr3: res.data.bank[2].bank_list,
        payBank: res.data.pab_cross_bank[0] ? res.data.pab_cross_bank[0] : {
          bankType: '01',
          accNo: '****'
        }
      })
    })
  }
  toDetailPage(obj) {
    var form = $("<form method='post'></form>");
    console.log(obj);
    form.attr({ "action": obj.requestUrl });
    $.each(obj.params, function (name, value) {
      var input1 = $("<input type='hidden'>").attr("name", name).val(value);
      form.append(input1);
    })
    $("body").append($(form));
    form.submit();
  }
  post(url, params) {
    // 创建form元素
    var temp_form = document.createElement("form");
    // 设置form属性
    temp_form.action = url;
    temp_form.target = "_blank";
    temp_form.method = "post";
    // temp_form.
    temp_form.style.display = "none";
    // 处理需要传递的参数
    for (var x in params) {
      console.log({ x })
      var opt = document.createElement("input");
      opt.name = x;
      opt.value = params[x];
      temp_form.appendChild(opt);
    }
    // console.log(temp_form.value)
    document.body.appendChild(temp_form);
    // 提交表单
    temp_form.submit();
  }
  showBankList() {
    this.setState({
      isShow: !this.state.isShow
    })
  }
  onRef(ref) {
    this.child = ref
  }
  clickBank(item) {
    this.setState({
      payBank: item,
      isShow: false
    })
  }
  confirmPeriodPay() {
    if (this.state.tabIndex === 0) {
      this.wanguangPay()
      return
    }
    if (!this.state.bankList.pab_cross_bank.length) return message.error('请添加银行卡')
    API.getSmsPeriod({ payment_id: this.state.order.payment_id, OpenId: this.state.bankList.pab_cross_bank[this.state.activeBankIndex].OpenId, trade_amount: this.state.order.period_unpay_amount }).then((res) => {
      if (res.result === 1) {
        console.log({ res })
        this.setState({
          paramsData: res.data
        })
        this.child.showPopup(res)
      }
    })
  }
  confirmPay() {
    if (this.state.type === 2) {
      this.confirmPeriodPay()
      return
    }
    if (this.state.tabIndex === 0) {
      this.wanguangPay()
      return
    }
    if (!this.state.bankList.pab_cross_bank.length) return message.error('请添加银行卡')
    API.getSms({ order_id: this.state.order.order_id, OpenId: this.state.bankList.pab_cross_bank[this.state.activeBankIndex].OpenId }).then((res) => {
      if (res.result === 1) {
        console.log({ res })
        this.setState({
          paramsData: res.data
        })
        this.child.showPopup(res)
      }
    })
  }
  wanguangPay() {
    console.log(this.state.bankList)
    if (this.state.isPerson && this.state.payCardType !== '01' && this.state.payCardType !== '02') return message.error('请选择银行卡类型')
    if (this.state._index === -1) return message.error('请选择银行卡')
    let bankItem = this.state.bankList.bank.filter((item) => {
      return item.payCardType === this.state.payCardType
    })[0]
    console.log({ bankItem })
    let params = {
      payment_id: this.state.order.payment_id,
      trade_amount: this.state.order.period_unpay_amount,
      trade_channel: bankItem.trade_channel,
      trade_method: bankItem.trade_method,
      order_ids: this.state.order.order_id,
      payType: bankItem.payType,
      payCardType: this.state.payCardType,
      issInsCode: bankItem.bank_list[this.state._index].issInsCode,
      bankItem,
      _index: this.state._index
    }
    localforage.setItem('payParams', params).then((res) => {
      // this.props.history.push({pathname: '/pay/payOnline'})
      window.open('http://192.168.0.25:3001/pay/payOnline')
    })
    // API.quickPay(params).then((res) => {
    //   console.log('wangguan', { res })
    //   if (res.result === 1) {
    //     // console.log(JSON.parse(res.data.payinfo))
    //     let data = res.data.payinfo
    //     console.log(data.params)
    //     // this.post(data.requestUrl, data.params)
    //     this.toDetailPage(data)
    //   }
    // })
  }
  getScanPay() {
    API.quickPay({ trade_channel: 'pab_aggregate', trade_method: 'alipay_scan', order_ids: this.state.order.order_id }).then((res) => {
      if (res.result === 1) {
        console.log("scan", res)
        this.setState({
          scanImg: res.data.payinfo.trade_qrcode
        }, () => {
          let setInt = setInterval(() => {
            this.payCheck(res.data.payment_id)
          }, 2000)
          this.setState({
            setInt
          })
        })
      }
    })
  }
  getScanPay2() {
    API.periodPay({ trade_channel: 'pab_aggregate', trade_method: 'alipay_scan', payment_id: this.state.order.payment_id, trade_amount: this.state.order.period_unpay_amount }).then((res) => {
      if (res.result === 1) {
        console.log("scan", res)
        this.setState({
          scanImg: res.data.payinfo.trade_qrcode
        }, () => {
          let setInt = setInterval(() => {
            this.payCheck(res.data.payment_id)
          }, 2000)
          this.setState({
            setInt
          })
        })
      }
    })
  }
  payCheck(payment_id) {
    API.payCheck({ payment_id }).then((res) => {
      console.log('轮询', res)
      if (res.data.status === 'payment_success') {
        clearInterval(this.state.setInt)
        this.props.history.push({ pathname: `/pay/success/${this.state.order.order_id}` })
      }
    })
  }
  // 接收子组件传来的验证码
  getChildren(params) {
    console.log({ params })
    // console.log(params.splice(''))
    let verifyCode = params.reduce((t, item) => {
      return t + item
    }, '')
    console.log({ verifyCode })
    if (this.state.type === 2) {
      API.periodPay({ ...this.state.payBank, ...this.state.paramsData, order_ids: this.state.order.order_id, verifyCode, payment_id: this.state.order.payment_id, trade_amount: this.state.order.period_unpay_amount }).then((res) => {
        console.log('wangguan', { res })
        if (res.result === 1) {
          message.success('支付成功');
          this.child.close()
          this.props.history.push({ pathname: `/pay/success/${this.state.order.order_id}` })
        }
      })
      return
    }
    API.quickPay({ ...this.state.payBank, ...this.state.paramsData, order_ids: this.state.order.order_id, verifyCode }).then((res) => {
      if (res.result === 1) {
        message.success('支付成功');
        this.child.close()
        this.props.history.push({ pathname: `/pay/success/${this.state.order.order_id}` })
      }
    })
  }
  choose(val) {
    this.setState({
      tabIndex: val,
      _index: -1
    })
    if (val === 2) {
      if (this.state.type === 1) {
        this.getScanPay()
      } else {
        this.getScanPay2()
      }
    } else {
      clearInterval(this.state.setInt)
    }
  }
  selected(index) {
    this.setState({
      _index: index
    })
  }
  goReturn() {
    window.history.go(-1)
  }
  userType(index) {
    if (index === this.state.prevIndex) return
    this.setState({
      isPerson: !this.state.isPerson,
      prevIndex: index,
      payCardType: index === 0 ? '01' : '00',
      prevIndex2: 0
    })
  }
  selectCard(index) {
    console.log(index, this.state.prevIndex2)
    if (index === this.state.prevIndex2) return
    this.setState({
      payCardType: this.state.payCardType === '01' ? '02' : '01',
      prevIndex2: index
    })
  }
  showMore() {
    this.setState({
      mostIndex: this.state.mostIndex === 3 ? this.state.bankList.pab_cross_bank.length : 3
    })
  }
  showMore2() {
    // let item = this.state.bankList.bank.filter((item) => {
    //   return item.payCardType === this.state.payCardType
    // })
    let amount = ''
    switch (this.state.payCardType) {
      case '00':
        amount = Math.ceil(this.state.arr1.length / 5)
        break;
      case '01':
        amount = Math.ceil(this.state.arr2.length / 5)
        break;
      case '02':
        amount = Math.ceil(this.state.arr3.length / 5)
        break;
      default:
        break;
    }
    this.setState({
      mostIndex2: this.state.mostIndex2 === 3 ? amount : 3
    })
  }
  render() {
    const { bankList, activeBankIndex, quickSelect, order, payBank, isPerson, payCardType, tabIndex } = this.state
    return (
      <div className={styles.cashierWrap}>
        <Header type='cashier' />
        <div className={`${styles.content} ${styles.layoutContent} ${styles.flex_dom} ${styles.flex_item_between}`}>
          <div className={styles.contentLeft}>
            <div className={styles.contentLeftTop}>
              <div className={`${styles.title} ${styles.flex_item_mid}`}>
                <span className={styles.line}></span>
                <p>收银条</p>
              </div>
              {
                order && <div className={styles.itemWrap}>
                  <div className={styles.item}>
                    <span>订单号&nbsp;&nbsp;&nbsp;&nbsp;：</span>
                    {order.order_no || order.period_no}
                  </div>
                  <div className={styles.item}>
                    <span>收款方&nbsp;&nbsp;&nbsp;&nbsp;：</span>
                收单系统
              </div>
                  <div className={styles.item}>
                    <span>收款账号：</span>
                200031114620190221222668073
              </div>
                  {this.state.type === 1 &&
                    <div className={styles.item}>
                      <span>订单金额：</span>
                      <span className={styles.specel}>￥{order.order_amount}</span>
                    </div>}
                  {
                    this.state.type === 2 &&
                    <div className={styles.item}>
                      <span>账期金额：</span>
                      <span className={styles.specel}>￥{order.period_amount}</span>
                    </div>
                  }
                  {
                    this.state.type === 2 &&
                    <div className={styles.item}>
                      <span>未支付金额：</span>
                      <span className={styles.specel}>￥{order.period_unpay_amount}</span>
                    </div>
                  }
                  <div className={styles.item}>
                    <span>大写金额：</span>
                    <span className={styles.specel}>{this.state.amount}</span>
                  </div>
                </div>
              }
            </div>
            <p className={styles.tips}>您即将向收单系统付款，由此产生的法律后果由您自行承担</p>
          </div>
          <div className={styles.contentRight}>
            <div className={styles.bankWrap}>
              {/* <div className={`${styles.pay} ${styles.flex_dom} ${styles.flex_item_mid}`}>
                <div className={styles.selectIcon} onClick={() => this.select('wanyin')}>
                  {
                    wanyinSelect && <IconFont type='icon-gouxuan' />
                  }
                </div>
                网银支付
              </div> */}
              <div className={`${styles.selectsWrap} ${styles.flex_dom} ${styles.mt10}`}>
                <div className={`${styles.enterprise}`} style={{ 'color': tabIndex === 0 && '#ff8008', background: tabIndex === 0 && '#fff' }} onClick={() => this.choose(0)}><IconFont type='icon-yinlian' />网银支付</div>
                <div className={styles.person} style={{ 'color': tabIndex === 1 && '#ff8008', background: tabIndex === 1 && '#fff' }} onClick={() => this.choose(1)}><IconFont type='icon-kuaijie' />快捷支付</div>
                <div className={styles.person} style={{ 'color': tabIndex === 2 && '#ff8008', background: tabIndex === 2 && '#fff' }} onClick={() => this.choose(2)}><IconFont type='icon-zhifubao' />支付宝支付</div>
              </div>
              {
                tabIndex === 0 &&
                <React.Fragment>
                  <div className={styles.search}>
                    <Row className={styles.mt10}>
                      <Col span={3}>用户类型：</Col>
                      <Col span={3} className={styles.flex_dom}>
                        <div className={styles.selectIcon} onClick={() => this.userType(0)}>
                          {
                            isPerson && <IconFont type='icon-gouxuan' />
                          }
                        </div>
                    个人用户
                  </Col>
                      <Col span={3} className={styles.flex_dom}>
                        <div className={styles.selectIcon} onClick={() => this.userType(1)}>
                          {
                            !isPerson && <IconFont type='icon-gouxuan' />
                          }
                        </div>
                    企业用户
                  </Col>
                    </Row>
                    {
                      isPerson &&
                      <Row className={styles.mt10}>
                        <Col span={3}>银行卡类型：</Col>
                        <Col span={3} className={styles.flex_dom}>
                          <div className={styles.selectIcon} onClick={() => this.selectCard(0)}>
                            {
                              payCardType === '01' && <IconFont type='icon-gouxuan' />
                            }
                          </div>
                      储蓄卡
                    </Col>
                        <Col span={3} className={styles.flex_dom}>
                          <div className={styles.selectIcon} onClick={() => this.selectCard(1)}>
                            {
                              payCardType === '02' && <IconFont type='icon-gouxuan' />
                            }
                          </div>
                      信用卡
                    </Col>
                      </Row>
                    }
                    <Row className={styles.mt10}>
                      <Col span={3}>选择银行：</Col>
                    </Row>
                  </div>
                  <div className={`${styles.listWrap} ${styles.flex_dom}`} style={{ height: this.state.mostIndex2 * 51 + 'px' }}>
                    {
                      this.state.payCardType === '00' &&
                      this.state.arr1.map((item, index) =>
                        <div key={index} className={`${styles.item} ${index > 4 && styles.mt10}`} onClick={() => this.selected(index)}>
                          <div className={styles.imgBox} style={{ 'border': index === this.state._index ? '1px solid #ff8008' : '1px solid #e1e1e1' }}>
                            <img src={item.bank_icon_url} alt={item.bank_name} title={item.bank_name} />
                          </div>
                        </div>
                      )
                    }
                    {
                      this.state.payCardType === '01' &&
                      this.state.arr2.map((item, index) =>
                        <div key={index} className={`${styles.item} ${index > 4 && styles.mt10}`} onClick={() => this.selected(index)}>
                          <div className={styles.imgBox} style={{ 'border': index === this.state._index ? '1px solid #ff8008' : '1px solid #e1e1e1' }}>
                            <img src={item.bank_icon_url} alt={item.bank_name} title={item.bank_name} />
                          </div>
                        </div>
                      )
                    }
                    {
                      this.state.payCardType === '02' &&
                      this.state.arr3.map((item, index) =>
                        <div key={index} className={`${styles.item} ${index > 4 && styles.mt10}`} onClick={() => this.selected(index)}>
                          <div className={styles.imgBox} style={{ 'border': index === this.state._index ? '1px solid #ff8008' : '1px solid #e1e1e1' }}>
                            <img src={item.bank_icon_url} alt={item.bank_name} title={item.bank_name} />
                          </div>
                        </div>
                      )
                    }
                  </div>
                  {(this.state.payCardType === '00' && Math.ceil(this.state.arr1.length / 5) > 3) && <div className={styles.moreShow} onClick={() => this.showMore2()}>{this.state.mostIndex2 > 3 ? '隐藏' : '展示更多'}</div>}
                  {(this.state.payCardType === '01' && Math.ceil(this.state.arr2.length / 5) > 3) && <div className={styles.moreShow} onClick={() => this.showMore2()}>{this.state.mostIndex2 > 3 ? '隐藏' : '展示更多'}</div>}
                  {(this.state.payCardType === '02' && Math.ceil(this.state.arr3.length / 5) > 3) && <div className={styles.moreShow} onClick={() => this.showMore2()}>{this.state.mostIndex2 > 3 ? '隐藏' : '展示更多'}</div>}
                </React.Fragment>
              }
              {
                tabIndex === 1 &&
                <div className={`${styles.listWrap} ${styles.listWrap2}`}>
                  {bankList.pab_cross_bank.length > 0 &&
                    <div style={{ height: this.state.mostIndex * 50 + 'px', 'overflow': 'hidden' }}>
                      {bankList.pab_cross_bank.map((item, index) =>
                        <div className={`${styles.payBox} ${styles.flex_dom} ${styles.flex_item_mid} ${activeBankIndex === index ? `${styles.active}` : ''}`} key={index} onClick={() => this.chooseQuick(index)}>
                          <div className={styles.selectIcon}>
                            {
                              activeBankIndex === index && <IconFont type='icon-gouxuan' />
                            }
                          </div>
                          <div className={styles.bankImg}>
                            <img src={item.bank_icon_url} alt="" />
                          </div>
                          <p style={{ 'marginRight': '35px' }}>**** **** **** {item.accNo}</p>
                          <div className={styles.card}>{item.bankType === '02' ? '信用卡' : '借记卡'}</div>
                        </div>
                      )}
                      {bankList.pab_cross_bank.length < 3 && <p className={`${styles.addCard} ${styles.mt10}`} onClick={() => this.bindBank()}>添加新的银行卡</p>}
                    </div>
                  }
                  {
                    bankList.pab_cross_bank.length > 3 && <div className={styles.showMore} onClick={() => this.showMore()}>{this.state.mostIndex === 3 ? '展示更多' : '隐藏'}</div>}
                  {bankList.pab_cross_bank.length >= 3 && <p className={`${styles.addCard} ${styles.mt10}`} onClick={() => this.bindBank()}>添加新的银行卡</p>}
                </div>
              }
              {
                tabIndex === 2 &&
                <div className={`${styles.listWrap} ${styles.zhifubao}`}>
                  <div className={styles.payBoxWrap}>
                    <div className={styles.codeImg}>
                      {/* <img src={this.state.scanImg} alt='' /> */}
                      <QRCode
                        value={this.state.scanImg}  //value参数为生成二维码的链接
                        size={200} //二维码的宽高尺寸
                        fgColor="#000000"  //二维码的颜色
                      />
                      <p>请使用手机支付宝扫码</p>
                    </div>
                    <div className={styles.tips}>
                      <p>防骗提醒</p>
                      <p className={styles.mt10}>任何情况下农联平台都不会通过微信或者QQ聊天工具将支付二维码单独发给用户支付，谨防骗子假冒农联平台，特此提醒！</p>
                    </div>
                  </div>
                </div>
              }
            </div>
            {tabIndex !== 2 && <div className={`${styles.btns} ${styles.flex_dom} ${styles.flex_item_center}`}>
              <Button type="primary" className={styles.confirmPay} onClick={() => this.confirmPay()}>确认支付</Button>
              <Button type="primary" className={styles.cancelPay} onClick={() => this.goReturn()}>取消交易</Button>
            </div>}
          </div>
        </div>
        <GetSmsCode onRef={(ref) => this.onRef(ref)} getChildren={(params) => this.getChildren(params)} confirmPay={() => this.confirmPay()} phone={this.state.payBank.telephone} price={this.state.type === 1 ? this.state.order.order_amount : this.state.order.period_unpay_amount} />
      </div>
    )
  }
}

// const mapStateToProps = (state) => {
//   return {
//     amount: state.amount
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     addAmount2: (value) => dispatch(addAmount(value))
//   }
// }
export default connect('', '')(Cashier)
// export default App;
