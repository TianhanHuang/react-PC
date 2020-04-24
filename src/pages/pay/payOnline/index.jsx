import React, { Component } from 'react'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import styles from './index.scss'
import { Button, Icon, Table } from 'antd';
import Header from '@/components/layout/header/index'
import localforage from 'localforage'
import API from '../../../api/api';
import $ from 'jquery'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_596292_kvnqwkva51.js',
});
class PayOnline extends Component {

  state = {
    arr: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    params: {},
    img: '',
    tableData: []
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
    localforage.getItem("order").then((res) => {
      console.log(res)
      this.setState({
        type: res.type
      })
    })
    localforage.getItem('payParams').then((res) => {
      console.log({ res })
      this.setState({
        params: res,
        img: res.bankItem.bank_list[res._index].bank_icon_url
      })
    })
    this.getTable()
  }
  getTable() {
    API.getTable().then((res) => {
      console.log(res)
      if (res.result === 1) {
        this.setState
          ({
            tableData: res.data[this.state.params.issInsCode]
          })
      }
    })
  }
  Pay() {
    const { params } = this.state
    delete params.bankItem
    delete params.payment_id
    delete params._index
    console.log({params})
    if (this.state.type === 2) {
      API.periodPay(params).then((res) => {
        console.log('wangguan', { res })
        if (res.result === 1) {
          // console.log(JSON.parse(res.data.payinfo))
          let data = res.data.payinfo
          console.log(data.params)
          this.post(data.requestUrl, data.params)
          // this.toDetailPage(data)
        }
      })
      return
    }
    API.quickPay(params).then((res) => {
      console.log('wangguan', { res })
      if (res.result === 1) {
        // console.log(JSON.parse(res.data.payinfo))
        let data = res.data.payinfo
        console.log(data.params)
        this.post(data.requestUrl, data.params)
        // this.toDetailPage(data)
      }
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
  render() {
    const { tableData } = this.state
    let ICBC = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 4
          }
          if (index > 0 && index < 4) {
            obj.props.rowSpan = 0
          }

          if (index === 4) {
            obj.props.rowSpan = 6
          }
          if ((index > 4 && index < 10)) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
    ];
    let ABC = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 3
          }
          if (index > 0 && index < 3) {
            obj.props.rowSpan = 0
          }

          if (index === 3) {
            obj.props.rowSpan = 3
          }
          if (index > 3) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
    ];
    let BOC = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
    ];
    let CCB = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 4
          }
          if (index > 0) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
    ];
    let COMM = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 4
          }
          if (index > 0) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
    ];
    let PSBC = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 4
          }
          if (index > 0) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
    ];
    let CEB = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 4
          }
          if (index > 0) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 2
          }
          if (index > 0 && index < 2) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 2
          }
          if (index > 0 && index < 2) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 2
          }
          if (index > 0 && index < 2) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          // if (index === 0) {
          //   obj.props.rowSpan = 10
          // }
          // if (index > 0 && index < 10) {
          //   obj.props.rowSpan = 0
          // }
          return obj;
        }
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
    ];
    let CMBC = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center'
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
    ];
    let GDB = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center'
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
    ];
    let SHBANK = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 2
          }
          if (index > 0 && index < 2) {
            obj.props.rowSpan = 0;
          }
          if (index === 2) {
            obj.props.rowSpan = 2
          }
          if (index > 2 && index < 4) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 4
          }
          if (index > 0 && index < 5) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
    ];
    let CMB = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 2
          }
          if (index > 0 && index < 2) {
            obj.props.rowSpan = 0;
          }
          if (index === 2) {
            obj.props.rowSpan = 2
          }
          if (index > 2 && index < 4) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center'
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
    ];
    let CIB = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 10
          }
          if (index > 0 && index < 10) {
            obj.props.rowSpan = 0
          }
          return obj;
        }
      },
    ];
    let SPABANK = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center'
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150
      },
    ];
    let SPDB = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150
      },
    ];
    let CITIC = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 2
          }
          if (index > 0 && index < 3) {
            obj.props.rowSpan = 0;
          }
          if (index === 2) {
            obj.props.rowSpan = 2
          }
          if (index > 2 && index < 4) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150
      },
    ];
    let BJBANK = [
      {
        title: '银行',
        dataIndex: 'bank_name',
        // vertical: 'middle',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 6
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '开通范围',
        dataIndex: 'the_scope_of',
        align: 'center',
        width: 100,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 3
          }
          if (index > 0 && index < 3) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
      },
      {
        title: '客户类型',
        dataIndex: 'custom_type',
        align: 'center',
        width: 150
      },
      {
        title: '单笔限额（元）',
        dataIndex: 'single',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '日累计限额（元）',
        dataIndex: 'day_top',
        align: 'center',
        width: 150
        // render: renderContent,
      },
      {
        title: '开通条件',
        dataIndex: 'condition',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          console.log({ value })
          if (index === 0) {
            obj.props.rowSpan = 4
          }
          if (index > 0) {
            obj.props.rowSpan = 0;
          }
          return obj;
        }
        // width: 300,
        // render: renderContent,
      },
      {
        title: '服务热线',
        dataIndex: 'phone',
        align: 'center',
        width: 150
      },
    ];
    let columns = []
    switch (this.state.params.issInsCode) {
      case 'ICBC':
        columns = ICBC
        break;
      case 'ABC':
        columns = ABC
        break;
      case 'BOC':
        columns = BOC
        break;
      case 'CCB':
        columns = CCB
        break;
      case 'COMM':
        columns = COMM
        break;
      case 'PSBC':
        columns = PSBC
        break;
      case 'CEB':
        columns = CEB
        break;
      case 'CMBC':
        columns = CMBC
        break;
      case 'GDB':
        columns = GDB
        break;
      case 'SHBANK':
        columns = SHBANK
        break;
      case 'CMB':
        columns = CMB
        break;
      case 'CIB':
        columns = CIB
        break;
      case 'SPABANK':
        columns = SPABANK
        break;
      case 'SPDB':
        columns = SPDB
        break;
      case 'CITIC':
        columns = CITIC
        break;
      case 'BJBANK':
        columns = BJBANK
        break;
      default:
        break;
    }
    return (
      <div className={styles.PayOnline}>
        <Header type='payOnline' />
        <div className={`${styles.payOnlineContent} ${styles.layoutContent}`}>
          <div className={`${styles.bank} ${styles.flex_dom} ${styles.flex_item_mid}`}>
            <div className={styles.box}>
              <IconFont type='icon-gouxuan' />
            </div>
            <div className={`${styles.bankWrap} ${styles.flex_dom}`}>
              <div className={styles.bankName}>
                <img src={this.state.img} alt='' />
              </div>
              <div className={styles.bankType}>
                {this.state.params.payType === '01' ? '企业' : '个人'}
              </div>
            </div>
          </div>
          <Table columns={columns} rowKey={(record, index) => index} dataSource={tableData} bordered className={styles.mt30} size='middle' pagination={false} />
          <Button type='primary' size='large' className={styles.btns} onClick={() => this.Pay()}>到网上银行支付</Button>
        </div>
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
export default connect('', '')(PayOnline)
// export default App;
