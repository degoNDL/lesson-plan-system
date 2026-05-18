import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ListPage from './pages/ListPage';
import FormPage from './pages/FormPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/lesson-plans" replace />} />
        <Route path="/lesson-plans" element={<ListPage />} />
        <Route path="/lesson-plans/new" element={<FormPage />} />
        <Route path="/lesson-plans/:id/edit" element={<FormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
