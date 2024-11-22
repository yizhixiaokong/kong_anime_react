import React, { useEffect, useRef, useState } from "react";
import type { InputRef } from 'antd';
import { Tag, Tooltip, Modal, Input, Button, message } from "antd";
import { EditOutlined, SearchOutlined, UnorderedListOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchTags, updateTag, searchTags, createTag, deleteTag } from "./api";

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

interface Tag {
  ID: string;
  Name: string;
}

function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    fetchTags()
      .then((data) => {
        setTags(data.tags);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
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
            message.error(`搜索标签失败，请重试: ${error.message}`);
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

  const handleEdit = (tag: Tag) => {
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

  const handleDelete = (tag: Tag) => {
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
            message.error(`删除标签失败，请重试: ${error.message}`);
          });
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.some(tag => tag.Name === inputValue)) {
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
          message.error(`新增标签失败，请重试: ${error.message}`);
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

  return (
    <div style={{ width: "40%", margin: "0 auto" }}>
      <h1>标签管理</h1>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <Input.Search
          placeholder="搜索标签"
          enterButton={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ borderRadius: "20px", flex: 1 }}
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
            style={{ marginLeft: "10px" }}
          />
        </Tooltip>
        <Tooltip title="编辑标签">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={toggleEditing}
            style={{ marginLeft: "10px" }}
          />
        </Tooltip>
        <Tooltip title="删除标签">
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={toggleDeleting}
            style={{ marginLeft: "10px" }}
          />
        </Tooltip>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 8px" }}>
        {tags.map((tag, index) => (
          <Tag
            key={tag.ID}
            color={colors[index % colors.length]}
            style={{ display: "flex", alignItems: "center", fontSize: "16px", padding: "8px" }}
            closable={isDeleting}
            onClose={() => handleDelete(tag)}
          >
            {tag.Name}
            {isEditing && (
              <Tooltip title="编辑">
                <EditOutlined style={{ marginLeft: "8px" }} onClick={() => handleEdit(tag)} />
              </Tooltip>
            )}
          </Tag>
        ))}
        {inputVisible ? (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            style={{ width: 78, marginRight: 8, verticalAlign: 'top' }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Tag
            style={{ background: "#fff", borderStyle: "dashed", display: "flex", alignItems: "center", justifyContent: "center" }}
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
