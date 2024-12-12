import React, { useEffect, useState } from "react";
import {
  List,
  Typography,
  Divider,
  Button,
  Tooltip,
  Modal,
  Collapse,
  Popover,
  DatePicker,
} from "antd";
import { PlusOutlined, CalendarOutlined, MessageOutlined, EditOutlined } from "@ant-design/icons";
import {
  fetchFollowedCategories,
  fetchFollows,
  updateFollowStatus,
  updateFollow,
} from "@/api/api";
import { FollowCategory, FollowStatus } from "@/api/followEnums";
import AddFollowForm from "@/pages/Follow/AddFollowForm";
import EditFollowTable from "@/pages/Follow/EditFollowTable"; 
import { RightCircleFilled } from "@ant-design/icons";
import "./Follow.css";

const { Title } = Typography;
const { Panel } = Collapse;

interface Category {
  description: string;
  string: string;
  value: FollowCategory;
  [property: string]: any;
}

interface Anime {
  Name: string;
  Season: string;
  [property: string]: any;
}

interface FollowAnime {
  Anime: Anime;
  ID: number;
  Status: FollowStatus;
  Category: FollowCategory;
  FinishedAt: string;
  [property: string]: any;
}

const Follow: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [follows, setFollows] = useState<{ [key: number]: FollowAnime[] }>({});
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const statusColorList: Record<FollowStatus, string> = { 0: "#a1d1cf", 1: "#d6d135", 2: "#da8a8a" };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchFollowedCategories();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  const loadFollows = async (categoryValue: FollowCategory) => {
    try {
      const followData = await fetchFollows("1", "100", categoryValue);
      setFollows((prevFollows) => ({
        ...prevFollows,
        [categoryValue]: followData.data,
      }));
    } catch (error) {
      console.error("Error fetching follows:", error);
    }
  };

  const handleStatusChange = async (followId: number, status: FollowStatus) => {
    try {
      await updateFollowStatus(followId.toString(), { status });
      // 更新状态后重新加载追番信息
      categories.forEach((category) => loadFollows(category.value));
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const handleDateChange = async (follow: FollowAnime, date: any) => {
    try {
      const formattedDate = date.toISOString();
      const updatedFollow = { ...follow, FinishedAt: formattedDate };
      await updateFollow(follow.ID.toString(), updatedFollow);
      // 更新完成时间后重新加载追番信息
      categories.forEach((category) => loadFollows(category.value));
    } catch (error) {
      console.error("Error updating follow finished date:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Shanghai'
    });
  };

  const renderFollowItem = (follow: FollowAnime) => {
    return (
      <List.Item key={follow.ID} className="follow-list-item">
        <div className="follow-item-content">
          <div className="follow-item-name">{follow.Anime.Name}</div>
          <div className="follow-item-season">季度：{follow.Anime.Season}</div>
          <Popover
            content={
              <div>
                <Button
                  className={`chooseBtn ${follow.Status === FollowStatus.WantToWatch ? 'active' : ''}`}
                  onClick={() =>
                    handleStatusChange(follow.ID, FollowStatus.WantToWatch)
                  }
                >
                  想看
                </Button>
                <Button
                  className={`chooseBtn ${follow.Status === FollowStatus.Watching ? 'active' : ''}`}
                  onClick={() =>
                    handleStatusChange(follow.ID, FollowStatus.Watching)
                  }
                >
                  在看
                </Button>
                <Button
                  className={`chooseBtn ${follow.Status === FollowStatus.Watched ? 'active' : ''}`}
                  onClick={() =>
                    handleStatusChange(follow.ID, FollowStatus.Watched)
                  }
                >
                  看过
                </Button>
              </div>
            }
            title="选择番剧状态"
            trigger="click"
          >
            <div
              className="follow-item-status"
              style={{
                color:
                  follow.Status || follow.Status === 0
                    ? statusColorList[follow.Status]
                    : "",
              }}
            >
              {follow.Status || follow.Status === 0 ? FollowStatus.getStringMapping()[FollowStatus[follow.Status]] : ""}
            </div>
          </Popover>
          {follow.FinishedAt && (
            <div className="follow-item-finishedAt">
              看完时间：{formatDate(follow.FinishedAt)}
              <Popover
                content={
                  <DatePicker
                    picker="date"
                    onChange={(date) => handleDateChange(follow, date)}
                  />
                }
                title="选择完成时间"
                trigger="click"
                placement="bottom"
              >
                <Tooltip title="修改完成时间">
                  <CalendarOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </Popover>
              <Tooltip title="去评价">
                <MessageOutlined style={{ marginLeft: 8 }} />
              </Tooltip>
            </div>
          )}
        </div>
      </List.Item>
    );
  };

  const handleAddFollow = () => {
    setIsAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleAddSuccess = () => {
    setIsAddModalVisible(false);
    // 重新加载分类和追番信息
    categories.forEach((category) => loadFollows(category.value));
  };

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handlePanelChange = (key: string | string[]) => {
    if (key) {
      const category = categories.find(
        (category) => category.value.toString() === key[0]
      );
      if (category) {
        loadFollows(category.value);
      }
    }
  };


  return (
    <div className="app-container">
      <div className="header">
        <div className="title-container">
          <Title level={1} className="header-title">
            追番列表
          </Title>
        </div>
        <div className="action-buttons">
          <Tooltip title="新增追番">
            <Button
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={handleAddFollow}
              className="action-button"
            />
          </Tooltip>
          <Tooltip title="编辑追番">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={handleEdit}
              className="action-button"
            />
          </Tooltip>
        </div>
      </div>
      <Divider variant="dashed" className="divider" />
      <Collapse
        accordion
        ghost
        size="small"
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <RightCircleFilled
            style={{ fontSize: "24px" }}
            rotate={isActive ? 90 : 0}
          />
        )}
        onChange={handlePanelChange}
      >
        {categories.map((category) => (
          <Panel
            header={
              <div className="category-header">
                <h2>{category.string}</h2>
                <h4 className="category-description">
                  —— {category.description}
                </h4>
              </div>
            }
            key={category.value.toString()}
          >
            <List
              itemLayout="horizontal"
              size="large"
              dataSource={follows[category.value]}
              renderItem={renderFollowItem}
              className="follow-list"
            />
          </Panel>
        ))}
      </Collapse>
      {isAddModalVisible && (
        <Modal
          title="新增追番"
          open={isAddModalVisible}
          onCancel={handleAddCancel}
          footer={null}
        >
          <AddFollowForm onClose={handleAddSuccess} />
        </Modal>
      )}
      {isEditModalVisible && (
        <Modal
          title="编辑追番"
          open={isEditModalVisible}
          onCancel={handleEditCancel}
          footer={null}
          width={800}
        >
          <EditFollowTable />
        </Modal>
      )}
    </div>
  );
};

export default Follow;
