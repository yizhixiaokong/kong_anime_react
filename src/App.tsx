import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import logo from './logo.svg';
import './App.css';
import Home from './Home';
import AnimeList from './AnimeList';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="App">
        <Header className="App-header">
          <div className="logo">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/animes">动漫列表</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/animes" element={<AnimeList />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
