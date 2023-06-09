import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { QueryClientProvider, QueryClient } from "react-query";
import { ChoiceProvider } from './contexts/DialogContext';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnMount:true,
      retryDelay: 5000
    }
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserProvider>
        <ChoiceProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
        </ChoiceProvider>
      </UserProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

