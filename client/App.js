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
  nav: { 
    padding: '40px 25px', 
    display: 'flex',           // Enables Flexbox
    justifyContent: 'center',  // Centers horizontally
    alignItems: 'center',      // Centers vertically
    width: '100%' 
  },
  logo: { 
    fontFamily: "'Montserrat', sans-serif", 
    fontSize: '38px', 
    fontWeight: '900', 
    letterSpacing: '8px', 
    textTransform: 'uppercase', 
    color: '#4a306d',
    textAlign: 'center',       // Ensures text inside is centered
    margin: '0 auto'           // Double-check for centering
  },
};
