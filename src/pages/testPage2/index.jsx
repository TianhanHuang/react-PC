import React, { useState, useEffect } from 'react';

function Example(props) {
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0);
  const [fruit, setFruit] = useState('fruit')
  const [number, setNumber] = useState([1,2,3,4])
  const [table, setTable] = useState(() => getTable(1))
  function getTable(value) {
    return value
  }
  useEffect(() => {
    document.title = `title ${count}`;
    return () => { // effect的清除机制 组件卸载或者页面更新的时候执行
      alert('clean')
    }
  }, [count]) // 只有在count发生变化的时候才会执行
  function go() {
    props.history.push({pathname: '/testPage/testPage1/123'})
    // this.props.history.push({pathname: '/testPage/testPage1/123'})
  }
  useEffect(() => {
    // const id = setInterval(() => {
    //   setCount(c => c + 1);
    // }, 1000)
    // return () => {
    //   clearInterval(id)
    // }
  }, [])
  function Layout() {
    let list = number.map((item) => 
      <p>{item}</p>
    )
    return (list)
  }
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <p>{fruit}</p>
      <div>
        {number}
      </div>
      <div onClick={() => go()}>go</div>
      <div>table: {table}</div>
      <div>
      <Layout/>
      </div>
      {
        number.map(item => 
          <div key={item}>{item}</div>
        )
      }
    </div>
  );
}
export default Example;