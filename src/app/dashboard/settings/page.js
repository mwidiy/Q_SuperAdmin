import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const config = await prisma.systemConfig.findUnique({
    where: { key: 'GLOBAL_PAYMENT_GATEWAY' }
  });

  const activeGateway = config?.value || 'homemade';

  async function updateGateway(formData) {
    'use server';
    const newGateway = formData.get('gateway');
    
    // Server validation
    if (!['homemade', 'midtrans'].includes(newGateway)) return;

    await prisma.systemConfig.upsert({
      where: { key: 'GLOBAL_PAYMENT_GATEWAY' },
      update: { value: newGateway },
      create: { key: 'GLOBAL_PAYMENT_GATEWAY', value: newGateway }
    });

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard');
  }

  return (
    <div>
      <h1 style={{ color: '#1E293B', marginBottom: '8px' }}>Global Settings</h1>
      <p style={{ color: '#64748B', marginBottom: '32px' }}>Control core infrastructure behavior for all tenants.</p>

      <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '18px', color: '#0F172A', marginTop: 0, marginBottom: '8px' }}>Payment Gateway Engine</h2>
        <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>
          Tentukan gerbang pembayaran mana yang akan dirender di seluruh PWA Kasir (Android/Web).
          Perubahan ini sinkron real-time untuk tenant.
        </p>

        <form action={updateGateway} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <label style={{ 
              flex: 1, cursor: 'pointer', padding: '16px', border: activeGateway === 'homemade' ? '2px solid #3B82F6' : '1px solid #CBD5E1', 
              borderRadius: '12px', background: activeGateway === 'homemade' ? '#EFF6FF' : '#FFF', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s'
            }}>
              <input type="radio" name="gateway" value="homemade" defaultChecked={activeGateway === 'homemade'} style={{ transform: 'scale(1.2)' }} />
              <div>
                <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '15px' }}>Server Lokal (Homemade)</div>
                <div style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>Gunakan Engine QR Pribadi tanpa potongan MDR.</div>
              </div>
            </label>

            <label style={{ 
              flex: 1, cursor: 'pointer', padding: '16px', border: activeGateway === 'midtrans' ? '2px solid #3B82F6' : '1px solid #CBD5E1', 
              borderRadius: '12px', background: activeGateway === 'midtrans' ? '#EFF6FF' : '#FFF', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s'
            }}>
              <input type="radio" name="gateway" value="midtrans" defaultChecked={activeGateway === 'midtrans'} style={{ transform: 'scale(1.2)' }} />
              <div>
                <div style={{ fontWeight: '600', color: '#1E293B', fontSize: '15px' }}>Midtrans Snap</div>
                <div style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>Gunakan Popup UI Resmi dari Midtrans Gateway.</div>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
            <button type="submit" style={{ 
              background: '#0F172A', color: '#FFF', padding: '12px 24px', border: 'none', 
              borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
              Simpan Konfigurasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
