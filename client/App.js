import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Sparkles, Plus, Trash2, LayoutGrid, Check, RefreshCcw, X, LogIn, UserPlus } from 'lucide-react';

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
          <input type="email" placeholder="Email Address" style={s.input} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" style={s.input} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" style={s.shuffleBtn}>
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />} 
            {isLogin ? " ENTER CLOSET" : " CREATE ACCOUNT"}
          </button>
        </form>
        <p style={{marginTop: '20px', fontSize: '14px', color: '#4a306d'}}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)} style={{color: '#6366f1', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px'}}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// --- MAIN CLOSET COMPONENT ---
function Closet() {
  const [outfit, setOutfit] = useState({ coat: null, top: null, bottom: null, shoes: null, bag: null, accessory: null });
  const [inventory, setInventory] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("top");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const categories = ['coat', 'top', 'bottom', 'shoes', 'bag', 'accessory'];

  const fetchInventory = async () => {
    try {
        const res = await fetch('http://localhost:5000/all-items');
        const data = await res.json();
        setInventory(data);
    } catch(e) { console.log("Backend not connected"); }
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
      const res = await fetch('http://localhost:5000/add-item', { method: 'POST', body: formData });
      const data = await res.json();
      setOutfit(prev => ({ ...prev, [category]: data }));
      fetchInventory();
      setImgUrl(""); setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) { alert("Check server connection!"); }
  };

  const deleteItem = async (id) => {
    await fetch(`http://localhost:5000/delete-item/${id}`, { method: 'DELETE' });
    fetchInventory();
  };

  const shuffleAll = async () => {
    const res = await fetch('http://localhost:5000/shuffle');
    setOutfit(await res.json());
  };

  const shuffleCategory = async (cat) => {
    const res = await fetch(`http://localhost:5000/random/${cat}`);
    const data = await res.json();
    setOutfit(prev => ({ ...prev, [cat]: data }));
  };

  return (
    <div style={s.container}>
      <nav style={s.nav}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto'}}>
            <h1 style={s.logo}>MY<span style={{color: '#6366f1'}}>CLOSET</span></h1>
            <button onClick={() => navigate('/')} style={{background: 'none', border: '1px solid #4a306d', padding: '5px 15px', borderRadius: '8px', cursor: 'pointer'}}>Logout</button>
        </div>
      </nav>
      <div style={s.uploadBox}>
        <input ref={fileInputRef} id="file-upload" type="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: 'none' }} />
        <label htmlFor="file-upload" style={s.customUploadBtn}><Plus size={14} /> <span>{file ? "Photo Selected" : "Upload Photo"}</span></label>
        <span style={s.or}>OR</span>
        <input placeholder="Paste URL..." value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} style={s.input} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={s.select}>{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
        <button onClick={addItem} style={s.addBtn}><Plus size={16} /> Add</button>
      </div>
      <main style={s.main}>
        <div style={s.grid}>
          {categories.map((type) => (
            <div key={type} style={s.card}>
              <div style={s.label}>{type.toUpperCase()}</div>
              <button onClick={() => shuffleCategory(type)} style={s.miniShuffle}><RefreshCcw size={14} /></button>
              {outfit[type] ? <img src={outfit[type].image} style={s.img} alt={type} /> : <div style={s.empty}>Empty</div>}
            </div>
          ))}
        </div>
        <button onClick={shuffleAll} style={s.shuffleBtn}><Sparkles size={20} /> SHUFFLE FULL LOOK</button>
      </main>
