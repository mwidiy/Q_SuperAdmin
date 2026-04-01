import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Parallel DB queries
  const [
    totalStores,
    totalOrders,
    totalRevenue,
    activeGateways
  ] = await Promise.all([
    prisma.store.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: {
        paymentStatus: 'Paid'
      },
      _sum: {
        totalAmount: true
      }
    }),
    prisma.systemConfig.findUnique({
      where: { key: 'GLOBAL_PAYMENT_GATEWAY' }
    })
  ]);

  const stats = [
    { label: 'Total Tenants/Stores', value: totalStores, color: '#3B82F6' },
    { label: 'Total Orders', value: totalOrders, color: '#10B981' },
    { label: 'Gross Merchandise Value (GMV)', value: `Rp ${(totalRevenue._sum.totalAmount || 0).toLocaleString('id-ID')}`, color: '#8B5CF6' },
    { label: 'Active Payment Gateway', value: (activeGateways?.value || 'homemade').toUpperCase(), color: '#F59E0B' }
  ];

  return (
    <div>
      <h1 style={{ color: '#1E293B', marginBottom: '8px' }}>Analytics Overview</h1>
      <p style={{ color: '#64748B', marginBottom: '32px' }}>Real-time statistics from all Kasir clients.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ 
            backgroundColor: '#FFF', 
            padding: '24px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            borderLeft: `4px solid ${stat.color}`
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#64748B', marginBottom: '8px', marginTop: 0 }}>
              {stat.label}
            </h3>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A', margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '18px', color: '#1E293B', marginBottom: '16px', marginTop: 0 }}>Quick Actions</h2>
        <p style={{ color: '#64748B' }}>Head to <strong>Settings (Gateway)</strong> to switch payment processors globally for all Kasirs.</p>
      </div>
    </div>
  );
}
