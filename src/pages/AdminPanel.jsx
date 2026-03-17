import { useState } from 'react';
import {
  LayoutDashboard, FileText, Award, Briefcase, Printer,
  Clock, CheckCircle2, Loader, Search, Filter, Upload,
  User, ChevronDown, ChevronUp, Eye, RefreshCw, Shield,
  TrendingUp, AlertCircle, Download
} from 'lucide-react';

const ALL_ORDERS = [
  { id: 'MMK-001', type: 'cv', clientName: 'Ali Hassan', email: 'ali@email.com', phone: '+92 300 1234567', title: 'CV — Software Engineer', status: 'completed', date: 'Mar 8, 2026', downloadUrl: '#' },
  { id: 'MMK-002', type: 'certificate', clientName: 'Sara Ahmed', email: 'sara@email.com', phone: '+92 321 9876543', title: 'Experience Certificate — TechCorp', status: 'processing', date: 'Mar 10, 2026', downloadUrl: null },
  { id: 'MMK-003', type: 'apply', clientName: 'Usman Raza', email: 'usman@email.com', phone: '+92 333 5557777', title: 'Online Apply — 5 Jobs', status: 'pending', date: 'Mar 11, 2026', downloadUrl: null },
  { id: 'MMK-004', type: 'printing', clientName: 'Fatima Khan', email: 'fatima@email.com', phone: '+92 312 4445566', title: 'Color Printing — 10 Pages A4', status: 'completed', date: 'Mar 6, 2026', downloadUrl: null },
  { id: 'MMK-005', type: 'cv', clientName: 'Hamza Ali', email: 'hamza@email.com', phone: '+92 345 6667788', title: 'CV — Marketing Manager', status: 'pending', date: 'Mar 11, 2026', downloadUrl: null },
  { id: 'MMK-006', type: 'certificate', clientName: 'Zainab Malik', email: 'zainab@email.com', phone: '+92 311 2223344', title: 'Achievement Certificate', status: 'processing', date: 'Mar 9, 2026', downloadUrl: null },
];

const TYPE_LABELS = { cv: 'CV', certificate: 'Certificate', apply: 'Job Apply', printing: 'Printing' };
const TYPE_COLORS = { cv: '#007BFF', certificate: '#7C3AED', apply: '#F59E0B', printing: '#28A745' };
const TYPE_ICONS = {
  cv: <FileText size={15} />,
  certificate: <Award size={15} />,
  apply: <Briefcase size={15} />,
  printing: <Printer size={15} />,
};

