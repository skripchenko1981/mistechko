const API_URL = process.env.REACT_APP_BACKEND_URL || '';

export async function uploadFile(file, token) {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_URL}/api/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || 'Не вдалося завантажити файл.');
  }
  return data;
}
