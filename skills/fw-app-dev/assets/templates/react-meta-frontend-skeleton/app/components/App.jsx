import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PlaceholderWrapper from './PlaceholderWrapper';
import Home from './Home';
import DemoPage from './DemoPage';

export default function App() {
  return (
    <PlaceholderWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/app/demo" element={<DemoPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </PlaceholderWrapper>
  );
}