export default function AdminPanel({ navigate, user, showToast }) {
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [activeSection, setActiveSection] = useState('orders');

  if (!user || user.role !== 'admin') {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', maxWidth: 480 }}>
          <Shield size={48} color="#dc3545" style={{ marginBottom: 20, opacity: 0.5 }} />
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 12, color: '#dc3545' }}>Access Denied</h2>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>This panel is only accessible by the admin. Please login with your admin credentials.</p>
          <button className="btn btn-primary" onClick={() => navigate('home')} style={{ padding: '12px 24px' }}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    showToast(`Order ${id} marked as ${newStatus}.`, 'success');
  };

  const handleUpload = (id) => {
    setUploadingFor(id);
    setTimeout(() => {
      setOrders(orders.map(o => o.id === id ? { ...o, downloadUrl: '#', status: 'completed' } : o));
      setUploadingFor(null);
      showToast(`File uploaded for Order ${id}!`, 'success');
    }, 1500);
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.clientName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.title.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || o.type === filterType;
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex' }}>

      {/* Sidebar */}
      <aside style={{
        width: 240, background: '#0d1117', color: 'white',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
        padding: '0 0 24px', zIndex: 100,
        overflowY: 'auto',
      }}>
        {/* Admin logo area */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#007BFF', marginBottom: 2 }}>
            MMK Admin
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Owner Dashboard</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {[
            { id: 'orders', label: 'All Orders', icon: <LayoutDashboard size={17} /> },
            { id: 'cv', label: 'CV Requests', icon: <FileText size={17} /> },
            { id: 'certificate', label: 'Certificates', icon: <Award size={17} /> },
            { id: 'apply', label: 'Job Applications', icon: <Briefcase size={17} /> },
            { id: 'printing', label: 'Printing', icon: <Printer size={17} /> },
          ].map(item => (
            <button key={item.id}
              onClick={() => { setActiveSection(item.id); if (item.id !== 'orders') setFilterType(item.id === 'orders' ? 'all' : item.id); else setFilterType('all'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '11px 14px', borderRadius: 10,
                background: activeSection === item.id ? 'rgba(0,123,255,0.15)' : 'none',
                border: 'none', cursor: 'pointer', color: activeSection === item.id ? '#007BFF' : '#9ca3af',
                fontFamily: 'DM Sans', fontWeight: 600, fontSize: 14,
                transition: 'all 0.18s', marginBottom: 2, textAlign: 'left',
              }}>
              {item.icon} {item.label}
              {item.id !== 'orders' && (
                <span style={{
                  marginLeft: 'auto', fontSize: 11, fontWeight: 700,
                  background: 'rgba(255,255,255,0.08)', padding: '1px 7px', borderRadius: 99, color: '#9ca3af'
                }}>
                  {orders.filter(o => o.type === item.id).length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '0 12px' }}>
          <button onClick={() => navigate('home')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '11px 14px', borderRadius: 10,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#6b7280', fontFamily: 'DM Sans', fontWeight: 500, fontSize: 14,
            }}>
            ← Exit Admin
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 240, flex: 1, padding: '32px', minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: '#0d1117', marginBottom: 4 }}>
              {activeSection === 'orders' ? 'All Orders' : `${TYPE_LABELS[activeSection] || activeSection} Orders`}
            </h1>
            <p style={{ fontSize: 14, color: '#6b7280' }}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#007BFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 14,
            }}>
              {user.name[0]}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Administrator</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Orders', value: stats.total, color: '#374151', bg: '#f3f4f6', icon: <TrendingUp size={18} /> },
            { label: 'Pending', value: stats.pending, color: '#92400E', bg: '#fff3cd', icon: <Clock size={18} /> },
            { label: 'Processing', value: stats.processing, color: '#1e40af', bg: '#dbeafe', icon: <Loader size={18} /> },
            { label: 'Completed', value: stats.completed, color: '#155724', bg: '#d1fae5', icon: <CheckCircle2 size={18} /> },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 14, padding: '18px 20px',
              border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 30, color: s.color }}>{s.value}</div>
                </div>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID, or title..."
              style={{ paddingLeft: 40, background: 'white' }}
            />
          </div>
          <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ width: 160, background: 'white' }}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
          <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}
            style={{ width: 160, background: 'white' }}>
            <option value="all">All Types</option>
            <option value="cv">CV</option>
            <option value="certificate">Certificate</option>
            <option value="apply">Job Apply</option>
            <option value="printing">Printing</option>
          </select>
        </div>

        {/* Orders table */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '100px 1fr 140px 120px 130px 160px',
            padding: '14px 20px', borderBottom: '1px solid #f0f0f0',
            background: '#fafafa',
          }}>
            {['Order ID', 'Client & Title', 'Type', 'Status', 'Date', 'Actions'].map(h => (
              <span key={h} style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
              <AlertCircle size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p>No orders match your search or filters.</p>
            </div>
          )}

          {filtered.map((order, i) => (
            <div key={order.id}>
              <div style={{
                display: 'grid', gridTemplateColumns: '100px 1fr 140px 120px 130px 160px',
                padding: '16px 20px', borderBottom: i < filtered.length - 1 ? '1px solid #f9f9f9' : 'none',
                alignItems: 'center', transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafeff'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* ID */}
                <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#007BFF' }}>{order.id}</span>

                {/* Client */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0d1117' }}>{order.clientName}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{order.title}</div>
                </div>

                {/* Type */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                  background: `${TYPE_COLORS[order.type]}14`, color: TYPE_COLORS[order.type],
                }}>
                  {TYPE_ICONS[order.type]} {TYPE_LABELS[order.type]}
                </span>

                {/* Status */}
                <div>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    style={{
                      border: 'none', background: 'none', cursor: 'pointer',
                      fontFamily: 'DM Sans', fontWeight: 700, fontSize: 13,
                      color: order.status === 'completed' ? '#28A745' : order.status === 'processing' ? '#007BFF' : '#92400E',
                      padding: 0, outline: 'none',
                    }}
                  >
                    <option value="pending">⏱ Pending</option>
                    <option value="processing">⚙️ Processing</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>

                {/* Date */}
                <span style={{ fontSize: 13, color: '#6b7280' }}>{order.date}</span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb',
                      background: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#374151',
                      transition: 'all 0.15s',
                    }}>
                    <Eye size={13} /> {expandedOrder === order.id ? 'Hide' : 'View'}
                  </button>

                  <button onClick={() => handleUpload(order.id)}
                    disabled={uploadingFor === order.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '6px 10px', borderRadius: 8, border: 'none',
                      background: order.downloadUrl ? '#d1fae5' : '#007BFF',
                      color: order.downloadUrl ? '#28A745' : 'white',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      transition: 'all 0.15s',
                    }}>
                    {uploadingFor === order.id ? (
                      <span className="loader" style={{ width: 12, height: 12, borderWidth: 2 }} />
                    ) : order.downloadUrl ? (
                      <><CheckCircle2 size={13} /> Done</>
                    ) : (
                      <><Upload size={13} /> Upload</>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded row */}
              {expandedOrder === order.id && (
                <div style={{
                  padding: '20px', background: '#f8faff',
                  borderBottom: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    <InfoItem label="Client Email" value={order.email} />
                    <InfoItem label="Phone" value={order.phone} />
                    <InfoItem label="Order Type" value={TYPE_LABELS[order.type]} />
                    <InfoItem label="Submitted" value={order.date} />
                  </div>

                  <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {['pending', 'processing', 'completed'].map(s => (
                      <button key={s} onClick={() => updateStatus(order.id, s)}
                        className={`btn ${order.status === s ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ padding: '8px 16px', fontSize: 13, textTransform: 'capitalize' }}>
                        {s === 'pending' ? '⏱' : s === 'processing' ? '⚙️' : '✅'} {s}
                      </button>
                    ))}

                    {order.downloadUrl && (
                      <a href={order.downloadUrl} target="_blank" rel="noopener noreferrer"
                        className="btn btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>
                        <Download size={14} /> Client's File
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, marginTop: 24 }}>
          Showing {filtered.length} of {orders.length} orders
        </p>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          aside { display: none; }
          main { margin-left: 0 !important; }
        }
        @media (max-width: 768px) {
          main > div > div[style*='grid-template-columns: repeat(4'] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#0d1117' }}>{value}</div>
    </div>
  );
}