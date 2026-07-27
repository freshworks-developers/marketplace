import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PlaceholderWrapper from './PlaceholderWrapper';
import Home from './Home';
import DemoPage from './DemoPage';

export default function App() {
  return (
    <PlaceholderWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/app/demo" element={<DemoPage />} />
        </Routes>
      </BrowserRouter>
    </PlaceholderWrapper>
  );
}
