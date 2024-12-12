import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { fetchFollows } from "@/api/api";
import { FollowCategory, FollowStatus } from "@/api/followEnums";

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
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const loadAllFollows = async (page: number, pageSize: number) => {
    try {
      const data = await fetchFollows(page.toString(), pageSize.toString());
      setAllFollows(data.data);
      setPagination({ current: page, pageSize, total: data.total });
    } catch (error) {
      console.error("Error fetching all follows:", error);
    }
  };

  useEffect(() => {
    loadAllFollows(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (pagination: any) => {
    loadAllFollows(pagination.current, pagination.pageSize);
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

  const columns = [
    {
      title: '番剧名称',
      dataIndex: ['Anime', 'Name'],
      key: 'name',
    },
    {
      title: '季度',
      dataIndex: ['Anime', 'Season'],
      key: 'season',
    },
    {
      title: '分类',
      dataIndex: 'Category',
      key: 'category',
      render: (category: FollowCategory) => FollowCategory.getStringMapping()[FollowCategory[category]],
    },
    {
      title: '状态',
      dataIndex: 'Status',
      key: 'status',
      render: (status: FollowStatus) => FollowStatus.getStringMapping()[FollowStatus[status]],
    },
    {
      title: '完成时间',
      dataIndex: 'FinishedAt',
      key: 'finishedAt',
      render: (date: string) => date ? formatDate(date) : '',
    },
  ];

  return (
    <Table
      dataSource={allFollows}
      columns={columns}
      rowKey="ID"
      pagination={pagination}
      onChange={handleTableChange}
    />
  );
};

export default EditFollowTable;
