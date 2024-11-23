import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  message,
  Button,
  Tooltip,
  Modal,
  Input,
  Form,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  LeftSquareOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  deleteCategory,
  updateCategory,
  createCategory,
  searchCategories,
} from "@/api/api";

interface Category {
  ID: string;
  Name: string;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchAllCategories = () => {
    fetchCategories()
      .then((data) => {
        setCategories(data.categories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() === "") {
        fetchAllCategories();
      } else {
        searchCategories(searchTerm)
          .then((data) => {
            setCategories(data.categories);
          })
          .catch((error) => {
            console.error("Error searching categories:", error);
          });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: `确认删除该分类吗？`,
      content: "删除后将无法恢复",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        deleteCategory(id)
          .then(() => {
            message.success(`分类已删除`);
            setCategories(categories.filter((cat) => cat.ID !== id));
          })
          .catch((error) => {
            console.error("Error deleting category:", error);
          });
      },
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({ name: category.Name });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSave = (values: { name: string }) => {
    if (editingCategory) {
      updateCategory(editingCategory.ID, { Name: values.name })
        .then(() => {
          message.success(`分类已更新`);
          setCategories(
            categories.map((cat) =>
              cat.ID === editingCategory.ID
                ? { ...cat, Name: values.name }
                : cat
            )
          );
          setIsModalVisible(false);
          setEditingCategory(null);
        })
        .catch((error) => {
          console.error("Error updating category:", error);
        });
    }
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    formAdd.resetFields();
  };

  const handleAddSave = (values: { name: string }) => {
    createCategory({ Name: values.name })
      .then(() => {
        message.success(`分类已新增`);
        fetchCategories().then((data) => {
          setCategories(data.categories);
        });
        setIsAddModalVisible(false);
      })
      .catch((error) => {
        console.error("Error adding category:", error);
      });
  };

  const handleCategoryClick = (category: Category) => {
    navigate(`/animes/category/${category.Name}`);
  };

  return (
    <div className="app-container">
      <h1>分类管理</h1>
      <div className="search-bar">
        <Input.Search
          placeholder="搜索分类"
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
            onClick={fetchAllCategories}
            className="action-button"
          />
        </Tooltip>
        <Tooltip title="新增分类">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={showAddModal}
            className="action-button"
          />
        </Tooltip>
      </div>
      <Row gutter={[16, 16]}>
        {categories.map((category) => (
          <Col xs={24} sm={12} md={8} lg={6} key={category.ID}>
            <Card
              className="category-card"
              title={
                <Tooltip title="点击跳转">
                  <span
                    onClick={() => handleCategoryClick(category)}
                    className="category-title"
                  >
                    {category.Name} <LeftSquareOutlined />
                  </span>
                </Tooltip>
              }
              bordered={false}
              actions={[
                <Tooltip title="编辑">
                  <EditOutlined onClick={() => handleEdit(category)} />
                </Tooltip>,
                <Tooltip title="删除">
                  <DeleteOutlined onClick={() => handleDelete(category.ID)} />
                </Tooltip>,
              ]}
            >
              内容填充：{category.Name}
            </Card>
          </Col>
        ))}
      </Row>
      {isModalVisible && (
        <Modal
          title="编辑分类"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          {editingCategory && (
            <Form
              form={form}
              initialValues={{ name: editingCategory.Name }}
              onFinish={handleSave}
            >
              <Form.Item
                name="name"
                label="分类名称"
                rules={[{ required: true, message: "请输入分类名称" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
                <Button onClick={handleCancel} style={{ marginLeft: "10px" }}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          )}
        </Modal>
      )}
      {isAddModalVisible && (
        <Modal
          title="新增分类"
          open={isAddModalVisible}
          onCancel={handleAddCancel}
          footer={null}
        >
          <Form form={formAdd} onFinish={handleAddSave}>
            <Form.Item
              name="name"
              label="分类名称"
              rules={[{ required: true, message: "请输入分类名称" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={handleAddCancel} style={{ marginLeft: "10px" }}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}

export default Categories;
