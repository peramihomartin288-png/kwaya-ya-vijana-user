export default function MediaPlayer({ url, title }) {
  if (!url) return null;

  // 1. YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/live/')[1]?.split('?')[0] || url.split('/').pop();
    return (
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8, marginBottom: 16 }}>
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}`} 
          title={title || 'YouTube'} 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        ></iframe>
      </div>
    );
  }

  // 2. Facebook
  if (url.includes('facebook.com')) {
    return (
      <div style={{ marginBottom: 16 }}>
        <iframe 
          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`}
          width="100%" 
          height="250" 
          style={{ border: 'none', overflow: 'hidden', borderRadius: 8 }} 
          scrolling="no" 
          frameBorder="0" 
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // 3. Instagram
  if (url.includes('instagram.com')) {
    return (
      <div style={{ marginBottom: 16 }}>
        <iframe 
          src={`${url.split('?')[0]}embed`}
          width="100%" 
          height="400" 
          style={{ border: 'none', overflow: 'hidden', borderRadius: 8 }} 
          scrolling="no" 
          frameBorder="0" 
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // 4. Direct Video (mp4, webm)
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return (
      <video controls src={url} style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} />
    );
  }

  // 5. Direct Audio (mp3, wav)
  if (url.match(/\.(mp3|wav|ogg)$/i)) {
    return (
      <audio controls src={url} style={{ width: '100%', marginBottom: 16 }} />
    );
  }

  // 6. Website nyingine (Kitufe cha kufungua)
  return (
    <div style={{ marginBottom: 16, padding: 16, background: 'var(--color-card)', borderRadius: 8, textAlign: 'center' }}>
      <p style={{ fontSize: '0.9rem', marginBottom: 8 }}>Media hii inatoka kwenye mtandao mwingine.</p>
      <a href={url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', background: 'var(--color-primary)', color: 'white', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold' }}>
        🔗 Fungua Link
      </a>
    </div>
  );
}
