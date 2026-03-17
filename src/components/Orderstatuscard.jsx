import { Clock, Loader2, CheckCircle2, Download, FileText } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Pending', icon: <Clock size={14} />, class: 'badge-pending' },
  processing: { label: 'Processing', icon: <Loader2 size={14} />, class: 'badge-processing' },
  completed: { label: 'Completed', icon: <CheckCircle2 size={14} />, class: 'badge-completed' },
};

export default function OrderStatusCard({ order }) {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  return (
    <div className="card" style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(0,123,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#007BFF',
          }}>
            <FileText size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif' }}>{order.title}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Order #{order.id}</div>
          </div>
        </div>
        <span className={`badge ${status.class}`}>
          {status.icon} {status.label}
        </span>
      </div>

      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>
        Submitted: {order.date}
      </div>

      {/* Progress bar */}
      <div style={{ background: '#f3f4f6', borderRadius: 99, height: 5, marginBottom: 14 }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: order.status === 'completed' ? '#28A745' : order.status === 'processing' ? '#007BFF' : '#e5e7eb',
          width: order.status === 'completed' ? '100%' : order.status === 'processing' ? '55%' : '10%',
          transition: 'width 0.5s ease',
        }} />
      </div>

      {order.status === 'completed' && order.downloadUrl && (
        <a href={order.downloadUrl} target="_blank" rel="noopener noreferrer"
          className="btn btn-primary" style={{ padding: '9px 18px', fontSize: 13, width: '100%', justifyContent: 'center' }}>
          <Download size={15} /> Download Your File
        </a>
      )}
    </div>
  );
}