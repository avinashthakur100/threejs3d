import React, { Suspense } from 'react';
import Scene3D from './Scene3D';
import './index.css';

function App() {
  return (
    <div className="app-container">
      
      <div className="canvas-container">
        <Suspense fallback={<div style={{ color: '#d4af37', fontFamily: 'Cinzel, serif', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', letterSpacing: '4px' }}>UNEARTHING ARTIFACTS...</div>}>
          <Scene3D />
        </Suspense>
      </div>

      {/* Cinematic / Museum Header */}
      <div className="ui-container" style={{ height: 'auto', bottom: 'auto' }}>
        <header>
          <div className="logo">A N T I Q U I T Y</div>
          <nav>
            <ul>
              <li><a href="#exhibits">Exhibits</a></li>
              <li><a href="#history">History</a></li>
            </ul>
          </nav>
        </header>
      </div>
      
    </div>
  );
}

export default App;
