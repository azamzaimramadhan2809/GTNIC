import { useEffect, useState, type ReactNode } from 'react';
import Login from './Pages/Auth/Login';
import { api, allPages, message, Session, type User, type Warung } from './api';
export function SessionGate({children}: {children: ReactNode}) {
  const [token, setToken] = useState(() => sessionStorage.getItem('nexa_token') ?? localStorage.getItem('nexa_token'));
  const [session, setSession] = useState<{user: User; warungs: Warung[]} | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  useEffect(() => { const clear=()=>{setToken(null);setSession(null);setSelected(null);}; window.addEventListener('nexa:logout',clear); return ()=>window.removeEventListener('nexa:logout',clear); }, []);
  useEffect(() => { if(!token) return; let active=true; Promise.all([api<{user:User}>('/user'), allPages<Warung>('/warungs','warungs')]).then(([u,warungs])=>{if(active){setSession({user:u.user,warungs});setError('');}}).catch(e=>{if(active)setError(message(e));}); return ()=>{active=false;}; },[token]);
  if(!token) return <Login onLoginSuccess={()=>setToken(sessionStorage.getItem('nexa_token') ?? localStorage.getItem('nexa_token'))} />;
  if(error) return <div role="alert" className="p-8">{error}<button className="block underline" onClick={()=>{sessionStorage.removeItem('nexa_token');localStorage.removeItem('nexa_token');window.dispatchEvent(new Event('nexa:logout'));}}>Kembali ke login</button></div>;
  if(!session) return <p className="p-8">Memuat toko...</p>;
  const warung=session.warungs.find(w=>w.id===selected) ?? (session.warungs.length===1 ? session.warungs[0] : null);
  if(!warung) return <div className="p-8 max-w-lg mx-auto"><h1 className="text-xl font-bold mb-4">Pilih toko</h1>{session.warungs.map(w=><button className="block p-3 border rounded-xl mb-2 w-full" key={w.id} onClick={()=>setSelected(w.id)}>{w.name}</button>)}{session.warungs.length===0 && <form onSubmit={async e=>{e.preventDefault();try{const result=await api<{warung:Warung}>('/warungs',{method:'POST',body:JSON.stringify({name})});setSession({...session,warungs:[result.warung]});}catch(e){setError(message(e));}}}><p className="mb-3">Akun ini belum memiliki toko. Masukkan nama usaha untuk mulai.</p><input required value={name} onChange={e=>setName(e.target.value)} className="border rounded p-2" placeholder="Nama toko"/><button className="p-2 bg-emerald-700 text-white rounded">Simpan</button></form>}</div>;
  return <Session.Provider value={{user:session.user,warung}}>{children}</Session.Provider>;
}
