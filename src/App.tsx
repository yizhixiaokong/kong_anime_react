import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import logo from './logo.svg';
import './App.css';
import Home from './Home';
import AnimeList from './AnimeList';
import Categories from './Categories';
import Tags from './Tags';

const { Header, Content } = Layout;

const items: MenuProps['items'] = [
  // {
  //   key: '1',
  //   label: <Link to="/">首页</Link>,
  // },
  {
    key: '1',
    label: <Link to="/animes">动漫列表</Link>,
  },
  {
    key: '2',
    label: "内容管理",
    children: [
      {
        key: '2-1',
        label: <Link to="/categories">分类管理</Link>,
      },
      {
        key: '2-2',
        label: <Link to="/tags">标签管理</Link>,
      },
    ],
  },

];

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/animes" element={<AnimeList />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/tags" element={<Tags />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Layout className="App">
        <Header className="App-header">
          <div className="logo">
            <img src={logo} className="App-logo" alt="logo" />
            <Link to="/" className="App-title">小空的根据地</Link>
          </div>
          <Menu theme="dark" mode="horizontal" items={items} />
        </Header>
        <Content style={{ padding: '20px' }}>
          <AppRoutes />
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
