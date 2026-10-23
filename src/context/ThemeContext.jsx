import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [liturgical, setLiturgical] = useState('kijani'); // Default

  useEffect(() => {
    async function loadTheme() {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Vuta rangi ya leo kutoka Supabase
        const { data } = await supabase
          .from('liturgical_colors')
          .select('*')
          .lte('tarehe_kuanza', today)
          .gte('tarehe_kumaliza', today)
          .maybeSingle();

        if (data && data.rangi) {
          setLiturgical(data.rangi.toLowerCase());
          document.documentElement.setAttribute('data-liturgical', data.rangi.toLowerCase());
        } else {
          // Kama hakuna data ya leo, tumia kijani
          document.documentElement.setAttribute('data-liturgical', 'kijani');
        }
      } catch (e) {
        console.error('Theme load error:', e);
      }
    }
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ liturgical }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
