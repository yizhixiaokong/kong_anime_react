import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import { fetchPing, fetchHello } from "@/api/api";
import "@/pages/Home/Home.css";

const { Paragraph, Text, Title } = Typography;

function Home() {
  const [currentTime, setCurrentTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      fetchPing()
        .then((res) => setCurrentTime(res.time))
        .catch((error) => console.error("Error fetching time:", error));
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
      <Paragraph>
        <Text strong>{message || <span>&nbsp;</span>}</Text>
      </Paragraph>
      {currentTime && (
        <Paragraph>
          <Text strong>当前时间:</Text> {currentTime}
        </Paragraph>
      )}
    </div>
  );
}

export default Home;
