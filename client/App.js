// --- UPDATED CLOSET COMPONENT (Focusing on the Nav section) ---
function Closet() {
  // ... (keep all your existing useState and functions the same)

  return (
    <div style={s.container}>
      <nav style={s.nav}>
        <div style={s.navInner}>
            {/* The Logo is now centered because of s.navInner */}
            <h1 style={s.logo}>MY<span style={{color: '#6366f1'}}>CLOSET</span></h1>
            
            {/* Logout button is positioned absolutely to the right */}
            <button 
              onClick={() => navigate('/')} 
              style={s.logoutBtn}>
              Logout
            </button>
        </div>
      </nav>

      {/* ... rest of your code stays exactly as you had it */}
      <div style={s.uploadBox}>
         {/* ... */}
      </div>
    </div>
  );
}

// --- UPDATED STYLES ---
// Replace your existing 's' object styles with these specific updates:
const s = {
  container: { minHeight: '100vh', fontFamily: "'Quicksand', sans-serif", paddingBottom: '80px', backgroundColor: '#e2a89b' },
  
  // Updated Nav Styles
  nav: { 
    padding: '40px 25px',
    width: '100%' 
  },
  navInner: { 
    display: 'flex', 
    justifyContent: 'center', // Centers the Logo
    alignItems: 'center', 
    maxWidth: '1000px', 
    margin: '0 auto',
    position: 'relative'    // Allows the logout button to sit on top of this container
  },
  logoutBtn: { 
    position: 'absolute',     // Takes it out of the center flow
    right: '0',               // Pins it to the right side of navInner
    background: 'none', 
    border: '1px solid #4a306d', 
    padding: '5px 15px', 
    borderRadius: '8px', 
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#4a306d'
  },
  
  logo: { 
    fontFamily: "'Montserrat', sans-serif", 
    fontSize: '28px', 
    fontWeight: '900', 
    letterSpacing: '4px', 
    color: '#4a306d',
    margin: 0                 // Removes default margins to keep centering perfect
  },

  // ... (keep the rest of your s.uploadBox, s.grid, s.card, etc. exactly the same)
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
