import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Kazi ya kupata visitor_id (kama tulivyojadili)
function getVisitorId() {
  let id = localStorage.getItem('kmca_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('kmca_visitor_id', id);
  }
  return id;
}

export default function PollCard({ poll }) {
  const [options, setOptions] = useState([]);
  const [voted, setVoted] = useState(false);
  const [votesCount, setVotesCount] = useState({});

  useEffect(() => {
    async function loadVotes() {
      // Vuta kura zote za poll hii
      const { data } = await supabase
        .from('poll_votes')
        .select('option_index, voter_id')
        .eq('poll_id', poll.id);

      const counts = {};
      let hasVoted = false;
      const visitorId = getVisitorId();

      (data || []).forEach((v) => {
        counts[v.option_index] = (counts[v.option_index] || 0) + 1;
        if (v.voter_id === visitorId) hasVoted = true;
      });

      setVotesCount(counts);
      setVoted(hasVoted);
      setOptions(poll.options || []);
    }
    loadVotes();
  }, [poll]);

  async function handleVote(index) {
    if (voted) return;
    
    const visitorId = getVisitorId();
    
    // Hifadhi kura kwenye database
    const { error } = await supabase.from('poll_votes').insert({
      poll_id: poll.id,
      option_index: index,
      voter_id: visitorId
    });

    if (!error) {
      // Ongeza kwenye hesabu za papo hapo
      const newCounts = { ...votesCount };
      newCounts[index] = (newCounts[index] || 0) + 1;
      setVotesCount(newCounts);
      setVoted(true);
    } else {
      alert('Kosa la kupiga kura: ' + error.message);
    }
  }

  if (!options || options.length === 0) return null;

  const totalVotes = Object.values(votesCount).reduce((a, b) => a + b, 0);

  return (
    <div style={{ background: 'var(--color-card)', marginBottom: 16, borderRadius: 'var(--radius-md)', padding: 16, border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <img src="/icons/icon.svg" alt="KMCA" style={{ width: 32, height: 32 }} />
        <span style={{ fontWeight: 700 }}>KMCA</span>
      </div>
      
      {poll.picha && <img src={poll.picha} alt={poll.swali} style={{ width: '100%', borderRadius: 8, marginBottom: 12 }} />}
      
      <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{poll.swali}</h3>
      {poll.maelezo && <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>{poll.maelezo}</p>}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map((opt, i) => {
          const count = votesCount[i] || 0;
          const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
          
          return (
            <button key={i} onClick={() => handleVote(i)} style={{
              background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: 12, borderRadius: 'var(--radius-sm)',
              textAlign: 'left', cursor: voted ? 'default' : 'pointer', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${percentage}%`, background: 'var(--color-primary)', opacity: 0.3 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                <span>{opt.text || opt}</span>
                {voted && <span>{percentage.toFixed(0)}% ({count})</span>}
              </div>
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 8 }}>Jumla ya kura: {totalVotes}</p>
    </div>
  );
}
