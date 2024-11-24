import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import { fetchHello } from "@/api/api";
import "@/pages/Home/Home.css";
import TimeLine from "./components/TimeLine"; // 引入TimeLine组件

const { Paragraph, Text, Title } = Typography;

function Home() {
  const [currentTime, setCurrentTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toISOString().slice(0, 19).replace("T", " ");
      setCurrentTime(formattedTime);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchHello()
      .then((res) => {
        setMessage(res.msg);
      })
      .catch((error) => console.error("Error fetching message:", error));
  }, []);

  return (
    <div className="home-container">
      <Title level={1} className="home-title">
        让我康康小空的根据地里有什么好宝贝
      </Title>
      <div className="home-content">
        <Paragraph className="home-paragraph">
          <Text strong>{message || <span>&nbsp;</span>}</Text>
        </Paragraph>
        {currentTime && (
          <Paragraph className="home-paragraph">
            <Text strong>当前时间:</Text> {currentTime}
          </Paragraph>
        )}
        <TimeLine /> 
      </div>
    </div>
  );
}

export default Home;
