import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Host from '@/pages/Host';
import Nominate from '@/pages/Nominate';
import Results from '@/pages/Results';
import { Toaster } from '@/components/ui/toaster';
import { config } from '@/config';

function App() {
  useEffect(() => {
    // Health check for frontend
    const checkHealth = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/health`);
        const data = await response.json();
        console.log('Backend health check:', data);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    // Check health every 5 minutes
    checkHealth();
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/host" element={<Host />} />
        <Route path="/nominate/:sessionId" element={<Nominate />} />
        <Route path="/results/:sessionId" element={<Results />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
