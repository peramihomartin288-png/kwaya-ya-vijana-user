export function slugify(text) {
  return (text || '').toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const DAY_NAMES = ['jumapili', 'jumatatu', 'jumanne', 'jumatano', 'alhamisi', 'ijumaa', 'jumamosi'];

export function formatDateSlug(date) {
  if (!date) return '';
  const d = new Date(date);
  const siku = DAY_NAMES[d.getDay()];
  const tarehe = d.toISOString().split('T')[0];
  return `${siku}-${tarehe}`;
}

export function getShareUrl(type, item) {
  const BASE = window.location.origin;
  const jina = slugify(item.jina || item.head || item.dominika || '');
  const tarehe = item.tarehe ? item.tarehe.split('T')[0] : '';

  switch (type) {
    case 'post': return `${BASE}/home`; // Post inaelekeza Home
    case 'mtakatifu': return `${BASE}/mtakatifu/${jina}/${tarehe}`;
    case 'masomo': return `${BASE}/masomo-ya-dominika/${jina}/${tarehe}`;
    case 'wimbo': return `${BASE}/wimbo/${jina}`;
    case 'tafakari': return `${BASE}/tafakari/${jina}/${tarehe}`;
    case 'live': return `${BASE}/live/${jina}/${tarehe}`;
    case 'fake-live': return `${BASE}/fake-live/${jina}/${item.saa || ''}`;
    case 'sala': return `${BASE}/sala/${jina}`;
    default: return BASE;
  }
}

export async function shareContent(type, item) {
  const url = getShareUrl(type, item);
  let title = 'KMCA';
  let text = '';

  switch (type) {
    case 'wimbo': title = 'Wimbo wa Leo'; text = item.jina || ''; break;
    case 'mtakatifu': title = 'Mtakatifu wa Leo'; text = item.jina || ''; break;
    case 'tafakari': title = 'Tafakari ya Leo'; text = item.jina || ''; break;
    case 'masomo': title = 'Masomo ya Dominika'; text = `${item.dominika} - ${item.juma}`; break;
    case 'live': title = 'Live'; text = item.head || ''; break;
    case 'fake-live': title = 'Sala Maalumu'; text = item.head || ''; break;
    case 'sala': title = 'Sala'; text = item.jina || ''; break;
    default: title = item.head || item.jina || 'KMCA'; text = item.description || item.maelezo || '';
  }

  if (navigator.share) {
    try { 
      await navigator.share({ title, text, url }); 
    } catch (e) { 
      if (e.name !== 'AbortError') console.error(e); 
    }
  } else {
    const shareText = `${title}\n${text}\n${url}`;
    try { 
      await navigator.clipboard.writeText(shareText); 
      alert('Imenakiliwa ✅\n\n' + shareText); 
    } catch { 
      prompt('Nakili:', shareText); 
    }
  }
}
