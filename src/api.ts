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
