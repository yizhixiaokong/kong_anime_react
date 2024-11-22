import React, { useState, useEffect } from "react";
import { List, Pagination, Typography, Row, Col, Divider, Tag } from "antd";
import { fetchAnimes } from "./api";

const { Title, Text } = Typography;

interface Anime {
  ID: string;
  Name: string;
  Aliases: string;
  Categories: { Name: string }[];
  Tags: { Name: string }[];
  Production: string;
  Season: string;
  Episodes: number;
  Image: string;
}

function AnimeList() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAnimes(page.toString(), pageSize.toString())
      .then((data) => {
        setAnimes(data.animes);
        setTotal(data.total);
      })
      .catch((error) => console.error("Error fetching animes:", error));
  }, [page, pageSize]);

  return (
    <div
      style={{
        width: "40%",
        margin: "0 auto",
        border: "2px solid #d9d9d9",
        padding: "20px",
        backgroundColor: "#ffffff",
      }}
    >
      <Title level={1}>动漫列表</Title>
      <Divider variant="dashed" style={{ borderColor: "#7cb305" }} />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={animes}
        renderItem={(anime) => (
          <List.Item key={anime.ID} style={{ padding: "10px 0" }}>
            <Row gutter={16} align="middle">
              <Col span={6}>
                <img
                  src={anime.Image}
                  alt={anime.Name}
                  style={{ width: "100%", height: "100%" }}
                />
              </Col>
              <Col span={18}>
                <div style={{ textAlign: "left", marginLeft: "20px" }}>
                  <List.Item.Meta
                    title={anime.Name}
                    description={anime.Aliases}
                  />

                  <div style={{ textAlign: "left" }}>
                    <Text strong>分类:</Text>{" "}
                    {anime.Categories.map((category) => category.Name).join(
                      " / "
                    )}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <Text strong>标签:</Text>{" "}
                    {anime.Tags.map((tag) => (
                      <Tag>{tag.Name}</Tag>
                    ))}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <Text strong>制作公司:</Text> {anime.Production}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <Text strong>季度:</Text> {anime.Season}{" "}
                    <Text strong>集数:</Text> {anime.Episodes}
                  </div>
                </div>
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <Pagination
          align="end"
          showQuickJumper
          showSizeChanger
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          }}
        />
      </div>
    </div>
  );
}

export default AnimeList;
