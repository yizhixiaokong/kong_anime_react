import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Input } from "antd";
import type { MenuProps } from "antd";
import logo from "@/assets/logo.png";

const { Search } = Input;
const { Header } = Layout;

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
    key: "follow",
    label: <Link to="/follow">追番管理</Link>,
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

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();

  const onSearch = (value: string) => {
    if (value) {
      navigate(`/animes/search/${value}`);
    }
  };

  return (
    <Header className="App-header">
      <div className="logo">
        <div
          style={{
            height: "50px",
            width: "50px",
            borderRadius: "50px",
            overflow: "hidden",
          }}
        >
          <img
            src={logo}
            className="App-logo"
            alt="logo"
            style={{ transform: "scale(2)", borderRadius: "50px" }}
          />
        </div>

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
      <Search
        placeholder="番剧搜索"
        style={{ width: 200, marginLeft: "20px" }}
        onSearch={onSearch}
      />
    </Header>
  );
};

export default NavigationBar;
