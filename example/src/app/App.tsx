import React, { Suspense, useEffect } from 'react';
import './App.css'
import { Outlet } from 'react-router-dom'
import { I18nProvider } from '../_metronic/i18n/i18nProvider'
import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core'
import { MasterInit } from '../_metronic/layout/MasterInit'
import { AuthInit, useAuth } from './modules/auth'
import { AppProvider } from './AppContext';

const App = () => {
  const { setCurrentUser } = useAuth()

  useEffect(() => {
    const user: any = localStorage.getItem('userDetails')

    setCurrentUser(JSON.parse(user));
  }, [])
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    .table-responsive::-webkit-scrollbar-track {
        background-color: #F3EEEA !important;
    }
    .table-responsive::-webkit-scrollbar-thumb {
        background-color: #A9A9A9 !important;
    }
    `;
  document.head.appendChild(styleElement);

  useEffect(() => {
    const color = localStorage.getItem("themeColorHex");
    if (color) {
      document.documentElement.style.setProperty("--accent", color);
    }
  }, []);

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <AppProvider>
        <I18nProvider>
          <LayoutProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
            </AuthInit>
          </LayoutProvider>
        </I18nProvider>
      </AppProvider>
    </Suspense>
  )
}

export { App }
