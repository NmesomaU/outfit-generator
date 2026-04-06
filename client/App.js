// --- UPDATED NAV STYLES ---
  nav: { 
    padding: '40px 25px',
    width: '100%' 
  },
  navInner: { 
    display: 'flex', 
    justifyContent: 'center', // <--- CHANGED: This pulls the logo to the exact middle
    alignItems: 'center', 
    maxWidth: '1000px', 
    margin: '0 auto',
    position: 'relative'    // <--- ADDED: This lets the logout button float independently
  },
  logoutBtn: { 
    position: 'absolute',     // <--- ADDED: Removes it from the "middle" calculation
    right: '0',               // <--- ADDED: Pins it to the far right of the nav bar
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
    margin: 0                 // <--- ADDED: Ensures no hidden spacing nudges the logo
  },
