import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import TwitterMonitoring from './components/TwitterMonitoring';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PerplexityUI from './components/PerplexityUI';
import ArticleScraper from './components/ArticleScraper';
function App() {
  return (
    <div className="flex min-h-screen bg-background-dark">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<ArticleScraper />} />
            <Route path="/twitter" element={<TwitterMonitoring />} />
            <Route path="/chat" element={<PerplexityUI />} />
            <Route path="/article-scraper" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
