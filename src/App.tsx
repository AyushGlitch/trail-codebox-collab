import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Workspace from './components/Workspace';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/room/:roomId" element={<Workspace />} />
        <Route path="/" element={<Navigate to="/room/demo" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 