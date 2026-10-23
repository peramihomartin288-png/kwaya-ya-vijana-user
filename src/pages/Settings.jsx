import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [version, setVersion] = useState('1.0.1');
  const websiteUrl = window.location.origin;
  const appUrl = `${window.location.origin}/app`;
  

  useEffect(() => {
    // Angalia theme iliyopo
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setDarkMode(currentTheme === 'dark');

    // Vuta toleo la App
    supabase.from('pwa_version').select('version').order('released_at', { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => { if (data) setVersion(data.version); });
  }, []);

  function toggleTheme() {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('kmca_theme', newMode ? 'dark' : 'light');
  }

  async function requestNotification() {
    if (typeof Notification !== 'undefined') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') alert('Arifa zimeruhusiwa! ✅');
      else alert('Arifa zimezuiwa. Unaweza kuziruhusu kwenye settings za browser.');
    }
  }

  function handleInstall() {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then(() => { window.deferredPrompt = null; });
    } else {
      alert('Bonyeza mistari mitatu (⋮) kisha chagua "Install app" au "Add to Home Screen".');
    }
  }

  function shareUrl(url) {
    if (navigator.share) {
      navigator.share({ title: 'KMCA', url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('Link imenakiliwa! ✅');
    }
  }

  

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Settings" />

      <div style={{ padding: '16px' }}>
        
        {/* Dark Mode */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>🌙 Dark Mode</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{darkMode ? 'Imewashwa' : 'Imezimwa'}</p>
          </div>
          <button onClick={toggleTheme} style={{ background: darkMode ? 'var(--color-primary)' : '#ccc', width: 48, height: 24, borderRadius: 12, border: 'none', position: 'relative', cursor: 'pointer' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: darkMode ? 26 : 2, transition: 'left 0.2s' }} />
          </button>
        </div>

        {/* Taarifa & App */}
        <div style={{ padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>TAARIFA & APP</h2>
          
          <div onClick={requestNotification} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', cursor: 'pointer' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>🔔 Ruhusu Notifications</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Pata taarifa za haraka</p>
            </div>
            <span style={{ fontSize: '1.2rem' }}>›</span>
          </div>

          <div onClick={handleInstall} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', cursor: 'pointer' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>📱 Saknisha App</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Itumike kama app</p>
            </div>
            <span style={{ fontSize: '1.2rem' }}>›</span>
          </div>
        </div>

        {/* Shiriki */}
        <div style={{ padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>SHIRIKI</h2>
          
          <div onClick={() => shareUrl(websiteUrl)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', cursor: 'pointer' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>🌐 Share Website</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{websiteUrl}</p>
            </div>
            <span style={{ fontSize: '1.2rem' }}>🔗</span>
          </div>

          <div onClick={() => shareUrl(appUrl)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', cursor: 'pointer' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>📲 Share App</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{appUrl}</p>
            </div>
            <span style={{ fontSize: '1.2rem' }}>🔗</span>
          </div>
        </div>

        

        {/* Maoni */}
        <div style={{ padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>MAONI</h2>
          <Link to="/feedback" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', color: 'var(--color-text)' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>📝 Tuma Maoni</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Tusaidie kuboresha App</p>
            </div>
            <span style={{ fontSize: '1.2rem' }}>›</span>
          </Link>
        </div>

        {/* Kuhusu */}
        <div style={{ padding: '16px 0' }}>
          <h2 style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>KUHUSU</h2>
          <Link to="/about" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', color: 'var(--color-text)' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>ℹ️ Kuhusu KMCA</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Kwaya ya Vijana ya Mtakatifu Carlo Acutis</p>
            </div>
            <span style={{ fontSize: '1.2rem' }}>›</span>
          </Link>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 24 }}>Toleo: {version}</p>
      </div>

      <BottomNav />
    </div>
  );
}
