import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="App" style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0f', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div 
        className="cyber-bg" 
        style={{ 
          position: 'fixed', 
          inset: '0', 
          opacity: '0.2',
          pointerEvents: 'none'
        }}
      ></div>
      <Dashboard />
    </div>
  );
}

export default App;
