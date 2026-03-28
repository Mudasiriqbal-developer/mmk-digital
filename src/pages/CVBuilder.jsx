import { useState, useRef, useEffect, useCallback } from 'react';
import {
  User, GraduationCap, Briefcase, Star, Camera,
  CheckCircle2, Plus, Trash2, Upload, AlertCircle,
  ZoomIn, ZoomOut, RotateCw, Crop, X, Move,
} from 'lucide-react';
import { waLink } from '../components/Footer';

/* ══════════════════════════════════════════════════════════
   ADVANCED IMAGE CROPPER
   — Draggable selection box with 8 resize handles
   — Zoom controls + reset
   — Full touch & mouse support
══════════════════════════════════════════════════════════ */
function AdvancedCropper({ src, onDone, onCancel }) {
  const containerRef = useRef(null);
  const imgRef       = useRef(null);
  const [imgLoaded,  setImgLoaded]  = useState(false);
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
  const [zoom,       setZoom]       = useState(1);
  const [imgPos,     setImgPos]     = useState({ x: 0, y: 0 });
  const [sel,        setSel]        = useState({ x: 60, y: 60, w: 180, h: 180 });
  const [containerSize, setContainerSize] = useState({ w: 320, h: 320 });

  // Interaction state stored in refs to avoid stale closures
  const dragState = useRef(null); // { type: 'img'|'sel'|handle, startX, startY, startSel, startImgPos }

  /* ── measure container on mount / resize ── */
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const size = Math.min(rect.width, 360);
      setContainerSize({ w: size, h: size });
      // Initial selection = centre 60%
      setSel({ x: size*0.2, y: size*0.2, w: size*0.6, h: size*0.6 });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* ── fit image when loaded ── */
  useEffect(() => {
    if (!imgLoaded || !imgRef.current) return;
    const nat = { w: imgRef.current.naturalWidth, h: imgRef.current.naturalHeight };
    setImgNatural(nat);
    const scale = Math.min(containerSize.w / nat.w, containerSize.h / nat.h);
    setZoom(scale);
    const iw = nat.w * scale, ih = nat.h * scale;
    setImgPos({ x: (containerSize.w - iw) / 2, y: (containerSize.h - ih) / 2 });
  }, [imgLoaded, containerSize.w, containerSize.h]);

  /* ── clamp helpers ── */
  const clampSel = (s) => {
    const min = 40;
    let { x, y, w, h } = s;
    w = Math.max(min, w); h = Math.max(min, h);
    x = Math.max(0, Math.min(x, containerSize.w - w));
    y = Math.max(0, Math.min(y, containerSize.h - h));
    return { x, y, w, h };
  };

  /* ── pointer event handling ── */
  const getXY = e => {
    const rect = containerRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const onPointerDown = (e, type) => {
    e.preventDefault(); e.stopPropagation();
    const { x, y } = getXY(e);
    dragState.current = { type, startX: x, startY: y, startSel: { ...sel }, startImgPos: { ...imgPos } };
  };

  const onPointerMove = useCallback(e => {
    if (!dragState.current) return;
    e.preventDefault();
    const { x, y } = getXY(e);
    const dx = x - dragState.current.startX;
    const dy = y - dragState.current.startY;
    const { type, startSel, startImgPos } = dragState.current;

    if (type === 'img') {
      setImgPos({ x: startImgPos.x + dx, y: startImgPos.y + dy });
    } else if (type === 'sel') {
      setSel(clampSel({ ...startSel, x: startSel.x + dx, y: startSel.y + dy }));
    } else {
      // resize handle
      let { x: sx, y: sy, w: sw, h: sh } = startSel;
      if (type.includes('e')) { sw = Math.max(40, startSel.w + dx); }
      if (type.includes('s')) { sh = Math.max(40, startSel.h + dy); }
      if (type.includes('w')) { const nx = startSel.x + dx; sw = Math.max(40, startSel.w - dx); sx = nx; }
      if (type.includes('n')) { const ny = startSel.y + dy; sh = Math.max(40, startSel.h - dy); sy = ny; }
      setSel(clampSel({ x: sx, y: sy, w: sw, h: sh }));
    }
  }, [sel, imgPos, containerSize]);

  const onPointerUp = useCallback(() => { dragState.current = null; }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup',   onPointerUp);
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend',  onPointerUp);
    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup',   onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend',  onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  /* ── crop & export ── */
  const handleDone = () => {
    const canvas = document.createElement('canvas');
    const OUTPUT = 400;
    canvas.width = OUTPUT; canvas.height = OUTPUT;
    const ctx = canvas.getContext('2d');
    // Map selection back to image coords
    const scaleX = imgNatural.w / (imgNatural.w * zoom);
    const scaleY = imgNatural.h / (imgNatural.h * zoom);
    const srcX = (sel.x - imgPos.x) / zoom;
    const srcY = (sel.y - imgPos.y) / zoom;
    const srcW = sel.w / zoom;
    const srcH = sel.h / zoom;
    ctx.drawImage(imgRef.current, srcX, srcY, srcW, srcH, 0, 0, OUTPUT, OUTPUT);
    canvas.toBlob(blob => onDone(blob, canvas.toDataURL('image/jpeg', 0.93)), 'image/jpeg', 0.93);
  };

  const imgW = imgNatural.w * zoom;
  const imgH = imgNatural.h * zoom;

  const HANDLES = ['nw','n','ne','w','e','sw','s','se'];

  return (
    <div className="cropper-modal-overlay">
      <div className="cropper-modal-box">
        {/* Header */}
        <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:15, color:'var(--text)', display:'flex', alignItems:'center', gap:7 }}>
            <Crop size={15} color="var(--primary)"/> Crop Your Photo
          </span>
          <button onClick={onCancel} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', padding:4 }}>
            <X size={18}/>
          </button>
        </div>

        <div className="cropper-modal-body">
          <div style={{ padding:'16px 16px 8px', textAlign:'center' }}>
            {/* Cropper stage */}
            <div ref={containerRef} style={{ display:'inline-block', width:'100%', maxWidth:containerSize.w }}>
              <div
                className="cropper-wrap"
                style={{ width: containerSize.w, height: containerSize.w, position:'relative', overflow:'hidden' }}
                onMouseDown={e => onPointerDown(e, 'img')}
                onTouchStart={e => onPointerDown(e, 'img')}
              >
                {/* The image */}
                <img
                  ref={imgRef}
                  src={src}
                  alt="crop"
                  draggable={false}
                  onLoad={() => setImgLoaded(true)}
                  style={{ position:'absolute', left:imgPos.x, top:imgPos.y, width:imgW, height:imgH, display:'block', pointerEvents:'none', userSelect:'none' }}
                />

                {/* Crop selection box */}
                {imgLoaded && (
                  <div
                    className="cropper-selection"
                    style={{ left:sel.x, top:sel.y, width:sel.w, height:sel.h }}
                    onMouseDown={e => onPointerDown(e, 'sel')}
                    onTouchStart={e => onPointerDown(e, 'sel')}
                  >
                    {/* Grid lines */}
                    <div className="cropper-grid"/>

                    {/* Move icon */}
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                      <Move size={20} color="rgba(255,255,255,0.6)"/>
                    </div>

                    {/* 8 resize handles */}
                    {HANDLES.map(h => (
                      <div
                        key={h}
                        className={`cropper-handle ${h}`}
                        onMouseDown={e => onPointerDown(e, h)}
                        onTouchStart={e => onPointerDown(e, h)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:8, marginBottom:12 }}>
              Drag image to reposition · Drag handles to resize selection · Drag box to move
            </p>

            {/* Zoom controls */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <button className="btn btn-ghost" style={{ padding:'7px 12px' }} onClick={() => setZoom(z => Math.max(0.1, +(z - 0.1).toFixed(2)))}><ZoomOut size={15}/></button>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--text-muted)', minWidth:52, textAlign:'center' }}>{Math.round(zoom * 100)}%</span>
              <button className="btn btn-ghost" style={{ padding:'7px 12px' }} onClick={() => setZoom(z => Math.min(5, +(z + 0.1).toFixed(2)))}><ZoomIn size={15}/></button>
              <button className="btn btn-ghost" style={{ padding:'7px 12px' }} onClick={() => {
                if (!imgRef.current) return;
                const s = Math.min(containerSize.w / imgRef.current.naturalWidth, containerSize.h / imgRef.current.naturalHeight);
                setZoom(s);
                const iw = imgRef.current.naturalWidth * s, ih = imgRef.current.naturalHeight * s;
                setImgPos({ x:(containerSize.w-iw)/2, y:(containerSize.h-ih)/2 });
              }}><RotateCw size={15}/></button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'12px 16px', borderTop:'1px solid var(--border)', display:'flex', gap:10, justifyContent:'flex-end', flexShrink:0 }}>
          <button className="btn btn-outline" style={{ padding:'10px 18px' }} onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" style={{ padding:'10px 20px' }} onClick={handleDone}>
            <CheckCircle2 size={15}/> Use This Crop
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP CONFIG
══════════════════════════════════════════════════════════ */
const STEPS = [
  { id:'personal',   label:'Personal',   urdu:'ذاتی',   icon:<User          size={14}/> },
  { id:'education',  label:'Education',  urdu:'تعلیم',  icon:<GraduationCap size={14}/> },
  { id:'experience', label:'Experience', urdu:'تجربہ',  icon:<Briefcase     size={14}/> },
  { id:'skills',     label:'Skills',     urdu:'مہارت',  icon:<Star          size={14}/> },
  { id:'photo',      label:'Photo',      urdu:'تصویر',  icon:<Camera        size={14}/> },
];

const STORAGE_KEY = 'mmk_cv_draft';

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function CVBuilder({ navigate, showToast }) {
  const [step,         setStep]         = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBlob,    setPhotoBlob]    = useState(null);
  const [rawSrc,       setRawSrc]       = useState(null);
  const [showCropper,  setShowCropper]  = useState(false);
  const [dragOver,     setDragOver]     = useState(false);
  const [errors,       setErrors]       = useState({});

  /* ── Personal (includes new fields) ── */
  const [personal, setPersonal] = useState({
    fullName:'', fatherName:'', cnic:'', age:'',
    email:'', phone:'', city:'', linkedin:'', objective:'',
  });

  /* ── Education ── */
  const [education, setEducation] = useState([
    { degree:'', institution:'', year:'', grade:'' },
  ]);

  /* ── Experience ── */
  const [experience, setExperience] = useState([
    { title:'', company:'', startDate:'', endDate:'', current:false, description:'' },
  ]);

  /* ── Skills ── */
  const [skills, setSkills] = useState({
    technical:'', soft:'', languages:'', certifications:'',
  });

  /* ════════════════════════════════════════
     LocalStorage — Restore on mount
  ════════════════════════════════════════ */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.personal)   setPersonal(p  => ({ ...p,  ...d.personal }));
        if (d.education)  setEducation(d.education);
        if (d.experience) setExperience(d.experience);
        if (d.skills)     setSkills(s  => ({ ...s,  ...d.skills }));
        if (d.photoPreview) setPhotoPreview(d.photoPreview);
        if (d.step !== undefined) setStep(d.step);
        showToast('Draft restored from last session ✓', 'success');
      }
    } catch(e) { /* ignore */ }
  }, []);

  /* ── Save to localStorage on every meaningful change ── */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        personal, education, experience, skills, photoPreview, step,
      }));
    } catch(e) { /* ignore */ }
  }, [personal, education, experience, skills, photoPreview, step]);

  /* ════════════════════════════════════════
     Education helpers
  ════════════════════════════════════════ */
  const addEdu    = ()        => setEducation(e => [...e, { degree:'', institution:'', year:'', grade:'' }]);
  const removeEdu = i         => setEducation(e => e.filter((_,idx) => idx !== i));
  const updateEdu = (i, k, v) => setEducation(e => e.map((row,idx) => idx===i ? {...row,[k]:v} : row));

  /* ════════════════════════════════════════
     Experience helpers
  ════════════════════════════════════════ */
  const addExp    = ()        => setExperience(e => [...e, { title:'', company:'', startDate:'', endDate:'', current:false, description:'' }]);
  const removeExp = i         => setExperience(e => e.filter((_,idx) => idx !== i));
  const updateExp = (i, k, v) => setExperience(e => e.map((row,idx) => idx===i ? {...row,[k]:v} : row));

  /* ════════════════════════════════════════
     Photo / Cropper
  ════════════════════════════════════════ */
  const handleFileSelect = file => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { setRawSrc(e.target.result); setShowCropper(true); };
    reader.readAsDataURL(file);
  };

  const handleCropDone = (blob, dataUrl) => {
    setPhotoBlob(blob);
    setPhotoPreview(dataUrl);
    setShowCropper(false);
    // Clear photo error
    setErrors(e => { const ne={...e}; delete ne.photo; return ne; });
    showToast('Photo cropped successfully!', 'success');
  };

  /* ════════════════════════════════════════
     STRICT VALIDATION per step
  ════════════════════════════════════════ */
  const validateStep = (s) => {
    const errs = {};
    if (s === 0) {
      if (!personal.fullName.trim())   errs.fullName   = 'نام ضروری ہے (Name is required)';
      if (!personal.fatherName.trim()) errs.fatherName = 'والد کا نام ضروری ہے (Father\'s Name required)';
      if (!personal.cnic.trim())       errs.cnic       = 'CNIC ضروری ہے (CNIC is required)';
      if (!personal.age.trim())        errs.age        = 'عمر ضروری ہے (Age is required)';
      if (!personal.email.trim())      errs.email      = 'ای میل ضروری ہے (Email is required)';
      if (!personal.phone.trim())      errs.phone      = 'فون نمبر ضروری ہے (Phone is required)';
    }
    if (s === 1) {
      education.forEach((edu, i) => {
        if (!edu.degree.trim())      errs[`edu_degree_${i}`]      = 'Degree is required';
        if (!edu.institution.trim()) errs[`edu_institution_${i}`] = 'Institution is required';
      });
    }
    if (s === 2) {
      experience.forEach((exp, i) => {
        if (!exp.title.trim())   errs[`exp_title_${i}`]   = 'Job title is required';
        if (!exp.company.trim()) errs[`exp_company_${i}`] = 'Company is required';
      });
    }
    if (s === 3) {
      if (!skills.languages.trim()) errs.languages = 'Languages ضروری ہیں (required)';
    }
    if (s === 4) {
      if (!photoPreview) errs.photo = 'تصویر ضروری ہے (Photo is required)';
    }
    return errs;
  };

  const goNext = () => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast('Please fill all required fields marked with *.', 'error');
      return;
    }
    setStep(s => s + 1);
  };

  /* ════════════════════════════════════════
     WhatsApp Submit
     Note: WhatsApp Web does not support
     file attachments via links. Files must
     be shared manually after chat opens.
  ════════════════════════════════════════ */
  const handleSubmit = async () => {
    const errs = validateStep(4);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast('Please upload your photo before submitting.', 'error');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);

    const msg =
