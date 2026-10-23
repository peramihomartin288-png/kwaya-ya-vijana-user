import { supabase } from './supabase';

// Pata au unda visitor_id (mara moja tu kwa kifaa)
export function getVisitorId() {
  let id = localStorage.getItem('kmca_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('kmca_visitor_id', id);
  }
  return id;
}

// Rekodi kuingia (entered_at)
export async function trackVisit() {
  const visitorId = getVisitorId();
  
  // Angalia kama kuna visit ya leo ambayo haijafungwa (left_at ni null)
  const { data: existing } = await supabase
    .from('visits')
    .select('id')
    .eq('visitor_id', visitorId)
    .eq('date', new Date().toISOString().split('T')[0])
    .is('left_at', null)
    .maybeSingle();

  if (!existing) {
    // Kama hakuna, unda mpya
    await supabase.from('visits').insert({
      visitor_id: visitorId,
      date: new Date().toISOString().split('T')[0],
      entered_at: new Date().toISOString()
    });
  }
}

// Rekodi kutoka (left_at)
export async function trackLeave() {
  const visitorId = getVisitorId();
  const today = new Date().toISOString().split('T')[0];

  // Tafuta visit ya leo ambayo haijafungwa
  const { data: existing } = await supabase
    .from('visits')
    .select('id')
    .eq('visitor_id', visitorId)
    .eq('date', today)
    .is('left_at', null)
    .maybeSingle();

  if (existing) {
    await supabase.from('visits').update({
      left_at: new Date().toISOString()
    }).eq('id', existing.id);
  }
}

// Rekodi tukio la mtumiaji
export async function track(type, id) {
  const visitorId = getVisitorId();
  await supabase.from('user_activity').insert({
    visitor_id: visitorId,
    activity_type: type,
    content_id: id
  });
}
