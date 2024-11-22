import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import logo from "./logo.svg";
import "./App.css";
import Home from "./Home";
import AnimeList from "./AnimeList";
import AnimeSeasons from "./AnimeSeasons";
import Categories from "./Categories";
import TimeLine from "./TimeLine"
import Tags from "./Tags";

const { Header, Content } = Layout;

// 番剧列表、季度番剧、追番时间轴、内容管理（分类管理、标签管理）
const items: MenuProps["items"] = [
  {
    key: "animes",
    label: <Link to="/animes">番剧列表</Link>,
  },
  {
    key: "seasons",
    label: <Link to="/seasons">季度番剧</Link>,
  },
  {
    key: "timeline",
    label: <Link to="/timeline">追番时间轴</Link>,
  },
  {
    key: "content",
    label: "内容管理",
    children: [
      {
        key: "content-categories",
        label: <Link to="/categories">分类管理</Link>,
      },
      {
        key: "content-tags",
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
      <Route path="/animes/season/:season" element={<AnimeList />} />
      <Route path="/animes/category/:category" element={<AnimeList />} />
      <Route path="/animes/tag/:tag" element={<AnimeList />} />
      <Route path="/seasons" element={<AnimeSeasons />} />
      <Route path="/timeline" element={<TimeLine />} />
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
            <Link to="/" className="App-title">
              小空的根据地
            </Link>
          </div>
          <Menu
            style={{ marginLeft: "20px" }}
            theme="dark"
            mode="horizontal"
            items={items}
          />
        </Header>
        <Content style={{ padding: "20px" }}>
          <AppRoutes />
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
