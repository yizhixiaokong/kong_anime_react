export const fetchPing = async () => {
  const response = await fetch('http://localhost:8080/api/v1/ping');
  if (!response.ok) {
    throw new Error('Error fetching time');
  }
  const data = await response.json();
  return data.time;
};

export const fetchMessage = async () => {
  const response = await fetch('http://localhost:8080/api/v1/hello');
  if (!response.ok) {
    throw new Error('Error fetching message');
  }
  const data = await response.json();
  return data.msg;
};

export const fetchAnimes = async (page = '1', pageSize = '10') => {
  const response = await fetch(`http://localhost:8080/api/v1/animes?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) {
    throw new Error('Error fetching animes');
  }
  const data = await response.json();
  return data;
};
