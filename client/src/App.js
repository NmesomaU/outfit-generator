import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, LayoutGrid, Check, LogOut, XCircle } from 'lucide-react';

// 🚨 UPDATE THIS to your actual Render Server URL
const API_BASE_URL = "https://my-closet-app.onrender.com"; 

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ email: '', password: '' });

  const [outfit, setOutfit] = useState({ 
    coat: null, top: null, bottom: null, shoes: null, bag: null, accessory: null 
  });
  const [inventory, setInventory] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("top");

  const categories = ['coat', 'top', 'bottom', 'shoes', 'bag', 'accessory'];

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/all-items`);
      const data = await res.json();
      if (Array.isArray(data)) setInventory(data);
    } catch (err) { console.error("Gallery fetch failed", err); }
  };

  useEffect(() => { 
    if (user) fetchInventory(); 
  }, [user]);

  const handleAuth = async () => {
    const path = isLogin ? '/login' : '/signup';
    try {
      const res = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData)
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
      else alert(data.error || "Authentication failed");
    } catch (err) { alert("Server is waking up... try again in 30 seconds!"); }
  };

  const selectItem = (item) => {
    setOutfit(prev => ({ ...prev, [item.category]: item }));
  };

  const addItem = async () => {
    const formData = new FormData();
    formData.append('category', category);
    if (file) formData.append('image', file);
    else if (imgUrl) formData.append('image', imgUrl);
    else return alert("Select a file or URL!");

    try {
      await fetch(`${API_BASE_URL}/add-item`, { method: 'POST', body: formData });
      fetchInventory();
      setImgUrl(""); setFile(null);
    } catch (err) { alert("Upload failed!"); }
  };

  const deleteItem = async (id, type) => {
    try {
      await fetch(`${API_BASE_URL}/delete-item/${id}`, { method: 'DELETE' });
      if (type) setOutfit(prev => ({ ...prev, [type]: null }));
      fetchInventory();
    } catch (err) { console.error(err); }
  };

  const shuffle = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/shuffle`);
      const data = await res.json();
      setOutfit(data);
    } catch (err) { console.error(err); }
  };

  const clearAll = () => {
    setOutfit({ coat: null, top: null, bottom: null, shoes: null, bag: null, accessory: null });
  };

  if (!user) {
    return (
      <div style={s.authContainer}>
        <div style={s.authCard}>
          <h1 style={s.logo}>MY<span style={{color: '#6366f1'}}>CLOSET</span></h1>
          <h2 style={{fontSize: '18px', color: '#4a306d'}}>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <input placeholder="Email" style={s.input} onChange={e => setAuthData({...authData, email: e.target.value})} />
          <input type="password" placeholder="Password" style={s.input} onChange={e => setAuthData({...authData, password: e.target.value})} />
          <button onClick={handleAuth} style={s.addBtn}>{isLogin ? "Login" : "Sign Up"}</button>
          <p onClick={() => setIsLogin(!isLogin)} style={s.toggleAuth}>
            {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <nav style={s.nav}>
        <h1 style={s.logo}>MY<span style={{color: '#6366f1'}}>CLOSET</span></h1>
        <button onClick={() => setUser(null)} style={s.logoutBtn}><LogOut size={16} /> Logout</button>
      </nav>

      <div style={s.uploadBox}>
        <div style={{display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <input id="file-upload" type="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: 'none' }} />
          <label htmlFor="file-upload" style={s.customUploadBtn}>
            <Plus size={14} /> <span>{file ? "Photo Selected" : "Upload Photo"}</span>
          </label>
          <input placeholder="Paste URL..." value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} style={s.input} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={s.select}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button onClick={addItem} style={s.addBtn}><Plus size={16} /> Add</button>
        </div>
      </div>

      <main style={s.main}>
        <div style={s.grid}>
          {categories.map((type) => (
            <div key={type} style={s.card}>
              <div style={s.label}>{type.toUpperCase()}</div>
              {outfit[type] ? (
                <>
                  <img src={outfit[type].image} style={s.img} alt={type} />
                  <button onClick={() => deleteItem(outfit[type]._id, type)} style={s.deleteBtn}><Trash2 size={16}/></button>
                </>
              ) : <div style={s.empty}>Empty</div>}
            </div>
          ))}
        </div>
        
        <div style={{display: 'flex', gap: '15px'}}>
          <button onClick={shuffle} style={s.shuffleBtn}><Sparkles size={20} /> SHUFFLE</button>
          <button onClick={clearAll} style={s.clearBtn}><XCircle size={20} /> CLEAR ALL</button>
        </div>

        <hr style={s.divider} />

        <section style={s.gallerySection}>
          <h2 style={s.subTitle}><LayoutGrid size={24} /> CLOSET INVENTORY</h2>
          {categories.map(cat => (
            <div key={cat} style={{marginBottom: '30px'}}>
              <h3 style={s.categoryTitle}>{cat.toUpperCase()}</h3>
              <div style={s.galleryGrid}>
                {inventory.filter(item => item.category === cat).map((item) => (
                  <div 
                    key={item._id} 
                    style={{...s.galleryCard, border: outfit[item.category]?._id === item._id ? '3px solid #6366f1' : '1px solid transparent'}}
                    onClick={() => selectItem(item)}
                  >
                    <img src={item.image} style={s.galleryImg} alt="item" />
                    {outfit[item.category]?._id === item._id && <div style={s.activeCheck}><Check size={12} color="white" /></div>}
                    <button onClick={(e) => { e.stopPropagation(); deleteItem(item._id); }} style={s.miniDelete}><Trash2 size={12}/></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

const s = {
  container: { minHeight: '100vh', fontFamily: "'Quicksand', sans-serif", paddingBottom: '80px', backgroundColor: '#e2a89b' },
  authContainer: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2a89b' },
  authCard: { background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '15px', width: '320px' },
  toggleAuth: { cursor: 'pointer', fontSize: '13px', color: '#6366f1', marginTop: '10px', textDecoration: 'underline' },
  nav: { padding: '40px 25px', textAlign: 'center', position: 'relative' },
  logoutBtn: { position: 'absolute', top: '20px', right: '20px', background: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' },
  logo: { fontFamily: "'Montserrat', sans-serif", fontSize: '32px', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase', color: '#4a306d', margin: 0 },
  uploadBox: { padding: '0 20px', marginBottom: '40px' },
  customUploadBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#6366f1', padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', fontSize: '14px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd' },
  addBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  main: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', width: '90%', maxWidth: '800px' },
  card: { background: 'white', borderRadius: '15px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', aspectRatio: '1/1.2' },
  label: { position: 'absolute', top: '10px', left: '10px', fontSize: '9px', fontWeight: 'bold', color: '#6366f1' },
  img: { width: '80%', height: '80%', objectFit: 'contain' },
  empty: { color: '#ccc', fontSize: '12px' },
  shuffleBtn: { marginTop: '30px', background: '#d946ef', color: '#fff', padding: '15px 30px', borderRadius: '50px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  clearBtn: { marginTop: '30px', background: '#4a306d', color: '#fff', padding: '15px 30px', borderRadius: '50px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  deleteBtn: { position: 'absolute', bottom: '10px', right: '10px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer' },
  divider: { width: '80%', margin: '40px 0', border: '0', borderTop: '1px solid rgba(0,0,0,0.1)' },
  gallerySection: { width: '90%', maxWidth: '900px' },
  subTitle: { textAlign: 'center', color: '#4a306d', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  categoryTitle: { color: '#4a306d', fontSize: '14px', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px' },
  galleryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' },
  galleryCard: { background: 'white', padding: '8px', borderRadius: '12px', position: 'relative', cursor: 'pointer' },
  galleryImg: { width: '100%', height: '90px', objectFit: 'contain' },
  activeCheck: { position: 'absolute', top: '-5px', left: '-5px', background: '#6366f1', borderRadius: '50%', padding: '2px' },
  miniDelete: { position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,77,77,0.8)', color: 'white', border: 'none', borderRadius: '50%', padding: '3px' }
};

export default App;
