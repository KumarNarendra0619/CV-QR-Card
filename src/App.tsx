import { HashRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Builder } from './pages/Builder';
import { PublicCV } from './pages/PublicCV';
import { IDCardView } from './pages/IDCardView';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Routes>
          <Route path="/" element={<><Navbar /><Dashboard /></>} />
          <Route path="/build/:id" element={<Builder />} />
          <Route path="/cv/:id" element={<PublicCV />} />
          <Route path="/card/:id" element={<IDCardView />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
