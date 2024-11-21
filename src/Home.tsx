import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { fetchCurrentTime, fetchMessage } from './api';

const { Paragraph, Text, Title } = Typography;

function Home() {
  const [currentTime, setCurrentTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      fetchCurrentTime()
        .then(time => setCurrentTime(time))
        .catch(error => console.error('Error fetching time:', error));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchMessage()
      .then(msg => setMessage(msg))
      .catch(error => console.error('Error fetching message:', error));
  }, []);

  return (
    <>
      <Title level={1}>小空的根据地</Title>
      <Paragraph>
        <Text strong>当前时间:</Text> {currentTime}
      </Paragraph>
      <Paragraph>
        <Text strong>{message}</Text>
      </Paragraph>
    </>
  );
}

export default Home;
