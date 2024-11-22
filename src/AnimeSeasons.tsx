import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Card, message, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftSquareOutlined} from "@ant-design/icons";
import { fetchAnimeSeasons } from "./api";

const { Title } = Typography;

type Seasons = Map<string, Map<string, number>>;

const seasonNames: { [key: string]: string } = {
  "01": "冬 1月新番",
  "04": "春 4月新番",
  "07": "夏 7月新番",
  "10": "秋 10月新番",
};

const AnimeSeasons: React.FC = () => {
  const [seasons, setSeasons] = useState<Seasons>(new Map());
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnimeSeasons()
      .then((data) => {
        const seasonsMap: Seasons = new Map();
        Object.keys(data.seasons).forEach((year) => {
          const seasonMap = new Map<string, number>();
          Object.keys(data.seasons[year]).forEach((season) => {
            seasonMap.set(season, data.seasons[year][season]);
          });
          seasonsMap.set(year, seasonMap);
        });
        setSeasons(seasonsMap);
      })
      .catch((error) => {
        console.error("Error fetching anime seasons:", error);
        const errorMessage =
          error.response?.data?.error || error.message || error;
        message.error(`获取季度番剧失败，请重试: ${errorMessage}`);
      });
  }, []);

  const handleSeasonClick = (year: string, season: string) => {
    const seasonParam = `${year}-${season}`;
    navigate(`/animes/season/${seasonParam}`);
  };

  return (
    <div
      style={{
        width: "60%",
        margin: "0 auto",
        border: "2px solid #d9d9d9",
        padding: "20px",
        backgroundColor: "#ffffff",
      }}
    >
      <Title level={1}>季度番剧</Title>
      {Array.from(seasons.keys()).map((year) => (
        <div key={year}>
          <Title level={2}>{year} 年</Title>
          <Row gutter={[16, 16]}>
            {Array.from(seasons.get(year)!.keys()).map((season) => (
              <Col span={6} key={season}>
                <Tooltip title="点击跳转">
                  <Card
                    title={
                      <span>
                        {seasonNames[season]} <LeftSquareOutlined/>
                      </span>
                    }
                    onClick={() => handleSeasonClick(year, season)}
                    style={{ cursor: "pointer", transition: "transform 0.3s" }}
                    hoverable
                  >
                    {seasons.get(year)!.get(season)} 部番剧
                  </Card>
                </Tooltip>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
};

export default AnimeSeasons;
