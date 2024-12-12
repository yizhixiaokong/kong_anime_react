import React, { useEffect, useState } from "react";
import { Table, Modal, Input } from "antd";
import { fetchFollows, deleteFollow } from "@/api/api";
import { FollowCategory, FollowStatus } from "@/api/followEnums";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Search } = Input;

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

const EditFollowTable: React.FC = () => {
  const [allFollows, setAllFollows] = useState<FollowAnime[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [category, setCategory] = useState<FollowCategory>();
  const [status, setStatus] = useState<FollowStatus>();
  const [name, setName] = useState<string>();
  const [sorter, setSorter] = useState<string>();

  const loadAllFollows = async (
    page: number,
    pageSize: number,
    category?: FollowCategory,
    status?: FollowStatus,
    name?: string,
    sorter?: string
  ) => {
    try {
      const data = await fetchFollows(
        page.toString(),
        pageSize.toString(),
        category,
        status,
        name,
        sorter
      );
      setAllFollows(data.data);
      setPagination({ current: page, pageSize, total: data.total });
      setCategory(category);
      setStatus(status);
      setName(name);
      setSorter(sorter);
    } catch (error) {
      console.error("Error fetching all follows:", error);
    }
  };

  useEffect(() => {
    loadAllFollows(
      pagination.current,
      pagination.pageSize,
      category,
      status,
      name,
      sorter
    );
    }, []);
    

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    loadAllFollows(
      pagination.current,
      pagination.pageSize,
      filters.category?.[0],
      filters.status?.[0],
      name,
      sorter.order==="ascend" ? "asc" : sorter.order==="descend" ? "desc" : undefined
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Shanghai",
    });
  };

  const handleEditFollow = (follow: FollowAnime) => {
    // 编辑追番的逻辑
  };

  const { confirm } = Modal;

  const handleDeleteFollow = async (followId: number) => {
    confirm({
      title: "确认删除此追番吗?",
      content: "删除后将无法恢复",
      onOk: async () => {
        try {
          await deleteFollow(followId.toString());
          // 删除后重新加载追番信息
          loadAllFollows(
            pagination.current,
            pagination.pageSize,
            category,
            status,
            name,
            sorter
          );
        } catch (error) {
          console.error("Error deleting follow:", error);
        }
      },
      onCancel() {
        console.log("取消删除");
      },
    });
  };

  const handleSearch = async (value: string) => {
    setName(value);
    loadAllFollows(
      pagination.current,
      pagination.pageSize,
      category,
      status,
      value,
      sorter
    );
  };

  const columns = [
    {
      title: "番剧名称",
      dataIndex: ["Anime", "Name"],
      key: "name",
      sorter: true,
    },
    {
      title: "季度",
      dataIndex: ["Anime", "Season"],
      key: "season",
    },
    {
      title: "分类",
      dataIndex: "Category",
      key: "category",
      filters: FollowCategory.getAllValues().map((category) => ({
        text: FollowCategory.getStringMapping()[FollowCategory[category]],
        value: category,
      })),
      filterMultiple: false,
      onFilter: (value: any, record: FollowAnime) => record.Category === value,
      render: (category: FollowCategory) =>
        FollowCategory.getStringMapping()[FollowCategory[category]],
    },
    {
      title: "状态",
      dataIndex: "Status",
      key: "status",
      filters: FollowStatus.getAllValues().map((status) => ({
        text: FollowStatus.getStringMapping()[FollowStatus[status]],
        value: status,
      })),
      filterMultiple: false,
      onFilter: (value: any, record: FollowAnime) => record.Status === value,
      render: (status: FollowStatus) =>
        FollowStatus.getStringMapping()[FollowStatus[status]],
    },
    {
      title: "看完时间",
      dataIndex: "FinishedAt",
      key: "finishedAt",
      render: (date: string) => (date ? formatDate(date) : ""),
    },
    {
      title: "创建时间",
      dataIndex: "CreatedAt",
      key: "createdAt",
      render: (date: string) => (date ? formatDate(date) : ""),
    },
    {
      title: "操作",
      key: "action",
      render: (text: any, record: FollowAnime) => (
        <span>
          <EditOutlined
            onClick={() => handleEditFollow(record)}
            style={{ marginRight: 16 }}
          />
          <DeleteOutlined onClick={() => handleDeleteFollow(record.ID)} />
        </span>
      ),
    },
  ];

  return (
    <div>
      <Search
        placeholder="搜索番剧名称"
        onSearch={handleSearch}
        allowClear={true}
        style={{ marginBottom: 16 }}
      />
      <Table
        dataSource={allFollows}
        columns={columns}
        rowKey="ID"
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default EditFollowTable;
