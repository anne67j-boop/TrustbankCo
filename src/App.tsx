import React from 'react'

function App() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>TrustBankCo</h1>
        <p>Your digital banking experience starts here.</p>
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h2>Account Overview</h2>
          <p>Balance: ₦100,000</p>
          <button style={styles.button}>View Transactions</button>
        </section>

        <section style={styles.card}>
          <h2>Quick Actions</h2>
          <button style={styles.button}>Transfer Funds</button>
          <button style={styles.button}>Pay Bills</button>
        </section>
      </main>

      <footer style={styles.footer}>
        <small>© 2025 TrustBankCo. All rights reserved.</small>
      </footer>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'sans-serif',
    textAlign: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#004080',
    color: 'white',
    padding: '1rem',
  },
  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    padding: '2rem',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    width: '250px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#004080',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  footer: {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
  },
}

export default App
