import React from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  MessageSquare,
  BarChart3,
  MapPin,
  LogOut,
  User
} from "lucide-react";
import logoImg from "../../assets/logo.jpg";

const AdminSidebar = ({ selected, setSelected, adminName, adminEmail }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'complaints', label: 'All Complaints', icon: MessageSquare },
    { id: 'officer', label: 'Create Officer', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'feedback', label: 'Feedback', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'logout', label: 'Logout', icon: LogOut, color: 'error' },
  ];

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: '256px',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid var(--border)',
        color: 'var(--text-primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoImg} alt="CivicPulse Hub Logo" style={{ width: '40px', height: '40px' }} />
          <div>
            <h1 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>CivicPulse Hub</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = selected === item.label;

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.id === "logout") {
                      localStorage.removeItem("token");
                      window.location.href = "/";
                    } else {
                      setSelected(item.label);
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    color: isActive ? 'white' : item.color === 'error' ? '#dc2626' : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive && item.color !== 'error') {
                      e.target.style.backgroundColor = 'var(--border-soft)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive && item.color !== 'error') {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon style={{ width: '20px', height: '20px' }} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-strong))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>AD</span>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{adminName || 'Admin User'}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{adminEmail || 'admin@civicpulse.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
