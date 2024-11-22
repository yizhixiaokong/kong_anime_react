const BASE_URL = "http://localhost:8080/api/v1";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};

export const fetchPing = async () => {
  const response = await fetch(`${BASE_URL}/ping`);
  const data = await handleResponse(response);
  return data.time;
};

export const fetchMessage = async () => {
  const response = await fetch(`${BASE_URL}/hello`);
  const data = await handleResponse(response);
  return data.msg;
};

export const fetchAnimes = async (page = "1", pageSize = "10") => {
  const response = await fetch(`${BASE_URL}/animes?page=${page}&pageSize=${pageSize}`);
  return handleResponse(response);
};

export const updateAnime = async (id: string, anime: any) => {
  const response = await fetch(`${BASE_URL}/animes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(anime),
  });
  return handleResponse(response);
};

export const createAnime = async (anime: any) => {
  const response = await fetch(`${BASE_URL}/animes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(anime),
  });
  return handleResponse(response);
};

export const deleteAnime = async (id: string) => {
  const response = await fetch(`${BASE_URL}/animes/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories`);
  return handleResponse(response);
};

export const createCategory = async (category: any) => {
  const response = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  return handleResponse(response);
};

export const updateCategory = async (id: string, category: any) => {
  const response = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  return handleResponse(response);
};

export const deleteCategory = async (id: string) => {
  const response = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export const searchCategories = async (name: string) => {
  const response = await fetch(`${BASE_URL}/categories/search?name=${name}`);
  return handleResponse(response);
};

export const fetchTags = async () => {
  const response = await fetch(`${BASE_URL}/tags`);
  return handleResponse(response);
};

export const createTag = async (tag: any) => {
  const response = await fetch(`${BASE_URL}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tag),
  });
  return handleResponse(response);
};

export const updateTag = async (id: string, tag: any) => {
  const response = await fetch(`${BASE_URL}/tags/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tag),
  });
  return handleResponse(response);
};

export const deleteTag = async (id: string) => {
  const response = await fetch(`${BASE_URL}/tags/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export const searchTags = async (name: string) => {
  const response = await fetch(`${BASE_URL}/tags/search?name=${name}`);
  return handleResponse(response);
};

export interface Tag {
  ID: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}
