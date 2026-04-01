"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Clear cookie dummy by relying on simple API logic or just resetting
    document.cookie = "super_admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/');
  };

  const navItems = [
    { name: 'Analytics', href: '/dashboard' },
    { name: 'Settings (Gateway)', href: '/dashboard/settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#1E293B', color: '#FFF', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #334155' }}>
          God&apos;s Eye
        </div>
        <nav style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} style={{
                padding: '12px 16px',
                borderRadius: '8px',
                color: isActive ? '#FFF' : '#94A3B8',
                backgroundColor: isActive ? '#334155' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.2s'
              }}>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid #334155' }}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px', background: 'transparent', color: '#F87171',
              border: '1px solid #F87171', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ backgroundColor: '#FFF', padding: '20px 32px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#0F172A', fontSize: '18px' }}>Super Admin Panel</h2>
        </header>
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
