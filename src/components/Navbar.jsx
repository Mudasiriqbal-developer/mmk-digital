import { useState } from 'react';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Shield, Sun, Moon, ChevronRight } from 'lucide-react';
import Logo from './Logo';

const NAV_LINKS = [
  { label: 'Home', page: 'home' },
  { label: 'CV Builder', page: 'cv' },
  {
    label: 'Services', page: null,
    children: [
      { label: 'Certificate Design', page: 'certificate' },
      { label: 'Online Job Apply', page: 'certificate' },
      { label: 'Printing Services', page: 'printing' },
      { label: 'Photo Editing', page: 'photo' },
      { label: 'Domicile Certificate', page: 'domicile' },
    ]
  },
];

export default function Navbar({ currentPage, navigate, user, onLogin, onLogout, darkMode, toggleDark }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const handleNav = (page) => {
    if (!page) return;
    navigate(page);
    setMobileOpen(false);
    setUserMenuOpen(false);
    setServicesOpen(false);
  };

  const activeService = ['certificate', 'printing', 'photo', 'domicile'].includes(currentPage);

  return (
    <>
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:1000,
        background: 'var(--nav-bg)',
        backdropFilter:'blur(14px)',
        borderBottom:'1px solid var(--border)',
        height:72, display:'flex', alignItems:'center',
        transition:'background 0.3s',
      }}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%' }}>

          {/* Logo */}
          <button onClick={() => handleNav('home')} style={{ background:'none', border:'none', cursor:'pointer', display:'flex' }}>
            <Logo size={36} />
          </button>

          {/* Desktop links */}
          <div style={{ display:'flex', alignItems:'center', gap:4 }} className="desktop-nav">
            {NAV_LINKS.map(link => (
              link.children ? (
                <div key="services" style={{ position:'relative' }}
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button style={{
                    background: activeService ? 'rgba(227,30,36,0.08)' : 'none',
                    border:'none', padding:'8px 16px', borderRadius:8,
                    fontFamily:'DM Sans,sans-serif', fontWeight: activeService ? 600 : 500,
                    fontSize:15, color: activeService ? 'var(--primary)' : 'var(--text)',
                    cursor:'pointer', display:'flex', alignItems:'center', gap:5,
                    transition:'all 0.18s',
                  }}>
                    {link.label} <ChevronDown size={14} style={{ transition:'transform 0.2s', transform: servicesOpen ? 'rotate(180deg)' : 'none' }} />
                  </button>
                  {servicesOpen && (
                    <div style={{
                      position:'absolute', top:'calc(100% + 4px)', left:0,
                      background:'var(--card-bg)', borderRadius:14,
                      border:'1px solid var(--border)',
                      boxShadow:'var(--shadow-lg)',
                      minWidth:220, overflow:'hidden', zIndex:200,
                      animation:'fadeUp 0.18s ease',
                    }}>
                      {link.children.map(child => (
                        <button key={child.page+child.label} onClick={() => handleNav(child.page)}
                          style={{
                            display:'block', width:'100%', padding:'11px 18px',
                            background: currentPage === child.page ? 'var(--primary-light)' : 'none',
                            border:'none', cursor:'pointer', textAlign:'left',
                            fontFamily:'DM Sans,sans-serif', fontWeight:500, fontSize:14,
                            color: currentPage === child.page ? 'var(--primary)' : 'var(--text)',
                            transition:'background 0.15s',
                          }}
                          onMouseEnter={e => { if(currentPage !== child.page) e.currentTarget.style.background='var(--section-alt)'; }}
                          onMouseLeave={e => { if(currentPage !== child.page) e.currentTarget.style.background='none'; }}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button key={link.page} onClick={() => handleNav(link.page)}
                  style={{
                    background: currentPage === link.page ? 'rgba(227,30,36,0.08)' : 'none',
                    border:'none', padding:'8px 16px', borderRadius:8,
                    fontFamily:'DM Sans,sans-serif',
                    fontWeight: currentPage === link.page ? 600 : 500,
                    fontSize:15,
                    color: currentPage === link.page ? 'var(--primary)' : 'var(--text)',
                    cursor:'pointer', transition:'all 0.18s',
                  }}>
                  {link.label}
                </button>
              )
            ))}
          </div>

          {/* Right side */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>

            {/* Dark mode toggle */}
            <button onClick={toggleDark}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                width:38, height:38, borderRadius:10,
                background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                border:'none', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'var(--text)', transition:'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}
            >
              {darkMode
                ? <Sun size={18} color="#F59E0B" />
                : <Moon size={18} color="#6b7280" />
              }
            </button>

            {/* User area */}
            {user ? (
              <div style={{ position:'relative' }}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display:'flex', alignItems:'center', gap:8,
                    background:'var(--primary-light)',
                    border:'1.5px solid rgba(227,30,36,0.2)',
                    borderRadius:10, padding:'7px 14px',
                    cursor:'pointer', fontFamily:'DM Sans,sans-serif',
                    fontSize:14, fontWeight:600, color:'var(--primary)',
                  }}>
                  <div style={{
                    width:26, height:26, borderRadius:'50%',
                    background:'var(--primary)', color:'#fff',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:12, fontWeight:700,
                  }}>
                    {user.name[0].toUpperCase()}
                  </div>
                  {user.name.split(' ')[0]}
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div style={{
                    position:'absolute', top:'calc(100% + 8px)', right:0,
                    background:'var(--card-bg)', borderRadius:12,
                    border:'1px solid var(--border)',
                    boxShadow:'var(--shadow-lg)',
                    minWidth:180, overflow:'hidden', zIndex:100,
                    animation:'fadeUp 0.2s ease',
                  }}>
                    <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                      <div style={{ fontWeight:600, fontSize:14, color:'var(--text)' }}>{user.name}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>{user.email}</div>
                    </div>
                    {user.role === 'admin'
                      ? <MenuItem icon={<Shield size={15}/>} label="Admin Panel" onClick={() => { handleNav('admin'); setUserMenuOpen(false); }} />
                      : <MenuItem icon={<LayoutDashboard size={15}/>} label="My Dashboard" onClick={() => { handleNav('dashboard'); setUserMenuOpen(false); }} />
                    }
                    <MenuItem icon={<LogOut size={15}/>} label="Logout" onClick={onLogout} danger />
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={onLogin} style={{ padding:'9px 16px' }}>
                  <User size={16}/> Login
                </button>
                <button className="btn btn-primary" onClick={onLogin} style={{ padding:'9px 18px' }}>
                  Get Started
                </button>
              </>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background:'none', border:'none', cursor:'pointer', display:'none', padding:6, color:'var(--text)' }}
              className="mobile-menu-btn">
              {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position:'fixed', top:72, left:0, right:0, bottom:0,
          background:'rgba(0,0,0,0.5)', zIndex:999,
          animation:'fadeIn 0.2s ease',
        }} onClick={() => setMobileOpen(false)}>
          <div style={{
            background:'var(--card-bg)', padding:'16px',
            display:'flex', flexDirection:'column', gap:2,
            boxShadow:'var(--shadow-lg)', maxHeight:'80vh', overflowY:'auto',
          }} onClick={e => e.stopPropagation()}>

            <MobileNavBtn label="Home" active={currentPage==='home'} onClick={() => handleNav('home')} />
            <MobileNavBtn label="CV Builder" active={currentPage==='cv'} onClick={() => handleNav('cv')} />

            {/* Services accordion */}
            <button onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              style={{
                background: activeService ? 'var(--primary-light)' : 'none',
                border:'none', padding:'13px 16px', borderRadius:10,
                display:'flex', alignItems:'center', justifyContent:'space-between',
                fontFamily:'DM Sans,sans-serif', fontWeight:500, fontSize:16,
                color: activeService ? 'var(--primary)' : 'var(--text)', cursor:'pointer',
              }}>
              Services
              <ChevronRight size={16} style={{ transform: mobileServicesOpen ? 'rotate(90deg)' : 'none', transition:'transform 0.2s' }} />
            </button>
            {mobileServicesOpen && (
              <div style={{ paddingLeft:12 }}>
                {NAV_LINKS[2].children.map(child => (
                  <MobileNavBtn key={child.label} label={child.label} active={currentPage===child.page}
                    onClick={() => handleNav(child.page)} small />
                ))}
              </div>
            )}

            <div style={{ borderTop:'1px solid var(--border)', marginTop:8, paddingTop:12, display:'flex', flexDirection:'column', gap:8 }}>
              <button onClick={toggleDark}
                style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'12px 16px', borderRadius:10, background:'none', border:'none',
                  cursor:'pointer', color:'var(--text)', fontFamily:'DM Sans', fontWeight:500, fontSize:15,
                }}>
                {darkMode ? <Sun size={18} color="#F59E0B"/> : <Moon size={18} color="#6b7280"/>}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              {user ? (
                <button onClick={onLogout} className="btn btn-outline" style={{ width:'100%', justifyContent:'center' }}>
                  <LogOut size={16}/> Logout
                </button>
              ) : (
                <button onClick={() => { onLogin(); setMobileOpen(false); }} className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}>
                  Login / Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width:768px) {
          .desktop-nav { display:none !important; }
          .mobile-menu-btn { display:flex !important; }
        }
      `}</style>
    </>
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick}
      style={{
        display:'flex', alignItems:'center', gap:10,
        width:'100%', padding:'11px 16px', background:'none', border:'none',
        cursor:'pointer', fontFamily:'DM Sans,sans-serif',
        fontSize:14, fontWeight:500,
        color: danger ? '#dc3545' : 'var(--text)',
        transition:'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? '#fff5f5' : 'var(--section-alt)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {icon} {label}
    </button>
  );
}

function MobileNavBtn({ label, active, onClick, small }) {
  return (
    <button onClick={onClick} style={{
      background: active ? 'var(--primary-light)' : 'none',
      border:'none', padding: small ? '10px 16px' : '13px 16px', borderRadius:10,
      textAlign:'left', fontFamily:'DM Sans,sans-serif',
      fontWeight:500, fontSize: small ? 15 : 16,
      color: active ? 'var(--primary)' : 'var(--text)', cursor:'pointer', width:'100%',
    }}>
      {label}
    </button>
  );
}