import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/main';
import Login from './components/login';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/main/*' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
