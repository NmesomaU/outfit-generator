import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Sparkles, Plus, Trash2, LayoutGrid, Check, RefreshCcw, X, LogIn, UserPlus } from 'lucide-react';

// YOUR RENDER URL
const API_BASE = "https://my-closet-server.onrender.com";

// --- AUTH COMPONENT (Login & Sign Up) ---
function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Logging in:", email);
      navigate('/closet');
    } else {
      console.log("Signing up:", email);
      alert("Account created! Now please log in.");
      setIsLogin(true);
    }
  };

  return (
    <div style={{...s.container, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '350px'}}>
        <h1 style={s.logo}>{isLogin ? "LOGIN" : "SIGN UP"}</h1>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px'}}>
          <input 
            type="email" 
            placeholder="Email Address" 
            style={s.input} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={s.input} 
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit" style={s.shuffleBtn}>
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />} 
            {isLogin ? " ENTER CLOSET" : " CREATE ACCOUNT"}
          </button>
        </form>
        
        <p style={{marginTop: '20px', fontSize: '14px', color: '#4a306d'}}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{color: '#6366f1', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px'}}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// --- MAIN CLOSET COMPONENT ---
function Closet() {
  const [outfit, setOutfit] = useState({ 
    coat: null, top: null, bottom: null, shoes: null, bag: null, accessory: null 
  });
  const [inventory, setInventory] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("top");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const categories = ['coat', 'top', 'bottom', 'shoes', 'bag', 'accessory'];

  const fetchInventory = async () => {
    try {
        const res = await fetch(`${API_BASE}/all-items`);
        const data = await res.json();
        setInventory(data);
    } catch(e) { console.log("Backend not connected yet or server is sleeping"); }
  };

  useEffect(() => { fetchInventory(); }, []);

  const selectItem = (item) => setOutfit(prev => ({ ...prev, [item.category]: item }));

  const addItem = async () => {
    if (!file && !imgUrl) return alert("Select a file or URL!");
    const formData = new FormData();
    formData.append('category', category);
    if (file) formData.append('image', file);
    else formData.append('image', imgUrl);

    try {
      const res = await fetch(`${API_BASE}/add-item`, { method: 'POST', body: formData });
      const data = await res.json();
      setOutfit(prev => ({ ...prev, [category]: data }));
      fetchInventory();
      setImgUrl(""); setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) { alert("Server error! Check if your Render service is active."); }
  };

  const deleteItem = async (id, type) => {
    await fetch(`${API_BASE}/delete-item/${id}`, { method: 'DELETE' });
    if (type) setOutfit(prev => ({ ...prev, [type]: null }));
    fetchInventory();
  };

  const shuffleAll = async () => {
    const res = await fetch(`${API_BASE}/shuffle`);
    setOutfit(await res.json());
  };

  const shuffleCategory = async (cat) => {
    const res = await fetch(`${API_BASE}/random/${cat}`);
    const data = await res.json();
    setOutfit(prev => ({ ...prev, [cat]: data }));
  };

  const clearOutfit = () => setOutfit({ coat: null, top: null, bottom: null, shoes: null, bag: null, accessory: null });

  return (
    <div style={s.container}>
      <nav style={s.nav}>
        <div style={s.navInner}>
            <h1 style={s.logo}>MY<span style={{color: '#6366f1'}}>CLOSET</span></h1>
            <button onClick={() => navigate('/')} style={s.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={s.uploadBox}>
        <input ref={fileInputRef} id="file-upload" type="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: 'none' }} />
        <label htmlFor="file-upload" style={s.customUploadBtn}>
          <Plus size={14} /> <span>{file ? "Photo Selected" : "Upload Photo"}</span>
        </label>
        <span style={s.or}>OR</span>
        <input placeholder="Paste URL..." value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} style={s.input} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={s.select}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button onClick={addItem} style={s.addBtn}><Plus size={16} /> Add</button>
      </div>

      <main style={s.main}>
        <div style={s.grid}>
          {categories.map((type) => (
            <div key={type} style={s.card}>
              <div style={s.label}>{type.toUpperCase()}</div>
              <button onClick={() => shuffleCategory(type)} style={s.miniShuffle}>
                <RefreshCcw size={14} />
              </button>
              {outfit[type] ? (
                <>
                  <img src={outfit[type].image} style={s.img} alt={type} />
                  <button onClick={() => setOutfit(prev => ({...prev, [type]: null}))} style={s.deleteBtn}><X size={16}/></button>
                </>
              ) : <div style={s.empty}>Empty</div>}
            </div>
          ))}
        </div>
        
        <div style={{display: 'flex', gap: '15px', marginTop: '30px'}}>
            <button onClick={shuffleAll} style={s.shuffleBtn}><Sparkles size={20} /> SHUFFLE FULL LOOK</button>
            <button onClick={clearOutfit} style={{...s.shuffleBtn, background: '#4a306d'}}>CLEAR</button>
        </div>

        <hr style={s.divider} />

        <section style={s.gallerySection}>
          <h2 style={s.subTitle}><LayoutGrid size={24} /> CLOSET INVENTORY</h2>
          {categories.map(cat => (
            <div key={cat} style={s.categoryGroup}>
              <h3 style={s.categoryHeader}>{cat.toUpperCase()}S</h3>
              <div style={s.galleryGrid}>
                {inventory.filter(i => i.category === cat).map((item) => (
                  <div key={item._id} 
                       style={{...s.galleryCard, border: outfit[cat]?._id === item._id ? '3px solid #6366f1' : '1px solid transparent'}}
                       onClick={() => selectItem(item)}>
                    <img src={item.image} style={s.galleryImg} alt="item" />
                    {outfit[cat]?._id === item._id && <div style={s.activeCheck}><Check size={12} color="white" /></div>}
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

// --- ROUTER ---
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/closet" element={<Closet />} />
      </Routes>
    </Router>
  );
}

// --- STYLES ---
const s = {
  container: { minHeight: '100vh', fontFamily: "'Quicksand', sans-serif", paddingBottom: '80px', backgroundColor: '#e2a89b' },
  nav: { padding: '40px 25px', width: '100%' },
  navInner: { display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '1000px', margin: '0 auto', position: 'relative' },
  logoutBtn: { position: 'absolute', right: '0', background: 'none', border: '1px solid #4a306d', padding: '5px 15px', borderRadius: '8px', cursor: 'pointer', color: '#4a306d', fontWeight: 'bold' },
  logo: { fontFamily: "'Montserrat', sans-serif", fontSize: '28px', fontWeight: '900', letterSpacing: '4px', color: '#4a306d', margin: 0 },
  uploadBox: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' },
  customUploadBtn: { background: '#fff', padding: '10px 20px', borderRadius: '12px', border: '2px dashed #ddd', cursor: 'pointer' },
  or: { alignSelf: 'center', fontWeight: 'bold' },
  input: { padding: '12px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' },
  select: { padding: '10px', borderRadius: '12px', border: '1px solid #ddd' },
  addBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer' },
  main: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  card: { width: '220px', height: '280px', background: '#fff', borderRadius: '20px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  label: { position: 'absolute', top: '10px', left: '10px', fontSize: '10px', background: '#eee', padding: '2px 8px', borderRadius: '5px' },
  miniShuffle: { position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer' },
  img: { width: '80%', height: '80%', objectFit: 'contain' },
  empty: { color: '#ccc' },
  shuffleBtn: { background: '#d946ef', color: '#fff', padding: '15px 30px', borderRadius: '50px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  deleteBtn: { position: 'absolute', bottom: '10px', right: '10px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '50%', padding: '5px' },
  divider: { width: '80%', margin: '40px 0', opacity: 0.2 },
  gallerySection: { width: '90%' },
  subTitle: { textAlign: 'center', color: '#4a306d', marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '10px' },
  categoryGroup: { marginBottom: '30px' },
  categoryHeader: { fontSize: '12px', color: '#4a306d', borderBottom: '1px solid #ccc', paddingBottom: '5px' },
  galleryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', marginTop: '15px' },
  galleryCard: { background: '#fff', padding: '10px', borderRadius: '12px', cursor: 'pointer', position: 'relative' },
  galleryImg: { width: '100%', height: '100px', objectFit: 'contain' },
  activeCheck: { position: 'absolute', top: '-5px', left: '-5px', background: '#6366f1', borderRadius: '50%', padding: '2px' },
  miniDelete: { position: 'absolute', top: '5px', right: '5px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '50%', padding: '2px' }
};
