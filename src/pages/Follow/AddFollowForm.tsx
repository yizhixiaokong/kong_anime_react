import React, { useState } from "react";
import { Form, Button, Select, message } from "antd";
import { fetchAnimesByName, createFollow } from "@/api/api";
import { FollowCategory, FollowStatus } from "@/api/followEnums";

interface AddFollowFormProps {
  onClose: () => void;
}

const { Option } = Select;

const AddFollowForm: React.FC<AddFollowFormProps> = ({ onClose }) => {
  const [animeOptions, setAnimeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedAnime, setSelectedAnime] = useState<string>();

  const handleSearch = async (value: string) => {
    if (value) {
      const data = await fetchAnimesByName("1", "10", value);
      const options = data.animes.map((anime: any) => ({
        value: anime.ID,
        label: anime.Name,
      }));
      setAnimeOptions(options);
    } else {
      setAnimeOptions([]);
    }
  };

  const handleChange = (value: string) => {
    setSelectedAnime(value);
  };

  const onFinish = async (values: any) => {
    const followData = {
      category: values.category as FollowCategory,
      animeID: selectedAnime,
      state: FollowStatus.WantToWatch, // 默认状态为FollowStatus.WantToWatch
    };
    try {
      await createFollow(followData);
      message.success("新增追番成功");
      onClose();
    } catch (error) {
      message.error("新增追番失败");
      console.error("Error creating follow:", error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="addFollow"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="番剧名称"
        name="animeName"
        rules={[{ required: true, message: "请输入番剧名称!" }]}
      >
        <Select
          showSearch
          value={selectedAnime}
          placeholder="输入番剧名称"
          style={{ width: "100%" }}
          defaultActiveFirstOption={false}
          filterOption={false}
          onSearch={handleSearch}
          onChange={handleChange}
          notFoundContent={null}
          options={animeOptions}
        />
      </Form.Item>

      <Form.Item
        label="分类"
        name="category"
        rules={[{ required: true, message: "请选择分类!" }]}
      >
        <Select>
          <Option value={FollowCategory.Classic}>经典</Option>
          <Option value={FollowCategory.HighQuality}>高质量</Option>
          <Option value={FollowCategory.New}>新番</Option>
          <Option value={FollowCategory.ToiletPaper}>厕纸</Option>
          <Option value={FollowCategory.Masterpiece}>神作</Option>
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddFollowForm;
