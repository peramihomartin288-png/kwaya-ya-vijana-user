export function isRead(type, id) {
  const today = new Date().toISOString().split('T')[0];
  const key = `kmca_read_${today}_${type}_${id}`;
  return localStorage.getItem(key) === 'true';
}

export function markAsRead(type, id) {
  const today = new Date().toISOString().split('T')[0];
  const key = `kmca_read_${today}_${type}_${id}`;
  localStorage.setItem(key, 'true');
}
