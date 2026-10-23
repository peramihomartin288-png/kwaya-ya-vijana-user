import { useEffect, useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import PermissionSlide from '../components/PermissionSlide';
import StoryBar from '../components/StoryBar';
import ContentCard from '../components/ContentCard';
import LiveCard from '../components/LiveCard';
import FakeLiveCard from '../components/FakeLiveCard';
import PollCard from '../components/PollCard';
import Footer from '../components/Footer';
import { SkeletonCard } from '../components/Skeleton';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  // Data za kila aina
  const [content, setContent] = useState([]);
  const [live, setLive] = useState([]);
  const [fakeLive, setFakeLive] = useState([]);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    async function load() {
      // 1. Vuta Live (zilizo active na published)
      const { data: liveData } = await supabase
        .from('live')
        .select('*')
        .eq('active', true)
        .eq('published', true);
      setLive(liveData || []);

      // 2. Vuta Fake Live (zilizo published)
      const { data: fakeData } = await supabase
        .from('fake_live')
        .select('*')
        .eq('published', true);
      setFakeLive(fakeData || []);

      // 3. Vuta Polls
      const { data: pollData } = await supabase
        .from('polls')
        .select('*');
      setPolls(pollData || []);

      // 4. Vuta Content (Posts)
      const { data: contentData } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });
      setContent(contentData || []);

      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header />
            
      
      <StoryBar />
      
      <div style={{ padding: '16px' }}>
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {/* 1. Live */}
            {live.map((l) => <LiveCard key={l.id} live={l} />)}

            {/* 2. Fake Live */}
            {fakeLive.map((fl) => <FakeLiveCard key={fl.id} fakeLive={fl} />)}

            {/* 3. Polls */}
            {polls.map((p) => <PollCard key={p.id} poll={p} />)}

            {/* 4. Content (Posts) */}
            {content.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Hakuna posts bado</p>
            ) : (
              content.map((c) => <ContentCard key={c.id} content={c} />)
            )}
          </>
        )}
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}
