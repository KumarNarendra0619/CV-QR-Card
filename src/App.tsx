
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Builder } from './pages/Builder';
import { PublicCV } from './pages/PublicCV';
import { IDCardView } from './pages/IDCardView';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/build/:id" element={<Builder />} />
        <Route path="/cv/:id" element={<PublicCV />} />
        <Route path="/card/:id" element={<IDCardView />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
