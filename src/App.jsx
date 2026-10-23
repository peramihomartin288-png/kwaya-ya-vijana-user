import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Intro from './pages/Intro';
import Home from './pages/Home';
import Matukio from './pages/Matukio';
import MatukioDetail from './pages/details/MatukioDetail';
import Sala from './pages/Sala';
import RozariView from './pages/RozariView';
import RozariAina from './pages/RozariAina';
import History from './pages/History';
import Settings from './pages/Settings';
import About from './pages/About';
import Feedback from './pages/Feedback';
import InstallApp from './pages/InstallApp';
import Notifications from './pages/Notifications';
import MasomoYote from './pages/MasomoYote';
import WatakatifuWote from './pages/WatakatifuWote';
import SalaView from './pages/SalaView';

import WimboDetail from './pages/details/WimboDetail';
import MtakatifuDetail from './pages/details/MtakatifuDetail';
import MasomoDetail from './pages/details/MasomoDetail';
import TafakariDetail from './pages/details/TafakariDetail';
import LiveDetail from './pages/details/LiveDetail';
import FakeLiveDetail from './pages/details/FakeLiveDetail';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    // Kama ni PWA, ruka Intro na nenda Home
    if (isPWA) {
      if (window.location.pathname === '/' || window.location.pathname === '/intro') {
        navigate('/home', { replace: true });
      }
    } 
    // Kama ni Website (Browser), na yupo kwenye '/' mpeleke Intro
    else {
      if (window.location.pathname === '/') {
        navigate('/intro', { replace: true });
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/intro" element={<Intro />} />
      <Route path="/home" element={<Home />} />
      <Route path="/app" element={<InstallApp />} />
      
            <Route path="/mtakatifu/:jina/:tarehe" element={<MtakatifuDetail />} />
      <Route path="/masomo-ya-dominika/:jina/:tarehe" element={<MasomoDetail />} />
      <Route path="/wimbo/:jina/:tarehe" element={<WimboDetail />} />
      <Route path="/tafakari/:jina/:tarehe" element={<TafakariDetail />} />
      <Route path="/live/:jina/:tarehe" element={<LiveDetail />} />
      <Route path="/fake-live/:jina/:saa" element={<FakeLiveDetail />} />
      <Route path="/sala/:jina" element={<SalaView />} />

      <Route path="/masomo-yote" element={<MasomoYote />} />
      <Route path="/matukio" element={<Matukio />} />
      <Route path="/matukio/:jina" element={<MatukioDetail />} />
      <Route path="/sala" element={<Sala />} />
      <Route path="/rozari/:rozari_jina" element={<RozariAina />} />
      <Route path="/rozari/:rozari_jina" element={<RozariAina />} />
      <Route path="/rozari/:rozari_jina/:sehemu/:aina" element={<RozariView />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/about" element={<About />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/install" element={<InstallApp />} />
      <Route path="/notifications" element={<Notifications />} />
      
      <Route path="/watakatifu-wote" element={<WatakatifuWote />} />

      <Route path="*" element={
        <div style={{ padding: 20, textAlign: 'center', marginTop: 50 }}>
          <h2>404 - Ukurasa Haupo</h2>
          <p>URL uliyoingia haipo kwenye mfumo.</p>
        </div>
      } />
    </Routes>
  );
}
