import React, { useState, useEffect } from "react";
import { Typography, Row, Col, Card, message, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchAnimeSeasons } from "@/api/api";
import spring from "@/assets/spring.png";
import summer from "@/assets/summer.png";
import autumn from "@/assets/autumn.png";
import winter from "@/assets/winter.png";
import "./AnimeSeasons.css";

const { Title } = Typography;
const { Meta } = Card;
type Seasons = Map<string, Map<string, number>>;

const seassonImage: { [key: string]: string } = {
  "01": winter,
  "04": spring,
  "07": summer,
  "10": autumn,
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

  const sortedSeasons = ["01", "04", "07", "10"];

  return (
    <div className="app-container">
      <Title level={1}>季度番剧</Title>
      {Array.from(seasons.keys()).map((year) => (
        <div key={year}>
          <Title level={2}>{year} 年</Title>
          <Row gutter={[16, 16]}>
            {sortedSeasons
              .filter((season) => seasons.get(year)!.has(season))
              .map((season) => (
                <Col span={6} key={season}>
                  <Tooltip title="点击跳转">
                    <Card
                      onClick={() => handleSeasonClick(year, season)}
                      cover={
                        <img
                          className="season-image"
                          alt="example"
                          src={seassonImage[season]}
                        />
                      }
                      className="season-card"
                    >
                      <Meta title={seasons.get(year)!.get(season) + "部番剧"} />
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
