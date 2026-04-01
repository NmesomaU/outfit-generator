import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Plus, Trash2, LayoutGrid, Check, RefreshCcw, X } from 'lucide-react';

function App() {
  const [outfit, setOutfit] = useState({ 
    coat: null, top: null, bottom: null, shoes: null, bag: null, accessory: null 
  });
  const [inventory, setInventory] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("top");
  const fileInputRef = useRef(null);

  const categories = ['coat', 'top', 'bottom', 'shoes', 'bag', 'accessory'];

  const fetchInventory = async () => {
    const res = await fetch('http://localhost:5000/all-items');
    const data = await res.json();
    setInventory(data);
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
    } catch (err) { alert("Server error!"); }
  };

  const deleteItem = async (id, type) => {
    await fetch(`http://localhost:5000/delete-item/${id}`, { method: 'DELETE' });
    if (type) setOutfit(prev => ({ ...prev, [type]: null }));
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

  const clearOutfit = () => setOutfit({ coat: null, top: null, bottom: null, shoes: null, bag: null, accessory: null });

  return (
    <div style={s.container}>
      <nav style={s.nav}>
        <h1 style={s.logo}>MY<span style={{color: '#6366f1'}}>CLOSET</span></h1>
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
              {/* Individual Shuffle Button */}
              <button onClick={() => shuffleCategory(type)} style={s.miniShuffle} title="Shuffle this item">
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
        
        <div style={{display: 'flex', gap: '15px'}}>
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

const s = {
  container: { minHeight: '100vh', fontFamily: "'Quicksand', sans-serif", paddingBottom: '80px', backgroundColor: '#e2a89b', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.2'%3E%3Cpath d='M30 40 L70 40 L50 20 Z' /%3E%3Cpath d='M50 20 C 50 10, 60 10, 60 20' /%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '100px 100px', backgroundAttachment: 'fixed' },
  nav: { padding: '40px 25px', textAlign: 'center' },
  logo: { fontFamily: "'Montserrat', sans-serif", fontSize: '38px', fontWeight: '900', letterSpacing: '8px', textTransform: 'uppercase', color: '#4a306d' },
  uploadBox: { display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap', alignItems: 'center' },
  customUploadBtn: { background: '#fff', color: '#d946ef', padding: '10px 20px', borderRadius: '12px', border: '2px dashed #f5d0fe', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' },
  or: { fontWeight: 'bold', color: '#4a306d' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd' },
  select: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: 'white' },
  addBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
  main: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  card: { width: '250px', height: '300px', background: 'rgba(255,255,255,0.95)', borderRadius: '20px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' },
  label: { position: 'absolute', top: '12px', left: '12px', fontSize: '10px', fontWeight: '900', background: '#f5e6ff', color: '#6366f1', padding: '4px 10px', borderRadius: '10px' },
  miniShuffle: { position: 'absolute', top: '12px', right: '12px', background: 'white', border: '1px solid #eee', borderRadius: '50%', padding: '5px', cursor: 'pointer', color: '#6366f1' },
  img: { width: '85%', height: '85%', objectFit: 'contain' },
  empty: { color: '#bbb', fontStyle: 'italic' },
  shuffleBtn: { marginTop: '40px', background: '#d946ef', color: '#fff', padding: '15px 35px', borderRadius: '50px', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 20px rgba(217,70,239,0.3)', display: 'flex', alignItems: 'center', gap: '10px' },
  deleteBtn: { position: 'absolute', bottom: '12px', right: '12px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' },
  divider: { width: '80%', margin: '60px 0', border: '0', borderTop: '2px dashed rgba(74, 48, 109, 0.2)' },
  gallerySection: { width: '90%', maxWidth: '1000px', paddingBottom: '100px' },
  subTitle: { display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', color: '#4a306d', marginBottom: '40px' },
  categoryGroup: { marginBottom: '40px' },
  categoryHeader: { fontSize: '14px', letterSpacing: '3px', color: '#4a306d', borderBottom: '2px solid rgba(74, 48, 109, 0.1)', paddingBottom: '10px', marginBottom: '20px' },
  galleryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' },
  galleryCard: { background: 'white', padding: '10px', borderRadius: '15px', position: 'relative', cursor: 'pointer' },
  galleryImg: { width: '100%', height: '110px', objectFit: 'contain' },
  activeCheck: { position: 'absolute', top: '-8px', left: '-8px', background: '#6366f1', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  miniDelete: { position: 'absolute', top: '5px', right: '5px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '4px' }
};

export default App;
