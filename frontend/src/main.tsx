import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ODMContextProvider } from './context/ODMContextProvider.tsx'

createRoot(document.getElementById("root")!).render(
  <ODMContextProvider>
    <App />
  </ODMContextProvider>,
);
