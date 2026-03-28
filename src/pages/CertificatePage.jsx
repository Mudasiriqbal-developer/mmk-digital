import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Award, Briefcase, Upload, CheckCircle2, AlertCircle,
  Link, FileText, Plus, Trash2, X, Move,
  ZoomIn, ZoomOut, RotateCw, Crop,
} from 'lucide-react';
import { waLink } from '../components/Footer';

/* ══════════════════════════════════════════════════════════
   CERTIFICATE TYPE DEFINITIONS
══════════════════════════════════════════════════════════ */
const CERT_TYPES = {
  experience: {
    label: 'Experience Certificate',
    urdu: 'تجربہ سرٹیفکیٹ',
    color: 'var(--primary)',
    fields: [
      { id:'employeeName', label:'Employee Full Name',        urdu:'ملازم کا نام',   type:'text',     placeholder:'Muhammad Ali Hassan', required:true },
      { id:'designation',  label:'Designation / Job Title',  urdu:'عہدہ',           type:'text',     placeholder:'Senior Software Engineer', required:true },
      { id:'company',      label:'Company / Organization',   urdu:'کمپنی',          type:'text',     placeholder:'Tech Solutions Pvt. Ltd.', required:true },
      { id:'startDate',    label:'Start Date',               urdu:'شروعات',         type:'date',                                            required:true },
      { id:'endDate',      label:'End Date',                 urdu:'اختتام',         type:'date',                                            required:true },
      { id:'purpose',      label:'Purpose / Note (Optional)',urdu:'مقصد',           type:'textarea', placeholder:'This certificate is issued for visa application purposes…' },
    ],
  },
  achievement: {
    label: 'Achievement Certificate',
    urdu: 'کامیابی سرٹیفکیٹ',
    color: 'var(--accent)',
    fields: [
      { id:'recipientName',label:'Recipient Full Name',      urdu:'وصول کنندہ',     type:'text',     placeholder:'Sara Ahmed', required:true },
      { id:'achievement',  label:'Achievement Title',        urdu:'کامیابی',        type:'text',     placeholder:'Best Employee of the Year', required:true },
      { id:'issuedBy',     label:'Issued By / Organization', urdu:'جاری کنندہ',     type:'text',     placeholder:'MMK Solutions Ltd.', required:true },
      { id:'issueDate',    label:'Issue Date',               urdu:'تاریخ',          type:'date',                                            required:true },
      { id:'description',  label:'Achievement Description',  urdu:'تفصیل',         type:'textarea', placeholder:'This certificate is awarded in recognition of…' },
    ],
  },
  training: {
    label: 'Training / Course Completion',
    urdu: 'تربیتی سرٹیفکیٹ',
    color: '#7C3AED',
    fields: [
      { id:'participantName',label:'Participant Name',         urdu:'شرکت کنندہ',    type:'text', placeholder:'Usman Raza', required:true },
      { id:'courseName',     label:'Course / Training Title',  urdu:'کورس',          type:'text', placeholder:'Advanced React Development', required:true },
      { id:'institute',      label:'Institute / Platform',     urdu:'ادارہ',         type:'text', placeholder:'MMK Digital Academy', required:true },
      { id:'duration',       label:'Duration',                 urdu:'مدت',           type:'text', placeholder:'3 Months (Jan – Mar 2024)', required:true },
      { id:'completionDate', label:'Completion Date',          urdu:'تکمیل تاریخ',   type:'date',                                           required:true },
    ],
  },
  custom: {
    label: 'Custom Certificate',
    urdu: 'کسٹم سرٹیفکیٹ',
    color: 'var(--green)',
    fields: [
      { id:'recipientName',label:'Recipient Name',                     urdu:'نام',       type:'text',     placeholder:'Full name', required:true },
      { id:'title',        label:'Certificate Title',                  urdu:'عنوان',     type:'text',     placeholder:'Certificate of Participation', required:true },
      { id:'issuedBy',     label:'Issued By',                         urdu:'جاری کنندہ',type:'text',     placeholder:'Organization name', required:true },
      { id:'date',         label:'Issue Date',                        urdu:'تاریخ',     type:'date',                                     required:true },
      { id:'details',      label:'Additional Details / Instructions', urdu:'تفصیل',    type:'textarea', placeholder:'Specific requirements, design preferences, or content…' },
    ],
  },
};

const APPLY_STORAGE_KEY = 'mmk_apply_draft';

