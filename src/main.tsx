import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.tsx'
import { BundleProvider } from '@/context/bundleContext.tsx'
import { defaultConfiguration } from '@/data/products.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BundleProvider defaultConfiguration={defaultConfiguration}>
      <App />
    </BundleProvider>
  </StrictMode>,
)
