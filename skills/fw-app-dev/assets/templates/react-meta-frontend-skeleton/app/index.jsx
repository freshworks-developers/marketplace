import { createRoot } from 'react-dom/client';
import { DewTheme } from '@freshworks/dew-components';
import '@freshworks/dew-styles/dist/colors.css';
import '@freshworks/dew-styles/dist/fonts.css';
import '@freshworks/dew-styles/dist/numbers.css';
import './styles/app.css';
import App from './components/App';

const root = createRoot(document.getElementById('root'));
root.render(
  <DewTheme>
    <App />
  </DewTheme>
);
