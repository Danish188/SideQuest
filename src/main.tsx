import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { QuestStoreProvider } from './hooks/useQuestStore';
import { ThemeProvider } from './hooks/useTheme';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element missing from index.html');

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <QuestStoreProvider>
          <App />
        </QuestStoreProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
