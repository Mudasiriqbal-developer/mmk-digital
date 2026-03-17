import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast({ msg, type }) {
  const icons = { success: <CheckCircle size={17} />, error: <AlertCircle size={17} />, default: <Info size={17} /> };
  return (
    <div className={`toast ${type}`}>
      {icons[type] || icons.default}
      <span>{msg}</span>
    </div>
  );
}
