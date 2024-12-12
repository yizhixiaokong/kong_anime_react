import { get, post, put, del, patch } from "@/utils/request";
import { FollowCategory, FollowStatus } from "@/api/followEnums";
const BASE_URL = "http://localhost:8080/api/v1";

// test api
export const fetchPing = () => get(`/ping`);

export const fetchHello = () => get(`/hello`);

// anime api
export const fetchAnimes = (page = "1", pageSize = "10") =>
  get(`/animes?page=${page}&pageSize=${pageSize}`);

export const updateAnime = (id: string, data: any) =>
  put(`/animes/${id}`, data);

export const createAnime = (anime: any) => post(`/animes`, anime);

export const deleteAnime = (id: string) => del(`/animes/${id}`);

export const fetchAnimeSeasons = () => get(`/animes/seasons`);

export const fetchAnimesBySeason = (
  page = "1",
  pageSize = "10",
  season?: string
) => {
  const url = new URL(`${BASE_URL}/animes/season`);
  url.searchParams.append("page", page);
  url.searchParams.append("pageSize", pageSize);
  if (season) {
    url.searchParams.append("season", season);
  }
  return get(url.toString());
};

export const fetchAnimesByCategory = (
  page = "1",
  pageSize = "10",
  category?: string
) => {
  const url = new URL(`${BASE_URL}/animes/category`);
  url.searchParams.append("page", page);
  url.searchParams.append("pageSize", pageSize);
  if (category) {
    url.searchParams.append("category", category.toString());
  }
  return get(url.toString());
};

export const fetchAnimesByTag = (page = "1", pageSize = "10", tag?: string) => {
  const url = new URL(`${BASE_URL}/animes/tag`);
  url.searchParams.append("page", page);
  url.searchParams.append("pageSize", pageSize);
  if (tag) {
    url.searchParams.append("tag", tag);
  }
  return get(url.toString());
};

export const fetchAnimesByName = (
  page = "1",
  pageSize = "10",
  name: string
) => {
  const url = new URL(`${BASE_URL}/animes/search`);
  url.searchParams.append("page", page);
  url.searchParams.append("pageSize", pageSize);
  if (name) {
    url.searchParams.append("name", name);
  }
  return get(url.toString());
};

// category api
export const fetchCategories = () => get(`/categories`);

export const createCategory = (category: any) => post(`/categories`, category);

export const updateCategory = (id: string, category: any) =>
  put(`/categories/${id}`, category);

export const deleteCategory = (id: string) => del(`/categories/${id}`);

export const searchCategories = (name: string) =>
  get(`/categories/search?name=${name}`);

export const fetchCategoryStats = () => get(`/categories/stats`);

// tag api
export const fetchTags = () => get(`/tags`);

export const createTag = (tag: any) => post(`/tags`, tag);

export const updateTag = (id: string, tag: any) => put(`/tags/${id}`, tag);

export const deleteTag = (id: string) => del(`/tags/${id}`);

export const searchTags = (name: string) => get(`/tags/search?name=${name}`);

export const fetchTagStats = () => get(`/tags/stats`);

// follow api
export const fetchFollowedCategories = () => get(`/follows/categories`);

export const createFollow = (follow: any) => post(`/follows`, follow);

export const deleteFollow = (id: string) => del(`/follows/${id}`);

export const updateFollow = (id: string, follow: any) =>
  put(`/follows/${id}`, follow);

export const fetchFollow = (id: string) => get(`/follows/${id}`);

export const updateFollowStatus = (id: string, status: any) =>
  patch(`/follows/${id}/status`, status);

export const fetchFollows = (
  page = "1",
  pageSize = "10",
  category?: FollowCategory,
  status?: FollowStatus
) => {
  const url = new URL(`${BASE_URL}/follows`);
  url.searchParams.append("page", page);
  url.searchParams.append("pageSize", pageSize);
  if (category||category===0) {
    url.searchParams.append("category", category.toString());
  }
  if (status) {
    url.searchParams.append("status", status.toString());
  }
  return get(url.toString());
};
