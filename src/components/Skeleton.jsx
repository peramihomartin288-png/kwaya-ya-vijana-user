export function SkeletonCard() {
  return (
    <div style={{ background: 'var(--color-card)', marginBottom: 16, borderRadius: 'var(--radius-md)', padding: 16, border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-border)' }} />
        <div style={{ width: 80, height: 16, borderRadius: 4, background: 'var(--color-border)' }} />
      </div>
      <div style={{ width: '70%', height: 20, borderRadius: 4, background: 'var(--color-border)', marginBottom: 8 }} />
      <div style={{ width: '100%', height: 14, borderRadius: 4, background: 'var(--color-border)', marginBottom: 4 }} />
      <div style={{ width: '90%', height: 14, borderRadius: 4, background: 'var(--color-border)', marginBottom: 16 }} />
      <div style={{ width: '100%', height: 200, borderRadius: 8, background: 'var(--color-border)' }} />
    </div>
  );
}

export function SkeletonText() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ width: '60%', height: 24, borderRadius: 4, background: 'var(--color-border)', marginBottom: 16 }} />
      <div style={{ width: '40%', height: 16, borderRadius: 4, background: 'var(--color-border)', marginBottom: 24 }} />
      <div style={{ width: '100%', height: 14, borderRadius: 4, background: 'var(--color-border)', marginBottom: 8 }} />
      <div style={{ width: '95%', height: 14, borderRadius: 4, background: 'var(--color-border)', marginBottom: 8 }} />
      <div style={{ width: '90%', height: 14, borderRadius: 4, background: 'var(--color-border)', marginBottom: 8 }} />
      <div style={{ width: '80%', height: 14, borderRadius: 4, background: 'var(--color-border)', marginBottom: 8 }} />
    </div>
  );
}

export function SkeletonList() {
  return (
    <div style={{ background: 'var(--color-card)', padding: 12, borderRadius: 'var(--radius-md)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--color-border)' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-border)', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: '60%', height: 16, borderRadius: 4, background: 'var(--color-border)', marginBottom: 8 }} />
        <div style={{ width: '40%', height: 12, borderRadius: 4, background: 'var(--color-border)' }} />
      </div>
    </div>
  );
}
