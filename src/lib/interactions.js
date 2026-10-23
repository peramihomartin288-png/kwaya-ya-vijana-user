import { supabase } from './supabase';

export function getVisitorId() {
  let id = localStorage.getItem('kmca_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('kmca_visitor_id', id);
  }
  return id;
}

// LIKE
export async function toggleLike(tableName, contentId, visitorId) {
  const { data } = await supabase
    .from('content_likes')
    .select('id')
    .eq('content_id', contentId)
    .eq('visitor_id', visitorId)
    .maybeSingle();

  if (data) {
    // Ime-like, futa (Unlike)
    await supabase.from('content_likes').delete().eq('id', data.id);
    return false;
  } else {
    // Haijalike, ongeza
    await supabase.from('content_likes').insert({ content_id: contentId, visitor_id: visitorId });
    return true;
  }
}

export async function getLikeCount(contentId) {
  const { count } = await supabase
    .from('content_likes')
    .select('*', { count: 'exact', head: true })
    .eq('content_id', contentId);
  return count || 0;
}

// COMMENT
export async function addComment(tableName, contentId, visitorId, jina, maoni) {
  const { error } = await supabase.from('comments').insert({
    content_table: tableName,
    content_id: contentId,
    visitor_id: visitorId,
    jina: jina || null,
    maoni: maoni,
    published: true
  });
  return error;
}

export async function getComments(tableName, contentId) {
  const { data } = await supabase
    .from('comments')
    .select('*')
    .eq('content_table', tableName)
    .eq('content_id', contentId)
    .eq('published', true)
    .order('created_at', { ascending: false });
  return data || [];
}
