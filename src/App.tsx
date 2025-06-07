import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import TwitterMonitoring from './components/TwitterMonitoring';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PerplexityUI from './components/PerplexityUI';
function App() {
  return (
    <div className="flex min-h-screen bg-background-dark">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/twitter" element={<TwitterMonitoring />} />
            <Route path="/chat" element={<PerplexityUI />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