`*CV Order — MMK Digital Solution*
━━━━━━━━━━━━━━━━━━
👤 *نام (Name):* ${personal.fullName}
👨 *والد (Father):* ${personal.fatherName}
🪪 *CNIC:* ${personal.cnic}
🎂 *عمر (Age):* ${personal.age}
📧 *Email:* ${personal.email}
📱 *Phone:* ${personal.phone}
📍 *City:* ${personal.city || 'N/A'}
🔗 *LinkedIn:* ${personal.linkedin || 'N/A'}

🎓 *Education:* ${education.map(e=>`${e.degree} — ${e.institution}`).join(' | ') || 'N/A'}
💼 *Experience:* ${experience.map(e=>`${e.title} at ${e.company}`).join(' | ') || 'N/A'}
🛠️ *Skills:* ${skills.technical || 'N/A'}
🌐 *Languages:* ${skills.languages || 'N/A'}

📝 *Objective:* ${personal.objective || 'N/A'}

⚠️ *Note:* Please send the profile photo separately in this chat after it opens.

Please process my CV order. Thank you!`;

    window.open(waLink(msg), '_blank');

    // Clear saved draft after submit
    localStorage.removeItem(STORAGE_KEY);

    navigate('payment', { service:'CV Creation', price:500, label:'Professional CV Creation' });
  };

  /* ════════════════════════════════════════
     ERROR FIELD HELPER
  ════════════════════════════════════════ */
  const E = ({ field }) => errors[field]
    ? <div className="field-error-msg"><AlertCircle size={12}/>{errors[field]}</div>
    : null;

  /* ════════════════════════════════════════
     BILINGUAL FIELD LABEL HELPER
  ════════════════════════════════════════ */
  const Label = ({ en, ur, required }) => (
    <div className="field-label-row">
      <span className="field-label-en">
        {en}{required && <span className="field-required">*</span>}
      </span>
      {ur && <span className="urdu-label">{ur}</span>}
    </div>
  );

  /* ════════════════════════════════════════
     STEP CONTENT
  ════════════════════════════════════════ */
  const stepContents = [

    /* ── STEP 0 · Personal ── */
    <div key="personal">
      <h3 style={SH}>ذاتی معلومات — Personal Details</h3>
      <div style={GRID}>

        <div>
          <Label en="Full Name" ur="پورا نام" required/>
          <input className={`form-input${errors.fullName?' error':''}`}
            value={personal.fullName}
            onChange={e => { setPersonal(p=>({...p,fullName:e.target.value})); setErrors(er=>({...er,fullName:''})); }}
            placeholder="Muhammad Ali Hassan"/>
          <E field="fullName"/>
        </div>

        <div>
          <Label en="Father's Name" ur="والد کا نام" required/>
          <input className={`form-input${errors.fatherName?' error':''}`}
            value={personal.fatherName}
            onChange={e => { setPersonal(p=>({...p,fatherName:e.target.value})); setErrors(er=>({...er,fatherName:''})); }}
            placeholder="Muhammad Hassan"/>
          <E field="fatherName"/>
        </div>

        <div>
          <Label en="CNIC No." ur="شناختی کارڈ نمبر" required/>
          <input className={`form-input${errors.cnic?' error':''}`}
            value={personal.cnic}
            onChange={e => { setPersonal(p=>({...p,cnic:e.target.value})); setErrors(er=>({...er,cnic:''})); }}
            placeholder="XXXXX-XXXXXXX-X"/>
          <E field="cnic"/>
        </div>

        <div>
          <Label en="Age" ur="عمر" required/>
          <input className={`form-input${errors.age?' error':''}`}
            type="number" min="16" max="80"
            value={personal.age}
            onChange={e => { setPersonal(p=>({...p,age:e.target.value})); setErrors(er=>({...er,age:''})); }}
            placeholder="22"/>
          <E field="age"/>
        </div>

        <div>
          <Label en="Email Address" ur="ای میل" required/>
          <input className={`form-input${errors.email?' error':''}`}
            type="email" value={personal.email}
            onChange={e => { setPersonal(p=>({...p,email:e.target.value})); setErrors(er=>({...er,email:''})); }}
            placeholder="you@email.com"/>
          <E field="email"/>
        </div>

        <div>
          <Label en="Phone / WhatsApp" ur="فون نمبر" required/>
          <input className={`form-input${errors.phone?' error':''}`}
            value={personal.phone}
            onChange={e => { setPersonal(p=>({...p,phone:e.target.value})); setErrors(er=>({...er,phone:''})); }}
            placeholder="+92 300 0000000"/>
          <E field="phone"/>
        </div>

        <div>
          <Label en="City" ur="شہر"/>
          <input className="form-input" value={personal.city}
            onChange={e => setPersonal(p=>({...p,city:e.target.value}))}
            placeholder="Karachi, Lahore…"/>
        </div>

        <div>
          <Label en="LinkedIn URL" ur="لنکڈ ان"/>
          <input className="form-input" value={personal.linkedin}
            onChange={e => setPersonal(p=>({...p,linkedin:e.target.value}))}
            placeholder="https://linkedin.com/in/username"/>
        </div>

        <div style={{ gridColumn:'1/-1' }}>
          <Label en="Professional Objective / Summary" ur="پیشہ ورانہ خلاصہ"/>
          <textarea className="form-input" rows={3} value={personal.objective}
            onChange={e => setPersonal(p=>({...p,objective:e.target.value}))}
            placeholder="Brief summary about your goals and strengths…"
            style={{ resize:'vertical' }}/>
        </div>
      </div>
    </div>,

    /* ── STEP 1 · Education ── */
    <div key="education">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10 }}>
        <h3 style={SH}>تعلیم — Education</h3>
        <button className="btn btn-ghost" style={{ padding:'8px 14px', fontSize:13 }} onClick={addEdu}>
          <Plus size={14}/> Add Entry
        </button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {education.map((edu,i) => (
          <div key={i} style={{ padding:'18px 16px', background:'var(--section-alt)', borderRadius:12, border:`1px solid ${errors[`edu_degree_${i}`]||errors[`edu_institution_${i}`] ? 'var(--error)' : 'var(--border)'}`, position:'relative' }}>
            {education.length>1 && (
              <button onClick={()=>removeEdu(i)} style={{ position:'absolute', top:10, right:10, background:'none', border:'none', cursor:'pointer', color:'#dc3545', display:'flex', padding:4 }}>
                <Trash2 size={15}/>
              </button>
            )}
            <div style={GRID}>
              <div>
                <Label en="Degree / Qualification" ur="ڈگری" required/>
                <input className={`form-input${errors[`edu_degree_${i}`]?' error':''}`}
                  value={edu.degree}
                  onChange={e=>{ updateEdu(i,'degree',e.target.value); setErrors(er=>({...er,[`edu_degree_${i}`]:''})); }}
                  placeholder="Bachelor of Computer Science"/>
                <E field={`edu_degree_${i}`}/>
              </div>
              <div>
                <Label en="Institution" ur="ادارہ" required/>
                <input className={`form-input${errors[`edu_institution_${i}`]?' error':''}`}
                  value={edu.institution}
                  onChange={e=>{ updateEdu(i,'institution',e.target.value); setErrors(er=>({...er,[`edu_institution_${i}`]:''})); }}
                  placeholder="University of Karachi"/>
                <E field={`edu_institution_${i}`}/>
              </div>
              <div>
                <Label en="Passing Year" ur="سن فراغت"/>
                <input className="form-input" type="number" min="1990" max="2030"
                  value={edu.year} onChange={e=>updateEdu(i,'year',e.target.value)} placeholder="2024"/>
              </div>
              <div>
                <Label en="Grade / CGPA" ur="گریڈ"/>
                <input className="form-input" value={edu.grade}
                  onChange={e=>updateEdu(i,'grade',e.target.value)} placeholder="3.8 / 85%"/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>,

    /* ── STEP 2 · Experience ── */
    <div key="experience">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10 }}>
        <h3 style={SH}>کام کا تجربہ — Work Experience</h3>
        <button className="btn btn-ghost" style={{ padding:'8px 14px', fontSize:13 }} onClick={addExp}>
          <Plus size={14}/> Add Entry
        </button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {experience.map((exp,i) => (
          <div key={i} style={{ padding:'18px 16px', background:'var(--section-alt)', borderRadius:12, border:`1px solid ${errors[`exp_title_${i}`]||errors[`exp_company_${i}`] ? 'var(--error)' : 'var(--border)'}`, position:'relative' }}>
            {experience.length>1 && (
              <button onClick={()=>removeExp(i)} style={{ position:'absolute', top:10, right:10, background:'none', border:'none', cursor:'pointer', color:'#dc3545', display:'flex', padding:4 }}>
                <Trash2 size={15}/>
              </button>
            )}
            <div style={GRID}>
              <div>
                <Label en="Job Title" ur="عہدہ" required/>
                <input className={`form-input${errors[`exp_title_${i}`]?' error':''}`}
                  value={exp.title}
                  onChange={e=>{ updateExp(i,'title',e.target.value); setErrors(er=>({...er,[`exp_title_${i}`]:''})); }}
                  placeholder="Frontend Developer"/>
                <E field={`exp_title_${i}`}/>
              </div>
              <div>
                <Label en="Company" ur="کمپنی" required/>
                <input className={`form-input${errors[`exp_company_${i}`]?' error':''}`}
                  value={exp.company}
                  onChange={e=>{ updateExp(i,'company',e.target.value); setErrors(er=>({...er,[`exp_company_${i}`]:''})); }}
                  placeholder="Tech Solutions Pvt. Ltd."/>
                <E field={`exp_company_${i}`}/>
              </div>
              <div>
                <Label en="Start Date" ur="شروعات"/>
                <input className="form-input" type="date" value={exp.startDate}
                  onChange={e=>updateExp(i,'startDate',e.target.value)}/>
              </div>
              <div>
                <Label en="End Date" ur="اختتام"/>
                <input className="form-input" type="date" value={exp.endDate}
                  onChange={e=>updateExp(i,'endDate',e.target.value)} disabled={exp.current}/>
              </div>
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:8, margin:'10px 0', fontSize:14, cursor:'pointer', color:'var(--text)' }}>
              <input type="checkbox" checked={exp.current}
                onChange={e=>updateExp(i,'current',e.target.checked)}
                style={{ accentColor:'var(--primary)', width:16, height:16 }}/>
              I currently work here — ابھی یہاں کام کر رہا ہوں
            </label>
            <div>
              <Label en="Responsibilities / Description" ur="ذمہ داریاں"/>
              <textarea className="form-input" rows={3} value={exp.description}
                onChange={e=>updateExp(i,'description',e.target.value)}
                placeholder="Key responsibilities and achievements…"
                style={{ resize:'vertical' }}/>
            </div>
          </div>
        ))}
      </div>
    </div>,

    /* ── STEP 3 · Skills ── */
    <div key="skills">
      <h3 style={SH}>مہارت — Skills & Certifications</h3>
      <div style={GRID}>
        <div style={{ gridColumn:'1/-1' }}>
          <Label en="Technical Skills" ur="تکنیکی مہارتیں" hint="Separate with commas"/>
          <textarea className="form-input" rows={3} value={skills.technical}
            onChange={e=>setSkills(s=>({...s,technical:e.target.value}))}
            placeholder="React, Node.js, Python, Figma, Photoshop…"
            style={{ resize:'none' }}/>
        </div>
        <div>
          <Label en="Soft Skills" ur="نرم مہارتیں" hint="Commas"/>
          <textarea className="form-input" rows={3} value={skills.soft}
            onChange={e=>setSkills(s=>({...s,soft:e.target.value}))}
            placeholder="Leadership, Communication, Problem Solving…"
            style={{ resize:'none' }}/>
        </div>
        <div>
          <Label en="Languages Known" ur="زبانیں" required/>
          <input className={`form-input${errors.languages?' error':''}`}
            value={skills.languages}
            onChange={e=>{ setSkills(s=>({...s,languages:e.target.value})); setErrors(er=>({...er,languages:''})); }}
            placeholder="Urdu (Native), English (Fluent)"/>
          <E field="languages"/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <Label en="Certifications / Courses" ur="سرٹیفکیٹ / کورسز"/>
          <input className="form-input" value={skills.certifications}
            onChange={e=>setSkills(s=>({...s,certifications:e.target.value}))}
            placeholder="AWS Cloud Practitioner, Google Analytics…"/>
        </div>
      </div>
    </div>,

    /* ── STEP 4 · Photo ── */
    <div key="photo">
      <h3 style={SH}>تصویر — Profile Photo</h3>
      <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:20 }}>
        A professional headshot makes your CV stand out. Use a clear, front-facing photo with good lighting.
        <br/><span style={{ fontSize:13 }}>پیشہ ورانہ تصویر لگائیں جس میں چہرہ واضح ہو۔</span>
      </p>

      {photoPreview ? (
        <div style={{ textAlign:'center' }}>
          <img src={photoPreview} alt="Preview"
            style={{ width:150, height:150, borderRadius:'50%', objectFit:'cover', border:'4px solid var(--primary)', marginBottom:18, boxShadow:'var(--shadow)' }}/>
          <p style={{ color:'var(--green)', fontWeight:600, marginBottom:14, display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontSize:14 }}>
            <CheckCircle2 size={16}/> Photo ready — looks great!
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn btn-ghost" style={{ padding:'9px 16px', fontSize:13 }}
              onClick={()=>setShowCropper(true)}>
              Re-crop
            </button>
            <label className="btn btn-outline" style={{ padding:'9px 16px', fontSize:13, cursor:'pointer' }}>
              Change Photo
              <input type="file" accept="image/*" style={{ display:'none' }}
                onChange={e=>{ if(e.target.files[0]) handleFileSelect(e.target.files[0]); }}/>
            </label>
          </div>
        </div>
      ) : (
        <>
          <div className={`upload-zone${dragOver?' drag-over':''}${errors.photo?' '+'error':''}`}
            style={{ borderColor: errors.photo ? 'var(--error)' : '' }}
            onDragOver={e=>{e.preventDefault();setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false);if(e.dataTransfer.files[0])handleFileSelect(e.dataTransfer.files[0]);}}
            onClick={()=>document.getElementById('cv-photo-input').click()}>
            <Upload size={34} color={errors.photo?'var(--error)':'var(--primary)'} style={{ marginBottom:12, opacity:0.75 }}/>
            <p style={{ fontWeight:600, fontSize:15, marginBottom:5, color:'var(--text)' }}>Drag & drop or click to upload</p>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>PNG or JPG · up to 5 MB · passport-size recommended</p>
            <input id="cv-photo-input" type="file" accept="image/*" style={{ display:'none' }}
              onChange={e=>{ if(e.target.files[0]) handleFileSelect(e.target.files[0]); }}/>
          </div>
          <E field="photo"/>
        </>
      )}

      {/* WhatsApp attachment notice */}
      <div style={{ marginTop:20, padding:'14px 16px', background:'rgba(245,158,11,0.08)', borderRadius:12, border:'1px solid rgba(245,158,11,0.25)', display:'flex', gap:10, alignItems:'flex-start' }}>
        <AlertCircle size={16} color="#F59E0B" style={{ flexShrink:0, marginTop:2 }}/>
        <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.65 }}>
          <strong style={{ color:'var(--text)' }}>📎 Attachment Note:</strong> WhatsApp links cannot carry file attachments. After the chat opens, please <strong>manually send your photo</strong> in the same conversation. This ensures the owner receives your image directly.
        </p>
      </div>

      <div style={{ marginTop:14, padding:'14px 16px', background:'var(--accent-light)', borderRadius:12, border:'1px solid rgba(0,123,255,0.15)' }}>
        <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.65 }}>
          <strong style={{ color:'var(--accent)' }}>What happens next?</strong><br/>
          After payment, our team crafts your professional CV. The final PDF is ready within 24 hours.
        </p>
      </div>
    </div>,
  ];

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className="section">
      <div className="container" style={{ maxWidth:840 }}>

        {/* Page header */}
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(24px,4vw,34px)', fontWeight:800, marginBottom:6, color:'var(--text)' }}>
            Build Your Professional CV
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:15 }}>
            اپنی معلومات درج کریں — ڈیزائن اور فارمیٹنگ ہم کریں گے۔
          </p>
        </div>

        {/* Step indicator */}
        <div className="step-bar">
          {STEPS.map((s,i) => (
            <div key={s.id} className={`step-item${i===step?' active':''}${i<step?' done':''}`}>
              <div className="step-circle">
                {i<step ? <CheckCircle2 size={15}/> : s.icon}
              </div>
              <div className="step-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="card form-card-padding" style={{ padding:'28px 24px', marginBottom:20 }}>
          {stepContents[step]}
        </div>

        {/* Navigation */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
          <button className="btn btn-outline"
            onClick={()=>setStep(s=>Math.max(0,s-1))}
            disabled={step===0}
            style={{ opacity:step===0?0.35:1, padding:'12px 20px', flex:'0 0 auto' }}>
            ← Back
          </button>

          <span style={{ fontSize:12, color:'var(--text-muted)', textAlign:'center' }}>
            {step+1} / {STEPS.length}
          </span>

          {step < STEPS.length-1 ? (
            <button className="btn btn-primary" onClick={goNext} style={{ padding:'12px 20px', flex:'0 0 auto' }}>
              Next →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}
              style={{ padding:'12px 20px', background:'var(--green)', boxShadow:'0 4px 16px rgba(40,167,69,0.3)', flex:'0 0 auto' }}>
              {loading ? <><span className="loader"/> Submitting…</> : <><CheckCircle2 size={16}/> Submit CV</>}
            </button>
          )}
        </div>
      </div>

      {/* Cropper modal */}
      {showCropper && rawSrc && (
        <AdvancedCropper src={rawSrc} onDone={handleCropDone} onCancel={()=>setShowCropper(false)}/>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   SHARED STYLE CONSTANTS
════════════════════════════════════════ */
const SH   = { fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, marginBottom:18, color:'var(--text)' };
const GRID = { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14 };

/* ── Helper: inline label with hint ── */
function Label({ en, ur, required, hint }) {
  return (
    <div className="field-label-row">
      <span className="field-label-en">
        {en}{required && <span className="field-required"> *</span>}
        {hint && <span style={{ fontSize:11, color:'var(--text-muted)', marginLeft:5, fontWeight:400 }}>({hint})</span>}
      </span>
      {ur && <span className="urdu-label">{ur}</span>}
    </div>
  );
}