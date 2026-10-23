import { supabase } from './supabase';
import { getVisitorId } from './tracker';

export async function registerPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push haitumiki kwenye browser hii.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
    });

    const visitorId = getVisitorId();

    // Hifadhi kwenye database
    await supabase.from('push_subscriptions').upsert({
      visitor_id: visitorId,
      subscription: subscription.toJSON(),
    }, { onConflict: 'visitor_id' });

    console.log('Push imesajiliwa ✅');
  } catch (error) {
    console.error('Kosa la kusajili push:', error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
