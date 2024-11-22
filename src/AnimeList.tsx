import React, { useState, useEffect } from "react";
import { List, Pagination, Typography, Row, Col, Divider, Tag, Modal, Tooltip, message, Button } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchAnimes, deleteAnime } from "./api";
import EditAnimeForm from "./EditAnimeForm";
import AddAnimeForm from "./AddAnimeForm";

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
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

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

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };

  const showDeleteConfirm = (anime: Anime) => {
    Modal.confirm({
      title: `确认删除 ${anime.Name} 吗？`,
      content: '删除后将无法恢复',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteAnime(anime.ID)
          .then(() => {
            message.success(`${anime.Name} 已删除`);
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
          })
          .catch((error) => {
            console.error("Error deleting anime:", error);
            const errorMessage = error.response?.data?.error || error.message || error;
            message.error(`删除动漫失败，请重试: ${errorMessage}`);
          });
      },
    });
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
                  <Tooltip title="删除">
                    <DeleteOutlined style={{ marginLeft: "10px" }} onClick={() => showDeleteConfirm(anime)} />
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={1}>动漫列表</Title>
        <Tooltip title="新增动漫">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={showAddModal}
          />
        </Tooltip>
      </div>
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
      <Modal title="新增动漫" open={isAddModalVisible} onCancel={handleAddCancel} footer={null}>
        <AddAnimeForm
          onClose={() => {
            handleAddCancel();
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
      </Modal>
    </div>
  );
};

export default AnimeList;
