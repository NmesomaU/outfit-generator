import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, LogOut, Sparkles } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Auto-login if token exists
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    const path = isLogin ? '/login' : '/register';

    try {
      const res = await fetch(`http://localhost:5000${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
        } else {
          alert("Account created! Now please login.");
          setIsLogin(true);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server is down. Start your node server!");
    }
  };

  if (!user) {
    return (
      <div style={s.authPage}>
        <div style={s.authCard}>
          <h1 style={s.logo}>{isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}</h1>
          {error && <p style={{color: 'red', fontSize: '12px'}}>{error}</p>}
          <form onSubmit={handleAuth} style={s.form}>
            <input type="email" placeholder="Email" style={s.input} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" style={s.input} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" style={s.btn}>
              {isLogin ? <LogIn size={18}/> : <UserPlus size={18}/>} 
              {isLogin ? ' LOGIN' : ' SIGN UP'}
            </button>
          </form>
          <p onClick={() => setIsLogin(!isLogin)} style={s.toggle}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <nav style={s.nav}>
        <h1 style={s.logo}>MY CLOSET</h1>
        <button onClick={() => { localStorage.removeItem('user'); setUser(null); }} style={s.logout}>
          <LogOut size={16}/> Logout
        </button>
      </nav>
      <main style={s.main}>
        <div style={s.welcome}>Hello, {user.email}</div>
        <button style={s.shuffleBtn}><Sparkles size={18}/> SHUFFLE OUTFIT</button>
        {/* Put your Closet Grid code here */}
      </main>
    </div>
  );
}

const s = {
  authPage: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2a89b' },
  authCard: { background: 'white', padding: '40px', borderRadius: '24px', textAlign: 'center', width: '320px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
  logo: { fontSize: '24px', fontWeight: '900', color: '#4a306d', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' },
  btn: { padding: '12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  toggle: { marginTop: '20px', fontSize: '14px', color: '#6366f1', cursor: 'pointer' },
  container: { minHeight: '100vh', backgroundColor: '#e2a89b' },
  nav: { padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.2)' },
  logout: { background: 'none', border: '1px solid #4a306d', padding: '5px 15px', borderRadius: '8px', cursor: 'pointer' },
  main: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' },
  welcome: { fontSize: '18px', color: '#4a306d', marginBottom: '20px' },
  shuffleBtn: { background: '#d946ef', color: 'white', padding: '15px 30px', borderRadius: '50px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }
};
