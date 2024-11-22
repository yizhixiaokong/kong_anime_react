import React, { useRef, useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Divider,
  Select,
  Space,
  Tag,
  Tooltip,
  AutoComplete,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { updateAnime, fetchCategories } from "./api";

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

interface EditAnimeFormProps {
  anime: Anime;
  onClose: () => void;
}

const EditAnimeForm: React.FC<EditAnimeFormProps> = ({ anime, onClose }) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState(anime.Tags);
  const [aliases, setAliases] = useState(anime.Aliases);
  const [categories, setCategories] = useState(anime.Categories);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [aliasInputVisible, setAliasInputVisible] = useState(false);
  const [aliasInputValue, setAliasInputValue] = useState("");
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const categoryInputRef = useRef<InputRef>(null);
  const [seasonOptions, setSeasonOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        if (Array.isArray(data.categories)) {
          setAllCategories(data.categories.map((category: any) => category.Name));
        } else {
          console.error("Error: fetchCategories did not return an array");
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const onFinish = async (values: any): Promise<void> => {
    try {
      values.Tags = tags;
      values.Aliases = aliases;
      values.Categories = categories;
      await updateAnime(anime.ID, values);
      onClose();
    } catch (error) {
      console.error("Error updating anime:", error);
      const errorMessage = (error as any).response?.data?.error || (error as any).message || error;
      message.error(`修改失败，请重试: ${errorMessage}`);
    }
  };

  const handleTagChange = (newTags: string[]) => setTags(newTags);
  const handleAliasChange = (newAliases: string[]) => setAliases(newAliases);
  const handleCategoryChange = (newCategories: string[]) =>
    setCategories(newCategories);

  const handleInputConfirm = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    onAdd?: (value: string) => void
  ) => {
    if (value && !tags.includes(value)) {
      setter((prev) => [...prev, value]);
      if (onAdd) {
        onAdd(value);
      }
    }
    setVisible(false);
    setValue("");
  };

  const handleSeasonSearch = (value: string) => {
    if (value) {
      const year = parseInt(value, 10);
      if (!isNaN(year)) {
        setSeasonOptions([
          `${year}-01`,
          `${year}-04`,
          `${year}-07`,
          `${year}-10`,
        ]);
      } else {
        setSeasonOptions([]);
      }
    } else {
      setSeasonOptions([]);
    }
  };

  const renderTags = (
    tags: string[],
    handleClose: (removedTag: string) => void,
    handleEdit: (tag: string, index: number) => void
  ) =>
    tags.map((tag, index) => {
      const isLongTag = tag.length > 20;
      const tagElem = (
        <Tag
          key={tag}
          closable
          onClose={() => handleClose(tag)}
          onDoubleClick={() => {
            const newTag = prompt("修改标签", tag);
            if (newTag) handleEdit(newTag, index);
          }}
        >
          {isLongTag ? `${tag.slice(0, 20)}...` : tag}
        </Tag>
      );
      return isLongTag ? (
        <Tooltip title={tag} key={tag}>
          {tagElem}
        </Tooltip>
      ) : (
        tagElem
      );
    });

  const renderCategories = () => (
    <Form.Item name="Categories" label="分类">
      <Select
        mode="multiple"
        style={{ width: 300 }}
        placeholder="请选择分类"
        value={categories}
        onChange={handleCategoryChange}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: "8px 0" }} />
            <Space style={{ padding: "0 8px 4px" }}>
              <Input
                placeholder="请输入分类"
                ref={categoryInputRef}
                value={categoryInputValue}
                onChange={(e) => setCategoryInputValue(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
              />
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={() =>
                  handleInputConfirm(
                    setCategories,
                    categoryInputValue,
                    () => {},
                    setCategoryInputValue,
                    (newCategory) => setAllCategories((prev) => [...prev, newCategory])
                  )
                }
              >
                添加分类
              </Button>
            </Space>
          </>
        )}
        options={allCategories.map((item) => ({ label: item, value: item }))}
      />
    </Form.Item>
  );

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={anime}
      onFinish={onFinish}
    >
      <Form.Item name="Name" label="名称">
        <Input />
      </Form.Item>
      <Form.Item label="别名">
        {renderTags(
          aliases,
          (removedAlias) =>
            handleAliasChange(
              aliases.filter((alias) => alias !== removedAlias)
            ),
          (alias, index) =>
            handleAliasChange(aliases.map((a, i) => (i === index ? alias : a)))
        )}
        {aliasInputVisible && (
          <Input
            type="text"
            size="small"
            style={{ width: 78 }}
            value={aliasInputValue}
            onChange={(e) => setAliasInputValue(e.target.value)}
            onBlur={() =>
              handleInputConfirm(
                setAliases,
                aliasInputValue,
                setAliasInputVisible,
                setAliasInputValue
              )
            }
            onPressEnter={() =>
              handleInputConfirm(
                setAliases,
                aliasInputValue,
                setAliasInputVisible,
                setAliasInputValue
              )
            }
          />
        )}
        {!aliasInputVisible && (
          <Tag
            onClick={() => setAliasInputVisible(true)}
            style={{ background: "#fff", borderStyle: "dashed" }}
          >
            <PlusOutlined /> 新别名(双击修改)
          </Tag>
        )}
      </Form.Item>
      {renderCategories()}
      <Form.Item name="Production" label="制作公司">
        <Input />
      </Form.Item>
      <Form.Item name="Season" label="季度">
        <AutoComplete
          options={seasonOptions.map(option => ({ value: option }))}
          onSearch={handleSeasonSearch}
          placeholder="输入年份-季度"
        />
      </Form.Item>
      <Form.Item name="Episodes" label="集数">
        <Input />
      </Form.Item>
      <Form.Item name="Image" label="图片链接">
        <Input />
      </Form.Item>
      <Form.Item label="标签">
        {renderTags(
          tags,
          (removedTag) =>
            handleTagChange(tags.filter((tag) => tag !== removedTag)),
          (tag, index) =>
            handleTagChange(tags.map((t, i) => (i === index ? tag : t)))
        )}
        {inputVisible && (
          <Input
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() =>
              handleInputConfirm(
                setTags,
                inputValue,
                setInputVisible,
                setInputValue
              )
            }
            onPressEnter={() =>
              handleInputConfirm(
                setTags,
                inputValue,
                setInputVisible,
                setInputValue
              )
            }
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={() => setInputVisible(true)}
            style={{ background: "#fff", borderStyle: "dashed" }}
          >
            <PlusOutlined /> 新标签(双击修改)
          </Tag>
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditAnimeForm;