/* ══════════════════════════════════════════════════════════
   ADVANCED IMAGE CROPPER  (shared with CVBuilder logic)
══════════════════════════════════════════════════════════ */
function AdvancedCropper({ src, onDone, onCancel }) {
  const containerRef = useRef(null);
  const imgRef       = useRef(null);
  const [imgLoaded,  setImgLoaded]  = useState(false);
  const [imgNatural, setImgNatural] = useState({ w:0, h:0 });
  const [zoom,       setZoom]       = useState(1);
  const [imgPos,     setImgPos]     = useState({ x:0, y:0 });
  const [sel,        setSel]        = useState({ x:50, y:50, w:160, h:160 });
  const [cSize,      setCSize]      = useState(280);
  const dragState = useRef(null);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const w = Math.min(containerRef.current.getBoundingClientRect().width - 8, 320);
      setCSize(w);
      setSel({ x:w*0.15, y:w*0.15, w:w*0.7, h:w*0.7 });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (!imgLoaded || !imgRef.current) return;
    const nat = { w:imgRef.current.naturalWidth, h:imgRef.current.naturalHeight };
    setImgNatural(nat);
    const s = Math.min(cSize/nat.w, cSize/nat.h);
    setZoom(s);
    const iw=nat.w*s, ih=nat.h*s;
    setImgPos({ x:(cSize-iw)/2, y:(cSize-ih)/2 });
  }, [imgLoaded, cSize]);

  const clamp = s => {
    let { x,y,w,h } = s; const mn=36;
    w=Math.max(mn,w); h=Math.max(mn,h);
    x=Math.max(0,Math.min(x,cSize-w)); y=Math.max(0,Math.min(y,cSize-h));
    return {x,y,w,h};
  };

  const getXY = e => {
    const r = containerRef.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x:p.clientX-r.left, y:p.clientY-r.top };
  };

  const onPD = (e,type) => { e.preventDefault(); e.stopPropagation(); const {x,y}=getXY(e); dragState.current={type,startX:x,startY:y,startSel:{...sel},startImgPos:{...imgPos}}; };

  const onPM = useCallback(e => {
    if (!dragState.current) return; e.preventDefault();
    const {x,y}=getXY(e); const dx=x-dragState.current.startX; const dy=y-dragState.current.startY;
    const {type,startSel,startImgPos}=dragState.current;
    if (type==='img') { setImgPos({x:startImgPos.x+dx,y:startImgPos.y+dy}); }
    else if (type==='sel') { setSel(clamp({...startSel,x:startSel.x+dx,y:startSel.y+dy})); }
    else {
      let {x:sx,y:sy,w:sw,h:sh}=startSel;
      if(type.includes('e')){sw=Math.max(36,startSel.w+dx);}
      if(type.includes('s')){sh=Math.max(36,startSel.h+dy);}
      if(type.includes('w')){sw=Math.max(36,startSel.w-dx);sx=startSel.x+dx;}
      if(type.includes('n')){sh=Math.max(36,startSel.h-dy);sy=startSel.y+dy;}
      setSel(clamp({x:sx,y:sy,w:sw,h:sh}));
    }
  }, [sel,imgPos,cSize]);

  const onPU = useCallback(() => { dragState.current=null; }, []);

  useEffect(() => {
    window.addEventListener('mousemove',onPM); window.addEventListener('mouseup',onPU);
    window.addEventListener('touchmove',onPM,{passive:false}); window.addEventListener('touchend',onPU);
    return () => { window.removeEventListener('mousemove',onPM); window.removeEventListener('mouseup',onPU); window.removeEventListener('touchmove',onPM); window.removeEventListener('touchend',onPU); };
  }, [onPM,onPU]);

  const handleDone = () => {
    const canvas=document.createElement('canvas'); canvas.width=400; canvas.height=400;
    const ctx=canvas.getContext('2d');
    ctx.drawImage(imgRef.current,(sel.x-imgPos.x)/zoom,(sel.y-imgPos.y)/zoom,sel.w/zoom,sel.h/zoom,0,0,400,400);
    canvas.toBlob(blob=>onDone(blob,canvas.toDataURL('image/jpeg',0.93)),'image/jpeg',0.93);
  };

  return (
    <div className="cropper-modal-overlay">
      <div className="cropper-modal-box">
        <div style={{padding:'14px 16px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
          <span style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:15,color:'var(--text)',display:'flex',alignItems:'center',gap:7}}>
            <Crop size={14} color="var(--primary)"/> Crop Photo
          </span>
          <button onClick={onCancel} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex',padding:4}}><X size={17}/></button>
        </div>
        <div className="cropper-modal-body" style={{padding:'14px 12px',textAlign:'center'}}>
          <div ref={containerRef} style={{display:'inline-block',width:'100%',maxWidth:cSize}}>
            <div className="cropper-wrap" style={{width:cSize,height:cSize,position:'relative'}}
              onMouseDown={e=>onPD(e,'img')} onTouchStart={e=>onPD(e,'img')}>
              <img ref={imgRef} src={src} alt="crop" draggable={false} onLoad={()=>setImgLoaded(true)}
                style={{position:'absolute',left:imgPos.x,top:imgPos.y,width:imgNatural.w*zoom,height:imgNatural.h*zoom,display:'block',pointerEvents:'none',userSelect:'none'}}/>
              {imgLoaded && (
                <div className="cropper-selection" style={{left:sel.x,top:sel.y,width:sel.w,height:sel.h}}
                  onMouseDown={e=>onPD(e,'sel')} onTouchStart={e=>onPD(e,'sel')}>
                  <div className="cropper-grid"/>
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
                    <Move size={18} color="rgba(255,255,255,0.5)"/>
                  </div>
                  {['nw','n','ne','w','e','sw','s','se'].map(h=>(
                    <div key={h} className={`cropper-handle ${h}`} onMouseDown={e=>onPD(e,h)} onTouchStart={e=>onPD(e,h)}/>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p style={{fontSize:11,color:'var(--text-muted)',marginTop:8,marginBottom:10}}>Drag image · Resize handles · Move selection</p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            <button className="btn btn-ghost" style={{padding:'6px 10px'}} onClick={()=>setZoom(z=>Math.max(0.1,+(z-0.1).toFixed(2)))}><ZoomOut size={14}/></button>
            <span style={{fontSize:12,fontWeight:600,color:'var(--text-muted)',minWidth:46,textAlign:'center'}}>{Math.round(zoom*100)}%</span>
            <button className="btn btn-ghost" style={{padding:'6px 10px'}} onClick={()=>setZoom(z=>Math.min(5,+(z+0.1).toFixed(2)))}><ZoomIn size={14}/></button>
            <button className="btn btn-ghost" style={{padding:'6px 10px'}} onClick={()=>{
              if(!imgRef.current)return; const s=Math.min(cSize/imgRef.current.naturalWidth,cSize/imgRef.current.naturalHeight);
              setZoom(s); const iw=imgRef.current.naturalWidth*s,ih=imgRef.current.naturalHeight*s; setImgPos({x:(cSize-iw)/2,y:(cSize-ih)/2});
            }}><RotateCw size={14}/></button>
          </div>
        </div>
        <div style={{padding:'12px 14px',borderTop:'1px solid var(--border)',display:'flex',gap:10,justifyContent:'flex-end',flexShrink:0}}>
          <button className="btn btn-outline" style={{padding:'9px 16px'}} onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" style={{padding:'9px 18px'}} onClick={handleDone}><CheckCircle2 size={14}/> Use Crop</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function CertificatePage({ navigate, showToast }) {
  const [activeTab, setActiveTab] = useState('certificate');

  /* ── Certificate state ── */
  const [certType,    setCertType]    = useState('');
  const [certForm,    setCertForm]    = useState({});
  const [certErrors,  setCertErrors]  = useState({});
  const [certLoading, setCertLoading] = useState(false);

  /* ── Apply state ── */
  const [applyForm,     setApplyForm]     = useState({ fullName:'', email:'', phone:'', coverLetter:'' });
  const [applyErrors,   setApplyErrors]   = useState({});
  const [jobLinks,      setJobLinks]      = useState([{ url:'', notes:'' }]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [applyLoading,  setApplyLoading]  = useState(false);
  const [dragOver,      setDragOver]      = useState(false);
  const [cropSrc,       setCropSrc]       = useState(null);
  const [showCropper,   setShowCropper]   = useState(false);

  const certConfig = certType ? CERT_TYPES[certType] : null;

  /* ── LocalStorage: restore apply draft ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(APPLY_STORAGE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.applyForm) setApplyForm(f => ({...f,...d.applyForm}));
        if (d.jobLinks)  setJobLinks(d.jobLinks);
        if (d.certType)  setCertType(d.certType);
        if (d.certForm)  setCertForm(d.certForm);
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(APPLY_STORAGE_KEY, JSON.stringify({ applyForm, jobLinks, certType, certForm })); } catch(e) {}
  }, [applyForm, jobLinks, certType, certForm]);

  /* ── Certificate submit ── */
  const handleCertSubmit = async () => {
    if (!certType) { showToast('Please select a certificate type.', 'error'); return; }
    const errs = {};
    certConfig.fields.forEach(f => { if (f.required && !certForm[f.id]?.trim()) errs[f.id] = 'Required'; });
    if (Object.keys(errs).length) { setCertErrors(errs); showToast('Please fill all required fields.', 'error'); return; }

    setCertLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setCertLoading(false);
    localStorage.removeItem(APPLY_STORAGE_KEY);

    const details = Object.entries(certForm).map(([k,v]) => `• ${k}: ${v}`).join('\n');
    const msg =
`*Certificate Request — MMK Digital Solution*
━━━━━━━━━━━━━━━━━━
📋 *Type:* ${CERT_TYPES[certType].label} (${CERT_TYPES[certType].urdu})

${details}

⚠️ Note: Send any reference documents/photos separately in this chat after it opens.

Please design and deliver this certificate. Thank you!`;

    window.open(waLink(msg), '_blank');
    navigate('payment', { service:'Certificate Design', price:400, label:CERT_TYPES[certType].label });
  };

  /* ── File upload: images → advanced cropper ── */
  const handleFileUpload = files => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => { setCropSrc(e.target.result); setShowCropper(true); };
        reader.readAsDataURL(file);
      } else {
        setUploadedFiles(prev => [...prev, file]);
      }
    });
  };

  const handleCropDone = (blob) => {
    const f = new File([blob], 'cropped_photo.jpg', { type:'image/jpeg' });
    setUploadedFiles(prev => [...prev, f]);
    setShowCropper(false);
    showToast('Photo added!', 'success');
  };

  /* ── Apply submit ── */
  const handleApplySubmit = async () => {
    const errs = {};
    if (!applyForm.fullName.trim()) errs.fullName = 'Name is required — نام ضروری ہے';
    if (!applyForm.email.trim())    errs.email    = 'Email is required — ای میل ضروری ہے';
    if (!applyForm.phone.trim())    errs.phone    = 'Phone is required — فون ضروری ہے';
    if (jobLinks.filter(j=>j.url.trim()).length===0) errs.jobs = 'Add at least one job link';
    if (Object.keys(errs).length) { setApplyErrors(errs); showToast('Please fill all required fields.', 'error'); return; }

    setApplyLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setApplyLoading(false);
    localStorage.removeItem(APPLY_STORAGE_KEY);

    const validJobs = jobLinks.filter(j=>j.url.trim());
    const msg =
`*Online Job Apply Request — MMK Digital Solution*
━━━━━━━━━━━━━━━━━━
👤 *نام (Name):* ${applyForm.fullName}
📧 *Email:* ${applyForm.email}
📱 *Phone:* ${applyForm.phone}

🔗 *Job Links (${validJobs.length}):*
${validJobs.map((j,i)=>`${i+1}. ${j.url}${j.notes?' — '+j.notes:''}`).join('\n')}

📝 *Notes:* ${applyForm.coverLetter || 'None'}

⚠️ Note: Please send CV and documents (PDF/images) separately in this WhatsApp chat after it opens — attachments cannot be sent via links.

Please apply on my behalf. Thank you!`;

    window.open(waLink(msg), '_blank');
    navigate('payment', { service:'Online Job Apply', price:300, label:`Online Apply — ${validJobs.length} job${validJobs.length!==1?'s':''}` });
  };

  const ErrMsg = ({ field, errs }) => errs[field]
    ? <div className="field-error-msg"><AlertCircle size={12}/>{errs[field]}</div> : null;

  const BLabel = ({ en, ur, required }) => (
    <div className="field-label-row">
      <span className="field-label-en">{en}{required && <span className="field-required"> *</span>}</span>
      {ur && <span className="urdu-label">{ur}</span>}
    </div>
  );

  /* ─── RENDER ─── */
  return (
    <div className="section">
      <div className="container" style={{ maxWidth:860 }}>

        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(22px,4vw,34px)', fontWeight:800, marginBottom:6, color:'var(--text)' }}>
            Certificates & Job Applications
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:15 }}>
            سرٹیفکیٹ ڈیزائن یا آن لائن ملازمت کی درخواستیں — ہم سنبھال لیں گے۔
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display:'flex', gap:4, background:'var(--section-alt)', borderRadius:12, padding:4, marginBottom:28, width:'fit-content', border:'1px solid var(--border)', maxWidth:'100%', overflowX:'auto' }}>
          {[
            { id:'certificate', label:'Certificate Design', icon:<Award size={15}/> },
            { id:'apply',       label:'Online Job Apply',   icon:<Briefcase size={15}/> },
          ].map(tab => (
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
              style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'9px 16px', borderRadius:9, border:'none',
                fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:13,
                cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap',
                background: activeTab===tab.id ? 'var(--card-bg)' : 'transparent',
                color:      activeTab===tab.id ? 'var(--primary)'  : 'var(--text-muted)',
                boxShadow:  activeTab===tab.id ? 'var(--shadow-sm)': 'none',
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ CERTIFICATE TAB ═══ */}
        {activeTab === 'certificate' && (
          <div>
            {/* Type selector */}
            <div className="card" style={{ padding:'20px 18px', marginBottom:20 }}>
              <BLabel en="Select Certificate Type" ur="سرٹیفکیٹ کی قسم"/>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginTop:10 }}>
                {Object.entries(CERT_TYPES).map(([key,val]) => (
                  <button key={key} onClick={()=>{ setCertType(key); setCertForm({}); setCertErrors({}); }}
                    style={{
                      padding:'16px 12px', borderRadius:12, cursor:'pointer', textAlign:'left',
                      border: certType===key ? `2px solid ${val.color}` : '2px solid var(--border)',
                      background: certType===key ? `color-mix(in srgb, ${val.color} 8%, var(--card-bg))` : 'var(--card-bg)',
                      transition:'all 0.2s',
                    }}>
                    <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:13, color:certType===key?val.color:'var(--text)', marginBottom:3 }}>
                      {val.label}
                    </div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', direction:'rtl' }}>{val.urdu}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic fields */}
            {certConfig && (
              <div className="card" style={{ padding:'20px 18px', marginBottom:20 }}>
                <h3 style={SH}>{certConfig.label} <span className="urdu-label">{certConfig.urdu}</span></h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14 }}>
                  {certConfig.fields.map(field => (
                    <div key={field.id} style={field.type==='textarea'?{gridColumn:'1/-1'}:{}}>
                      <BLabel en={field.label} ur={field.urdu} required={field.required}/>
                      {field.type==='textarea' ? (
                        <textarea className={`form-input${certErrors[field.id]?' error':''}`} rows={3}
                          value={certForm[field.id]||''}
                          onChange={e=>{ setCertForm(f=>({...f,[field.id]:e.target.value})); setCertErrors(e=>({...e,[field.id]:''})); }}
                          placeholder={field.placeholder} style={{resize:'vertical'}}/>
                      ) : field.type==='date' ? (
                        <input className={`form-input${certErrors[field.id]?' error':''}`} type="date"
                          value={certForm[field.id]||''}
                          onChange={e=>{ setCertForm(f=>({...f,[field.id]:e.target.value})); setCertErrors(e=>({...e,[field.id]:''})); }}/>
                      ) : (
                        <input className={`form-input${certErrors[field.id]?' error':''}`} type="text"
                          value={certForm[field.id]||''}
                          onChange={e=>{ setCertForm(f=>({...f,[field.id]:e.target.value})); setCertErrors(e=>({...e,[field.id]:''})); }}
                          placeholder={field.placeholder}/>
                      )}
                      <ErrMsg field={field.id} errs={certErrors}/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp attachment notice */}
            <div style={{ padding:'12px 16px', background:'rgba(245,158,11,0.07)', border:'1.5px solid rgba(245,158,11,0.2)', borderRadius:12, marginBottom:20, display:'flex', gap:10, alignItems:'flex-start' }}>
              <AlertCircle size={16} color="#F59E0B" style={{ flexShrink:0, marginTop:2 }}/>
              <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.65 }}>
                <strong style={{ color:'var(--text)' }}>📎 File Attachment Note:</strong> WhatsApp links cannot carry files. After clicking submit, the WhatsApp chat will open — please <strong>manually send any reference images or documents</strong> in that same chat.
              </p>
            </div>

            <div style={{ padding:'12px 16px', background:'var(--primary-light)', borderRadius:12, border:'1px solid rgba(227,30,36,0.15)', marginBottom:20 }}>
              <p style={{ fontSize:13, color:'var(--text-muted)' }}>
                <strong style={{ color:'var(--primary)' }}>Rs. 400 per certificate.</strong> Delivered as high-resolution PDF within 48 hours.
              </p>
            </div>

            <button className="btn btn-primary" onClick={handleCertSubmit} disabled={certLoading}
              style={{ padding:'13px 28px', fontSize:15, width:'100%', maxWidth:280 }}>
              {certLoading ? <><span className="loader"/> Submitting…</> : <><CheckCircle2 size={16}/> Submit Certificate Request</>}
            </button>
          </div>
        )}

        {/* ═══ APPLY TAB ═══ */}
        {activeTab === 'apply' && (
          <div>
            <div style={{ padding:'16px 18px', background:'rgba(245,158,11,0.07)', border:'1.5px solid rgba(245,158,11,0.22)', borderRadius:14, marginBottom:20, display:'flex', alignItems:'flex-start', gap:12 }}>
              <Briefcase size={18} color="#F59E0B" style={{ flexShrink:0, marginTop:2 }}/>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:'#92400E', marginBottom:3 }}>How Online Apply Works</div>
                <p style={{ fontSize:13, color:'#78350F', lineHeight:1.6 }}>
                  Upload your credentials, paste job links, and our team submits your applications professionally.
                </p>
              </div>
            </div>

            {/* Your details */}
            <div className="card" style={{ padding:'20px 18px', marginBottom:18 }}>
              <h3 style={SH}>آپ کی تفصیل — Your Details</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:14 }}>
                <div>
                  <BLabel en="Full Name" ur="پورا نام" required/>
                  <input className={`form-input${applyErrors.fullName?' error':''}`}
                    value={applyForm.fullName}
                    onChange={e=>{ setApplyForm(f=>({...f,fullName:e.target.value})); setApplyErrors(e=>({...e,fullName:''})); }}
                    placeholder="Your full name"/>
                  <ErrMsg field="fullName" errs={applyErrors}/>
                </div>
                <div>
                  <BLabel en="Email" ur="ای میل" required/>
                  <input className={`form-input${applyErrors.email?' error':''}`} type="email"
                    value={applyForm.email}
                    onChange={e=>{ setApplyForm(f=>({...f,email:e.target.value})); setApplyErrors(e=>({...e,email:''})); }}
                    placeholder="you@email.com"/>
                  <ErrMsg field="email" errs={applyErrors}/>
                </div>
                <div>
                  <BLabel en="Phone / WhatsApp" ur="فون نمبر" required/>
                  <input className={`form-input${applyErrors.phone?' error':''}`}
                    value={applyForm.phone}
                    onChange={e=>{ setApplyForm(f=>({...f,phone:e.target.value})); setApplyErrors(e=>({...e,phone:''})); }}
                    placeholder="+92 300 0000000"/>
                  <ErrMsg field="phone" errs={applyErrors}/>
                </div>
              </div>
              <div style={{ marginTop:14 }}>
                <BLabel en="Cover Letter / Instructions" ur="خصوصی ہدایات"/>
                <textarea className="form-input" rows={3} value={applyForm.coverLetter}
                  onChange={e=>setApplyForm(f=>({...f,coverLetter:e.target.value}))}
                  placeholder="Your objective, specific notes for our team…" style={{resize:'vertical'}}/>
              </div>
            </div>

            {/* Job links */}
            <div className="card" style={{ padding:'20px 18px', marginBottom:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:8 }}>
                <h3 style={SH}>ملازمت لنکس — Job Links</h3>
                <button className="btn btn-ghost" style={{ padding:'7px 12px', fontSize:12 }}
                  onClick={()=>setJobLinks(j=>[...j,{url:'',notes:''}])}>
                  <Plus size={13}/> Add Link
                </button>
              </div>
              {applyErrors.jobs && <div className="field-error-msg" style={{ marginBottom:10 }}><AlertCircle size={12}/>{applyErrors.jobs}</div>}
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {jobLinks.map((job,i) => (
                  <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <Link size={13} color="var(--accent)" style={{ flexShrink:0 }}/>
                        <input className="form-input" value={job.url}
                          onChange={e=>setJobLinks(jobs=>jobs.map((j,idx)=>idx===i?{...j,url:e.target.value}:j))}
                          placeholder="https://jobs.example.com/apply/123" style={{padding:'10px 12px'}}/>
                      </div>
                      <input className="form-input" value={job.notes}
                        onChange={e=>setJobLinks(jobs=>jobs.map((j,idx)=>idx===i?{...j,notes:e.target.value}:j))}
                        placeholder="Position title (optional)" style={{padding:'9px 12px',fontSize:13}}/>
                    </div>
                    {jobLinks.length>1 && (
                      <button onClick={()=>setJobLinks(jobs=>jobs.filter((_,idx)=>idx!==i))}
                        style={{background:'none',border:'none',cursor:'pointer',color:'#dc3545',display:'flex',marginTop:8,flexShrink:0,padding:4}}>
                        <Trash2 size={15}/>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Document upload */}
            <div className="card" style={{ padding:'20px 18px', marginBottom:18 }}>
              <h3 style={SH}>دستاویز اپ لوڈ — Upload Documents</h3>
              <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:14 }}>
                CV, certificates, CNIC copy — images open the advanced cropper for framing.
              </p>
              <div className={`upload-zone${dragOver?' drag-over':''}`}
                onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={e=>{e.preventDefault();setDragOver(false);handleFileUpload(e.dataTransfer.files);}}
                onClick={()=>document.getElementById('apply-files').click()}>
                <Upload size={30} color="var(--accent)" style={{marginBottom:10,opacity:0.7}}/>
                <p style={{fontWeight:600,fontSize:13,marginBottom:3,color:'var(--text)'}}>Drop files or click to browse</p>
                <p style={{fontSize:12,color:'var(--text-muted)'}}>PDF, DOC, DOCX, JPG, PNG — 10 MB each</p>
                <input id="apply-files" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style={{display:'none'}}
                  onChange={e=>handleFileUpload(e.target.files)}/>
              </div>
              {uploadedFiles.length>0 && (
                <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:7}}>
                  {uploadedFiles.map((file,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px',background:'var(--section-alt)',borderRadius:10,border:'1px solid var(--border)'}}>
                      <FileText size={14} color="var(--accent)"/>
                      <span style={{fontSize:13,flex:1,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{file.name}</span>
                      <span style={{fontSize:11,color:'var(--text-muted)',flexShrink:0}}>{(file.size/1024).toFixed(0)} KB</span>
                      <CheckCircle2 size={14} color="var(--green)"/>
                      <button onClick={()=>setUploadedFiles(f=>f.filter((_,idx)=>idx!==i))}
                        style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex',flexShrink:0,padding:2}}>
                        <X size={13}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp attachment note */}
            <div style={{ padding:'12px 16px', background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.22)', borderRadius:12, marginBottom:18, display:'flex', gap:10, alignItems:'flex-start' }}>
              <AlertCircle size={15} color="#F59E0B" style={{flexShrink:0,marginTop:2}}/>
              <p style={{fontSize:13,color:'var(--text-muted)',lineHeight:1.65}}>
                <strong style={{color:'var(--text)'}}>📎 Attachment Note:</strong> WhatsApp links can't carry file attachments. After this form, the WhatsApp chat will open — <strong>please send your CV and documents manually</strong> in that conversation.
              </p>
            </div>

            <div style={{ padding:'12px 16px', background:'var(--accent-light)', borderRadius:12, border:'1px solid rgba(0,123,255,0.15)', marginBottom:20 }}>
              <p style={{fontSize:13,color:'var(--text-muted)'}}>
                <strong style={{color:'var(--accent)'}}>Rs. 300</strong> for up to 5 job applications.
              </p>
            </div>

            <button className="btn btn-accent" onClick={handleApplySubmit} disabled={applyLoading}
              style={{ padding:'13px 28px', fontSize:15, width:'100%', maxWidth:320 }}>
              {applyLoading ? <><span className="loader"/> Submitting…</> : <><CheckCircle2 size={16}/> Submit Application Request</>}
            </button>
          </div>
        )}
      </div>

      {showCropper && cropSrc && (
        <AdvancedCropper src={cropSrc} onDone={handleCropDone} onCancel={()=>setShowCropper(false)}/>
      )}
    </div>
  );
}

const SH = { fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:700, marginBottom:0, color:'var(--text)', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' };