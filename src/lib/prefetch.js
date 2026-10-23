import { supabase } from './supabase';

export async function prefetchHomeData() {
  try {
    // Vuta Daily Cards za leo
    const today = new Date().toISOString().split('T')[0];
    const [watakatifu, masomo, wimbo, tafakari] = await Promise.all([
      supabase.from('watakatifu').select('*').eq('tarehe', today).eq('published', true),
      supabase.from('masomo_dominika').select('*').eq('tarehe', today).eq('published', true),
      supabase.from('wimbo_wa_siku').select('*').eq('tarehe', today).eq('published', true),
      supabase.from('tafakari').select('*').eq('tarehe', today).eq('published', true),
    ]);

    // Hifadhi kwenye localStorage
    localStorage.setItem('kmca_daily_cards', JSON.stringify({
      watakatifu: watakatifu.data || [],
      masomo: masomo.data || [],
      wimbo: wimbo.data || [],
      tafakari: tafakari.data || [],
    }));
  } catch (e) {
    console.error('Prefetch error:', e);
  }
}
