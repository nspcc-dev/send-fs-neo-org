import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
		<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
			<App />
		</BrowserRouter>
  </StrictMode>,
)
