import React, { Component } from 'react';
import { Provider } from 'react-redux'
// import './App.scss';
import MainLayOut from '@/components/layout/index'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import {routes, routes2} from '@/router/index'
import store from '@/store'
import zhCN from 'antd/es/locale/zh_CN';
import {ConfigProvider} from 'antd'
class App extends Component {
  render() {
    let LayoutRouter = (
      <MainLayOut history={this.props.history}>
        <Switch>
          {/* <Route exact path="/index" component={index} />
          <Route path='/orderManage/myOrder' component={myOrder} />
          <Route path="/testPage" component={testPage} /> */}
          {routes.map((item, index) => {
            return <Route key={index} path={item.path} exact render={props => {
              document.title = item.title
              return (item.path === '/login' ? (<item.component {...props} />) : (localStorage.getItem('user') ? <item.component {...props} /> : <Redirect to={{
                pathname: '/login'
              }} />))} }/>
          })}
        </Switch>
      </MainLayOut>
    );
    return (
      <Provider store={store}>
        <ConfigProvider locale={zhCN}>
        <Router>
          <Switch>
          {routes2.map((item, index) => {
              document.title = item.title
              return <Route key={index} path={item.path} exact render={props =>{
                document.title = item.title
                return (item.path === '/login' ? (<item.component {...props} />) : (localStorage.getItem('user') ? <item.component {...props} /> : <Redirect to={{pathname: '/login'}} />))}} />
            })}
            <Route path="/" render={(props) => LayoutRouter} />
          </Switch>
        </Router>
        </ConfigProvider>
      </Provider>
    )
  }
}

export default App;
