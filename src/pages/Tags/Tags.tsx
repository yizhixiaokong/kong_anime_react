import React, { useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import { Tag, Tooltip, Modal, Input, Button, message } from "antd";
import {
  EditOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  fetchTags,
  updateTag,
  searchTags,
  createTag,
  deleteTag,
  fetchAnimesByTag,
  fetchTagStats,
} from "@/api/api";
import { useNavigate } from "react-router-dom";

const colors = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

interface AnimeTag {
  ID: string;
  Name: string;
}

function Tags() {
  const [tags, setTags] = useState<AnimeTag[]>([]);
  const [editingTag, setEditingTag] = useState<AnimeTag | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tagStats, setTagStats] = useState<{ [key: string]: number }>({});
  const inputRef = useRef<InputRef>(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchTags(), fetchTagStats()])
      .then(([data, stats]) => {
        setTags(data.tags);
        setTagStats(stats.tag_stats);
      })
      .catch((error) => {
        console.error("Error fetching tags or tag stats:", error);
      });
  }, []);

  useEffect(() => { 
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() === "") {
        fetchTags()
          .then((data) => {
            setTags(data.tags);
          })
          .catch((error) => {
            console.error("Error fetching tags:", error);
          });
      } else {
        searchTags(searchTerm)
          .then((data) => {
            setTags(data.tags);
          })
          .catch((error) => {
            console.error("Error searching tags:", error);
          });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleEdit = (tag: AnimeTag) => {
    setEditingTag(tag);
    setNewTagName(tag.Name);
  };

  const handleSave = () => {
    if (editingTag) {
      updateTag(editingTag.ID, { Name: newTagName })
        .then(() => {
          setTags((prevTags) =>
            prevTags.map((tag) =>
              tag.ID === editingTag.ID ? { ...tag, Name: newTagName } : tag
            )
          );
          setEditingTag(null);
        })
        .catch((error) => {
          console.error("Error updating tag:", error);
        });
    }
  };

  const handleCancel = () => {
    setEditingTag(null);
  };

  const handleDelete = (tag: AnimeTag) => {
    Modal.confirm({
      title: `确认删除标签 ${tag.Name} 吗？`,
      content: "删除后将无法恢复",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        deleteTag(tag.ID)
          .then(() => {
            message.success(`标签已删除`);
            setTags(tags.filter((t) => t.ID !== tag.ID));
          })
          .catch((error) => {
            console.error("Error deleting tag:", error);
          });
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.some((tag) => tag.Name === inputValue)) {
      createTag({ Name: inputValue })
        .then(() => {
          message.success(`标签已新增`);
          fetchTags().then((data) => {
            setTags(data.tags);
          });
          setInputVisible(false);
          setInputValue("");
        })
        .catch((error) => {
          console.error("Error adding tag:", error);
        });
    } else {
      setInputVisible(false);
      setInputValue("");
    }
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    if (isDeleting) setIsDeleting(false);
  };

  const toggleDeleting = () => {
    setIsDeleting(!isDeleting);
    if (isEditing) setIsEditing(false);
  };

  const handleTagClick = (tag: AnimeTag) => {
    if (isEditing || isDeleting) return; // 如果处于编辑或删除模式，不允许跳转
    fetchAnimesByTag("1", "10", tag.Name)
      .then(() => {
        navigate(`/animes/tag/${tag.Name}`);
      })
      .catch((error) => {
        console.error("Error fetching animes by tag:", error);
      });
  };

  return (
    <div className="app-container">
      <h1>标签管理</h1>
      <div className="search-bar">
        <Input.Search
          placeholder="搜索标签"
          enterButton={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <Tooltip title="展示全部">
          <Button
            type="primary"
            shape="circle"
            icon={<UnorderedListOutlined />}
            onClick={() => {
              fetchTags()
                .then((data) => {
                  setTags(data.tags);
                })
                .catch((error) => {
                  console.error("Error fetching tags:", error);
                });
            }}
            className="action-button"
          />
        </Tooltip>
        <Tooltip title="编辑标签">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={toggleEditing}
            className="action-button"
          />
        </Tooltip>
        <Tooltip title="删除标签">
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={toggleDeleting}
            className="action-button"
          />
        </Tooltip>
      </div>
      <div className="tags-container">
        {tags.map((tag, index) => (
          <Tag
            key={tag.ID}
            color={colors[index % colors.length]}
            className="tag-item"
            closable={isDeleting}
            onClose={() => handleDelete(tag)}
            onClick={() => handleTagClick(tag)}
          >
            {tag.Name} <span className="tag-count">({tagStats[tag.Name] || 0})</span>
            {isEditing && (
              <Tooltip title="编辑">
                <EditOutlined
                  className="edit-icon"
                  onClick={() => handleEdit(tag)}
                />
              </Tooltip>
            )}
          </Tag>
        ))}
        {inputVisible ? (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            className="new-tag-input"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Tag
            className="new-tag"
            onClick={showInput}
          >
            <PlusOutlined /> 新增标签
          </Tag>
        )}
      </div>
      <Modal
        title="编辑标签"
        open={!!editingTag}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Input
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default Tags;
