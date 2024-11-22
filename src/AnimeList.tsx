import React, { useState, useEffect } from "react";
import { List, Pagination, Typography, Row, Col, Divider, Tag, Modal, Tooltip, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { fetchAnimes } from "./api";
import EditAnimeForm from "./EditAnimeForm";

const { Title, Text } = Typography;

interface Anime {
  ID: string;
  Name: string;
  Aliases: string[];
  Categories: string[];
  Tags: string[];
  Production: string;
  Season: string;
  Episodes: number;
  Image: string;
}

const AnimeList: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchAnimes(page.toString(), pageSize.toString())
      .then((data) => {
        const transformedAnimes = data.animes.map((anime: any) => ({
          ...anime,
          Aliases: anime.Aliases.split(","),
          Categories: anime.Categories.map((category: any) => category.Name),
          Tags: anime.Tags.map((tag: any) => tag.Name),
        }));
        setAnimes(transformedAnimes);
        setTotal(data.total);
      })
      .catch((error) => {
        console.error("Error fetching animes:", error);
        const errorMessage = error.response?.data?.error || error.message || error;
        message.error(`获取动漫列表失败，请重试: ${errorMessage}`);
      });
  }, [page, pageSize]);

  const showEditModal = (anime: Anime) => {
    setEditingAnime(anime);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingAnime(null);
  };

  const renderAnimeItem = (anime: Anime) => (
    <List.Item key={anime.ID} style={{ padding: "10px 0" }}>
      <Row gutter={16} align="middle">
        <Col span={6}>
          <img src={anime.Image} alt={anime.Name} style={{ width: "100%", height: "100%" }} />
        </Col>
        <Col span={18}>
          <div style={{ textAlign: "left", marginLeft: "20px" }}>
            <List.Item.Meta
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  {anime.Name}
                  <Tooltip title="编辑">
                    <EditOutlined style={{ marginLeft: "10px" }} onClick={() => showEditModal(anime)} />
                  </Tooltip>
                </div>
              }
              description={anime.Aliases.join(", ")}
            />
            <Text strong>分类:</Text> {anime.Categories.join(" / ")}
            <div>
              <Text strong>标签:</Text> {anime.Tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
            </div>
            <Text strong>制作公司:</Text> {anime.Production}
            <div>
              <Text strong>季度:</Text> {anime.Season} <Text strong>集数:</Text> {anime.Episodes}
            </div>
          </div>
        </Col>
      </Row>
    </List.Item>
  );

  return (
    <div style={{ width: "40%", margin: "0 auto", border: "2px solid #d9d9d9", padding: "20px", backgroundColor: "#ffffff" }}>
      <Title level={1}>动漫列表</Title>
      <Divider variant="dashed" style={{ borderColor: "#7cb305" }} />
      <List itemLayout="vertical" size="large" dataSource={animes} renderItem={renderAnimeItem} />
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
      <Modal title="编辑动漫" open={isModalVisible} onCancel={handleCancel} footer={null}>
        {editingAnime && (
          <EditAnimeForm
            key={editingAnime.ID}
            anime={editingAnime}
            onClose={() => {
              handleCancel();
              fetchAnimes(page.toString(), pageSize.toString()).then((data) => {
                const transformedAnimes = data.animes.map((anime: any) => ({
                  ...anime,
                  Aliases: anime.Aliases.split(","),
                  Categories: anime.Categories.map((category: any) => category.Name),
                  Tags: anime.Tags.map((tag: any) => tag.Name),
                }));
                setAnimes(transformedAnimes);
                setTotal(data.total);
              });
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default AnimeList;
