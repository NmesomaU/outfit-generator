import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, LogIn, UserPlus, LogOut } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check if user is already logged in on page load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    const res = await fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    } else {
      alert(data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return (
      <div style={s.authScreen}>
        <form onSubmit={handleAuth} style={s.card}>
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={s.input} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={s.input} />
          <button type="submit" style={s.btn}>
            {isLogin ? <LogIn size={18}/> : <UserPlus size={18}/>} Proceed
          </button>
          <p onClick={() => setIsLogin(!isLogin)} style={s.toggle}>
            {isLogin ? "Need an account? Sign up" : "Have an account? Login"}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <nav style={s.nav}>
        <h1>MY CLOSET</h1>
        <button onClick={logout} style={s.logoutBtn}><LogOut size={16}/> Logout</button>
      </nav>
      {/* Your Closet components go here */}
      <div style={s.emptyState}>Welcome, {user.email}! Your closet is empty.</div>
    </div>
  );
}

const s = {
  authScreen: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2a89b' },
  card: { background: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', width: '300px' },
  input: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' },
  btn: { width: '100%', padding: '12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  toggle: { marginTop: '15px', fontSize: '14px', color: '#6366f1', cursor: 'pointer' },
  container: { minHeight: '100vh', backgroundColor: '#e2a89b' },
  nav: { display: 'flex', justifyContent: 'space-between', padding: '20px', alignItems: 'center' },
  logoutBtn: { background: 'white', border: '1px solid #4a306d', padding: '5px 15px', borderRadius: '8px', cursor: 'pointer' },
  emptyState: { textAlign: 'center', marginTop: '50px', color: '#4a306d' }
};
