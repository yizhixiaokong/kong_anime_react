import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";
import "@/App.css";
import Home from "@/pages/Home/Home";
import AnimeList from "@/pages/AnimeList/AnimeList";
import AnimeSeasons from "@/pages/AnimeSeasons/AnimeSeasons";
import Categories from "@/pages/Categories/Categories";
import Tags from "@/pages/Tags/Tags";
import NavigationBar from "@/components/NavigationBar";
import Follow from "@/pages/Follow/Follow";

const { Content } = Layout;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/animes" element={<AnimeList />} />
      <Route path="/animes/season/:season" element={<AnimeList />} />
      <Route path="/animes/category/:category" element={<AnimeList />} />
      <Route path="/animes/tag/:tag" element={<AnimeList />} />
      <Route path="/animes/search/:name" element={<AnimeList />} />
      <Route path="/seasons" element={<AnimeSeasons />} />
      <Route path="/follow" element={<Follow />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/tags" element={<Tags />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Layout className="App">
        <NavigationBar />
        <Content
          style={{
            padding: "20px",
            minHeight: "calc(100vh - 64px)",
            overflow: "auto",
          }}
        >
          <AppRoutes />
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
