import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, Printer, Package, Truck, AlertCircle,
  CheckCircle2, FileText, X, Palette,
  ZoomIn, ZoomOut, RotateCw, Crop, Move,
} from 'lucide-react';
import { waLink } from '../components/Footer';

/* ══════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════ */
const PAPER_SIZES = ['A4 (Standard)', 'A3', 'A5', 'Letter (8.5×11)', 'Legal (8.5×14)', 'Custom Size'];

const BINDING_OPTIONS = [
  { value:'none',     label:'No Binding',     urdu:'بغیر بائنڈنگ' },
  { value:'staple',   label:'Staple',         urdu:'اسٹیپل' },
  { value:'spiral',   label:'Spiral Binding', urdu:'اسپائرل' },
  { value:'tape',     label:'Tape Binding',   urdu:'ٹیپ' },
  { value:'laminate', label:'Lamination',     urdu:'لیمینیشن' },
];

const PRINT_STORAGE_KEY = 'mmk_print_draft';

/* ══════════════════════════════════════════════════════════
   ADVANCED IMAGE CROPPER
   — 8 resize handles, draggable selection, zoom
══════════════════════════════════════════════════════════ */
function AdvancedCropper({ src, onDone, onCancel }) {
  const containerRef = useRef(null);
  const imgRef       = useRef(null);
  const [imgLoaded,  setImgLoaded]  = useState(false);
  const [imgNatural, setImgNatural] = useState({ w:0, h:0 });
  const [zoom,       setZoom]       = useState(1);
  const [imgPos,     setImgPos]     = useState({ x:0, y:0 });
  const [sel,        setSel]        = useState({ x:40, y:40, w:160, h:160 });
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
    setImgPos({ x:(cSize-nat.w*s)/2, y:(cSize-nat.h*s)/2 });
  }, [imgLoaded, cSize]);

  const clamp = s => {
    let {x,y,w,h}=s; const mn=36;
    w=Math.max(mn,w); h=Math.max(mn,h);
    x=Math.max(0,Math.min(x,cSize-w)); y=Math.max(0,Math.min(y,cSize-h));
    return {x,y,w,h};
  };

  const getXY = e => {
    const r = containerRef.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x:p.clientX-r.left, y:p.clientY-r.top };
  };

  const onPD = (e, type) => {
    e.preventDefault(); e.stopPropagation();
    const {x,y} = getXY(e);
    dragState.current = { type, startX:x, startY:y, startSel:{...sel}, startImgPos:{...imgPos} };
  };

  const onPM = useCallback(e => {
    if (!dragState.current) return; e.preventDefault();
    const {x,y}=getXY(e); const {type,startSel,startImgPos}=dragState.current;
    const dx=x-dragState.current.startX, dy=y-dragState.current.startY;
    if (type==='img') { setImgPos({x:startImgPos.x+dx, y:startImgPos.y+dy}); }
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
        <div style={{padding:'13px 16px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
          <span style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:15,color:'var(--text)',display:'flex',alignItems:'center',gap:7}}>
            <Crop size={14} color="var(--primary)"/> Frame Your Image
          </span>
          <button onClick={onCancel} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex',padding:4}}><X size={17}/></button>
        </div>
        <div className="cropper-modal-body" style={{padding:'14px 12px',textAlign:'center'}}>
          <div ref={containerRef} style={{display:'inline-block',width:'100%',maxWidth:cSize}}>
            <div className="cropper-wrap" style={{width:cSize,height:cSize,position:'relative'}}
              onMouseDown={e=>onPD(e,'img')} onTouchStart={e=>onPD(e,'img')}>
              <img ref={imgRef} src={src} alt="" draggable={false} onLoad={()=>setImgLoaded(true)}
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
              if(!imgRef.current) return;
              const s=Math.min(cSize/imgRef.current.naturalWidth,cSize/imgRef.current.naturalHeight);
              setZoom(s); setImgPos({x:(cSize-imgRef.current.naturalWidth*s)/2,y:(cSize-imgRef.current.naturalHeight*s)/2});
            }}><RotateCw size={14}/></button>
          </div>
        </div>
        <div style={{padding:'12px 14px',borderTop:'1px solid var(--border)',display:'flex',gap:10,justifyContent:'flex-end',flexShrink:0}}>
          <button className="btn btn-outline" style={{padding:'9px 16px'}} onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" style={{padding:'9px 18px'}} onClick={handleDone}><CheckCircle2 size={14}/> Use Frame</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function PrintingPage({ navigate, showToast }) {
  const [files,       setFiles]       = useState([]);
  const [dragOver,    setDragOver]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [cropSrc,     setCropSrc]     = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [fileError,   setFileError]   = useState('');
  const [addrError,   setAddrError]   = useState('');

  const [options, setOptions] = useState({
    colorMode: 'color',
    paperSize: 'A4 (Standard)',
    sides:     'single',
    copies:    1,
    binding:   'none',
    delivery:  'pickup',
    address:   '',
    notes:     '',
  });

  const setOpt = (key, val) => setOptions(o => ({ ...o, [key]: val }));

  /* ── LocalStorage — persist options (not files, those are binary) ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PRINT_STORAGE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.options) setOptions(o => ({...o, ...d.options}));
        showToast('Print options restored ✓', 'success');
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(PRINT_STORAGE_KEY, JSON.stringify({ options })); } catch(e) {}
  }, [options]);

  /* ── File handling: images → AdvancedCropper, others → direct ── */
  const handleFileUpload = fileList => {
    setFileError('');
    Array.from(fileList).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => { setCropSrc(e.target.result); setShowCropper(true); };
        reader.readAsDataURL(file);
      } else {
        setFiles(prev => [...prev, file]);
      }
    });
  };

  const handleCropDone = (blob) => {
    const f = new File([blob], 'cropped_image.jpg', { type:'image/jpeg' });
    setFiles(prev => [...prev, f]);
    setShowCropper(false);
    showToast('Image added!', 'success');
  };

  const removeFile = i => setFiles(f => f.filter((_,idx) => idx !== i));

  /* ── Price estimator ── */
  const estimatedPrice = () => {
    const perPage     = options.colorMode==='color' ? 15 : 7;
    const copies      = Math.max(1, Number(options.copies) || 1);
    const deliveryFee = options.delivery==='delivery' ? 100 : 0;
    const bindingFee  = { none:0, staple:20, spiral:80, tape:30, laminate:50 }[options.binding] || 0;
    return perPage * copies + deliveryFee + bindingFee;
  };

  /* ── Submit with strict validation ── */
  const handleSubmit = async () => {
    let valid = true;
    if (files.length === 0) {
      setFileError('فائل ضروری ہے — Please upload at least one document.');
      valid = false;
    }
    if (options.delivery==='delivery' && !options.address.trim()) {
      setAddrError('پتہ ضروری ہے — Delivery address is required.');
      valid = false;
    }
    if (!valid) { showToast('Please fix the errors above.', 'error'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    localStorage.removeItem(PRINT_STORAGE_KEY);

    const msg =
`*Printing Order — MMK Digital Solution*
━━━━━━━━━━━━━━━━━━
🖨️ *Files (${files.length}):* ${files.map(f=>f.name).join(', ')}

🎨 *Color Mode:* ${options.colorMode==='color'?'Full Color (Rs. 15/page)':'Black & White (Rs. 7/page)'}
📄 *Paper Size:* ${options.paperSize}
📋 *Sides:* ${options.sides==='single'?'Single-Sided':'Double-Sided'}
📦 *Binding:* ${BINDING_OPTIONS.find(b=>b.value===options.binding)?.label}
🔢 *Copies:* ${options.copies}
🚚 *Delivery:* ${options.delivery==='pickup'?'Self-Pickup (Free)':'Home Delivery (+Rs. 100)'}
${options.delivery==='delivery'?`📍 *Address:* ${options.address}`:''}
${options.notes?`📝 *Notes:* ${options.notes}`:''}

💰 *Estimated Total:* Rs. ${estimatedPrice()}

⚠️ Note: Print files (PDF/images) cannot be sent via WhatsApp links. Please send your documents manually after this chat opens.

Please process my print order. Thank you!`;

    window.open(waLink(msg), '_blank');
    navigate('payment', {
      service: 'Printing Services',
      price:   estimatedPrice(),
      label:   `Printing — ${files.length} file${files.length!==1?'s':''}, ${options.colorMode==='color'?'Color':'B&W'}, ${options.copies} cop${options.copies>1?'ies':'y'}`,
    });
  };

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="section">
      <div className="container" style={{ maxWidth:960 }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(22px,4vw,34px)', fontWeight:800, marginBottom:6, color:'var(--text)' }}>
            Printing Services
          </h1>
          <p style={{ color:'var(--text-muted)', fontSize:15 }}>
            پرنٹنگ آرڈر دیں — پک اپ یا ہوم ڈلیوری دستیاب ہے۔
          </p>
        </div>

        {/* Two-column layout (stacks on mobile) */}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 290px', gap:20, alignItems:'start' }}>

          {/* ── LEFT: Main form ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

            {/* Upload */}
            <div className="card" style={{ padding:'20px 18px' }}>
              <h3 style={SH}>
                <Upload size={16} color="var(--primary)"/> دستاویز اپ لوڈ — Upload Documents
              </h3>

              <div className={`upload-zone${dragOver?' drag-over':''}`}
                style={{ borderColor:fileError?'var(--error)':'' }}
                onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={e=>{e.preventDefault();setDragOver(false);handleFileUpload(e.dataTransfer.files);}}
                onClick={()=>document.getElementById('print-files').click()}>
                <Printer size={30} color={fileError?'var(--error)':'var(--primary)'} style={{marginBottom:10,opacity:0.75}}/>
                <p style={{fontWeight:600,fontSize:14,marginBottom:4,color:'var(--text)'}}>Drop files here or click to upload</p>
                <p style={{fontSize:12,color:'var(--text-muted)'}}>PDF, DOC, DOCX, JPG, PNG · up to 50 MB · images open the advanced cropper</p>
                <input id="print-files" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style={{display:'none'}}
                  onChange={e=>handleFileUpload(e.target.files)}/>
              </div>
              {fileError && <div className="field-error-msg" style={{marginTop:6}}><AlertCircle size={12}/>{fileError}</div>}

              {files.length > 0 && (
                <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:7}}>
                  {files.map((file,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px',background:'var(--section-alt)',borderRadius:10,border:'1px solid var(--border)'}}>
                      <FileText size={14} color="var(--accent)"/>
                      <span style={{fontSize:13,flex:1,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{file.name}</span>
                      <span style={{fontSize:11,color:'var(--text-muted)',flexShrink:0}}>{(file.size/1024).toFixed(0)} KB</span>
                      <button onClick={()=>removeFile(i)}
                        style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex',padding:2,flexShrink:0}}>
                        <X size={13}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Print options */}
            <div className="card" style={{ padding:'20px 18px' }}>
              <h3 style={SH}><Palette size={16} color="var(--accent)"/> پرنٹ آپشن — Print Options</h3>

              {/* Color mode */}
              <div style={{marginBottom:18}}>
                <BLabel en="Color Mode" ur="رنگ"/>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:8}}>
                  {[
                    { id:'color', label:'🎨 Full Color',    desc:'Rs. 15/page' },
                    { id:'bw',    label:'⚫ Black & White', desc:'Rs. 7/page'  },
                  ].map(mode => (
                    <button key={mode.id} onClick={()=>setOpt('colorMode',mode.id)}
                      style={{
                        padding:'13px 10px', borderRadius:12, cursor:'pointer', textAlign:'center',
                        border:     options.colorMode===mode.id?'2px solid var(--primary)':'2px solid var(--border)',
                        background: options.colorMode===mode.id?'var(--primary-light)':'var(--card-bg)',
                        transition:'all 0.2s', minHeight:44,
                      }}>
                      <div style={{fontWeight:700,fontSize:13,marginBottom:3,color:options.colorMode===mode.id?'var(--primary)':'var(--text)'}}>{mode.label}</div>
                      <div style={{fontSize:11,color:'var(--text-muted)'}}>{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paper size */}
              <div style={{marginBottom:18}}>
                <BLabel en="Paper Size" ur="کاغذ کا سائز"/>
                <select className="form-select" style={{marginTop:6}} value={options.paperSize} onChange={e=>setOpt('paperSize',e.target.value)}>
                  {PAPER_SIZES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Sides */}
              <div style={{marginBottom:18}}>
                <BLabel en="Printing Sides" ur="جانب"/>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:8}}>
                  {[{ id:'single',label:'Single-Sided',urdu:'ایک طرف' },{ id:'double',label:'Double-Sided',urdu:'دو طرف' }].map(side=>(
                    <button key={side.id} onClick={()=>setOpt('sides',side.id)}
                      style={{
                        padding:'11px 8px', borderRadius:10, cursor:'pointer', textAlign:'center', minHeight:44,
                        border:     options.sides===side.id?'2px solid var(--accent)':'2px solid var(--border)',
                        background: options.sides===side.id?'var(--accent-light)':'var(--card-bg)',
                        fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:13,
                        color:      options.sides===side.id?'var(--accent)':'var(--text)',
                        transition:'all 0.2s',
                      }}>
                      <div>{side.label}</div>
                      <div style={{fontSize:11,color:'var(--text-muted)',direction:'rtl',marginTop:2}}>{side.urdu}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Binding */}
              <div style={{marginBottom:18}}>
                <BLabel en="Binding / Finishing" ur="بائنڈنگ"/>
                <select className="form-select" style={{marginTop:6}} value={options.binding} onChange={e=>setOpt('binding',e.target.value)}>
                  {BINDING_OPTIONS.map(b=>(
                    <option key={b.value} value={b.value}>{b.label} — {b.urdu}</option>
                  ))}
                </select>
              </div>

              {/* Copies */}
              <div>
                <BLabel en="Number of Copies" ur="کاپیاں"/>
                <input className="form-input" type="number" min="1" max="999"
                  style={{width:130, marginTop:6}}
                  value={options.copies}
                  onChange={e=>setOpt('copies',Math.max(1,parseInt(e.target.value)||1))}/>
              </div>
            </div>

            {/* Delivery */}
            <div className="card" style={{ padding:'20px 18px' }}>
              <h3 style={SH}><Truck size={16} color="var(--accent)"/> ڈلیوری — Delivery Option</h3>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                {[
                  { id:'pickup',   label:'🏪 Self-Pickup',   desc:'Free · 24 hrs', urdu:'خود اٹھائیں',  icon:<Package size={17}/> },
                  { id:'delivery', label:'🚚 Home Delivery',  desc:'+Rs. 100 fee',  urdu:'گھر پر ڈلیوری', icon:<Truck   size={17}/> },
                ].map(opt=>(
                  <button key={opt.id} onClick={()=>{ setOpt('delivery',opt.id); setAddrError(''); }}
                    style={{
                      padding:'14px 10px', borderRadius:12, cursor:'pointer', textAlign:'center',
                      border:     options.delivery===opt.id?'2px solid var(--accent)':'2px solid var(--border)',
                      background: options.delivery===opt.id?'var(--accent-light)':'var(--card-bg)',
                      transition:'all 0.2s', fontFamily:'DM Sans,sans-serif', minHeight:44,
                    }}>
                    <div style={{color:options.delivery===opt.id?'var(--accent)':'var(--text-muted)',marginBottom:4,display:'flex',justifyContent:'center'}}>{opt.icon}</div>
                    <div style={{fontWeight:700,fontSize:13,color:options.delivery===opt.id?'var(--accent)':'var(--text)',marginBottom:2}}>{opt.label}</div>
                    <div style={{fontSize:11,color:'var(--text-muted)'}}>{opt.desc}</div>
                    <div style={{fontSize:11,color:'var(--text-muted)',direction:'rtl',marginTop:2}}>{opt.urdu}</div>
                  </button>
                ))}
              </div>

              {options.delivery==='delivery' && (
                <div style={{marginBottom:14}}>
                  <BLabel en="Delivery Address" ur="گھر کا پتہ" required/>
                  <textarea className={`form-input${addrError?' error':''}`} rows={3}
                    style={{marginTop:6, resize:'vertical'}}
                    value={options.address}
                    onChange={e=>{ setOpt('address',e.target.value); setAddrError(''); }}
                    placeholder="House #, Street, Area, City, Postal Code"/>
                  {addrError && <div className="field-error-msg" style={{marginTop:4}}><AlertCircle size={12}/>{addrError}</div>}
                </div>
              )}

              <div>
                <BLabel en="Special Instructions (Optional)" ur="خاص ہدایات"/>
                <textarea className="form-input" rows={2}
                  style={{marginTop:6, resize:'vertical'}}
                  value={options.notes}
                  onChange={e=>setOpt('notes',e.target.value)}
                  placeholder="Any specific requirements or notes…"/>
              </div>
            </div>

            {/* WhatsApp attachment notice */}
            <div style={{padding:'13px 16px',background:'rgba(245,158,11,0.07)',border:'1px solid rgba(245,158,11,0.22)',borderRadius:12,display:'flex',gap:10,alignItems:'flex-start'}}>
              <AlertCircle size={15} color="#F59E0B" style={{flexShrink:0,marginTop:2}}/>
              <p style={{fontSize:13,color:'var(--text-muted)',lineHeight:1.65}}>
                <strong style={{color:'var(--text)'}}>📎 Attachment Note:</strong> WhatsApp links cannot carry file attachments. After clicking "Place Order", the chat will open — please <strong>manually send your print files (PDF/images)</strong> in that conversation so the owner receives them directly.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Order summary (sticky) ── */}
          <div style={{ position:'sticky', top:90 }}>
            <div className="card" style={{ padding:'20px 18px' }}>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:700, marginBottom:16, color:'var(--text)' }}>
                آرڈر خلاصہ — Order Summary
              </h3>

              <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
                <SRow label="Files"      value={`${files.length} doc${files.length!==1?'s':''}`}/>
                <SRow label="Color"      value={options.colorMode==='color'?'Full Color':'B&W'}/>
                <SRow label="Paper"      value={options.paperSize}/>
                <SRow label="Sides"      value={options.sides==='single'?'Single':'Double'}/>
                <SRow label="Binding"    value={BINDING_OPTIONS.find(b=>b.value===options.binding)?.label||'None'}/>
                <SRow label="Copies"     value={options.copies}/>
                <SRow label="Delivery"   value={options.delivery==='pickup'?'Self-Pickup':'Home Delivery'}/>
              </div>

              <div style={{borderTop:'1px solid var(--border)',paddingTop:14,marginBottom:16}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontWeight:700,fontSize:14,color:'var(--text)'}}>Total Est.</span>
                  <span style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,color:'var(--primary)'}}>
                    Rs. {estimatedPrice()}
                  </span>
                </div>
                <p style={{fontSize:11,color:'var(--text-muted)',marginTop:5}}>* Varies by page count</p>
              </div>

              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}
                style={{width:'100%',justifyContent:'center',padding:'13px',fontSize:14}}>
                {loading ? <><span className="loader"/> Placing…</> : <><Printer size={16}/> Place Print Order</>}
              </button>
            </div>

            <div style={{marginTop:14,padding:'13px 15px',background:'var(--section-alt)',borderRadius:12,border:'1px solid var(--border)'}}>
              <p style={{fontSize:12,color:'var(--text-muted)',lineHeight:1.65}}>
                💡 <strong style={{color:'var(--text)'}}>Tip:</strong> PDF files give the best print quality. Convert Word/PowerPoint to PDF before uploading.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile: stack columns */}
        <style>{`@media(max-width:720px){ .container > div[style*="grid-template-columns:minmax"] { grid-template-columns:1fr !important; } }`}</style>
      </div>

      {showCropper && cropSrc && (
        <AdvancedCropper src={cropSrc} onDone={handleCropDone} onCancel={()=>setShowCropper(false)}/>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
const SH = { fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700, marginBottom:16, color:'var(--text)', display:'flex', alignItems:'center', gap:7 };

function BLabel({ en, ur, required }) {
  return (
    <div className="field-label-row">
      <span className="field-label-en">{en}{required&&<span className="field-required"> *</span>}</span>
      {ur && <span className="urdu-label">{ur}</span>}
    </div>
  );
}

function SRow({ label, value }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',fontSize:13}}>
      <span style={{color:'var(--text-muted)'}}>{label}</span>
      <span style={{fontWeight:600,color:'var(--text)',textAlign:'right',maxWidth:'58%'}}>{value}</span>
    </div>
  );
}