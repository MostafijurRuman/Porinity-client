import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Routes/Router.jsx'
import AuthProvider from './Providers/AuthProvider.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)