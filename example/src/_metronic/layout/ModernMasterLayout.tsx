import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ModernAsideDefault } from './components/aside/ModernAsideDefault';
import { Footer } from './components/Footer';
import { ModernHeaderWrapper } from './components/header/ModernHeaderWrapper';
import { ScrollTop } from './components/ScrollTop';
import { PageDataProvider, useLayout } from './core';
import {
  ActivityDrawer,
  DrawerMessenger,
  InviteUsers,
  ThemeModeProvider,
  UpgradePlan,
} from '../partials';
import { MenuComponent } from '../assets/ts/components';
import { DefaultTitle } from './components/header/page-title/DefaultTitle';
import './ModernMasterLayout.scss';

const ModernMasterLayout = () => {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization();
    }, 500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization();
    }, 500);
  }, [location.key]);

  return (
    <PageDataProvider>
      <ThemeModeProvider>
        <div className='modern-page'>
          <ModernHeaderWrapper />
          <ModernAsideDefault />

          <div className='modern-wrapper' id='kt_wrapper'>
            <div className='modern-page-title-wrapper'>
              <DefaultTitle />
            </div>

            <div className='modern-content' id='kt_content'>
              <div className='modern-content-container'>
                <Outlet />
              </div>
            </div>

            <Footer />
          </div>
        </div>

        {/* begin:: Drawers */}
        <ActivityDrawer />
        <DrawerMessenger />
        {/* end:: Drawers */}

        {/* begin:: Modals */}
        <InviteUsers />
        <UpgradePlan />
        {/* end:: Modals */}

        <ScrollTop />
      </ThemeModeProvider>
    </PageDataProvider>
  );
};

export { ModernMasterLayout };
