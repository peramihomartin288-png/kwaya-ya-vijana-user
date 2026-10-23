export function getBookmarks() {
  const data = localStorage.getItem('kmca_bookmarks');
  return data ? JSON.parse(data) : [];
}

export function toggleBookmark(type, id, data) {
  const bookmarks = getBookmarks();
  const index = bookmarks.findIndex((b) => b.id === id && b.type === type);

  if (index > -1) {
    bookmarks.splice(index, 1); // Ondoa kama ipo
    localStorage.setItem('kmca_bookmarks', JSON.stringify(bookmarks));
    return false;
  } else {
    bookmarks.push({ type, id, data }); // Ongeza kama haipo
    localStorage.setItem('kmca_bookmarks', JSON.stringify(bookmarks));
    return true;
  }
}

export function isBookmarked(type, id) {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.id === id && b.type === type);
}
