import React from 'react';;
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'
import { AsideDefault } from './components/aside/AsideDefault'
import { Footer } from './components/Footer'
import { HeaderWrapper } from './components/header/HeaderWrapper'
import { RightToolbar } from '../partials/layout/RightToolbar'
import { ScrollTop } from './components/ScrollTop'
import { Content } from './components/Content'
import { PageDataProvider, useLayout } from './core'
import { ActivityDrawer, DrawerMessenger, InviteUsers, ThemeModeProvider, UpgradePlan, } from '../partials'
import { MenuComponent } from '../assets/ts/components'
import { DefaultTitle } from './components/header/page-title/DefaultTitle';

const MasterLayout = () => {
  const location = useLocation()
  const { classes } = useLayout()
  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      MenuComponent.reinitialization()
    }, 500)
  }, [location.key])

  return (
    <PageDataProvider>
      <ThemeModeProvider>
        <div className='page d-flex flex-row flex-column-fluid'>
          <AsideDefault />
          <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'>
            <HeaderWrapper />
            <div
              className={`${classes.headerContainer.join(
                ' '
              )} py-6 py-lg-5 d-flex flex-column flex-lg-row align-items-lg-stretch justify-content-lg-between`}
            // style={{paddingTop: '30px'}0
            >
              <DefaultTitle />
            </div>
            <div id='kt_content' className='content py-lg-0 d-flex flex-column flex-column-fluid'>
              <div className='post d-flex flex-column-fluid' id='kt_post'>
                {/* <div id='kt_content' className='content d-flex flex-column flex-column-fluid'>
              <div className='post d-flex flex-column-fluid' id='kt_post'> */}
                <Content>
                  <Outlet />
                </Content>
              </div>
            </div>
            <Footer />
          </div>
        </div>

        {/* begin:: Drawers */}
        <ActivityDrawer />
        {/* <RightToolbar /> */}
        <DrawerMessenger />
        {/* end:: Drawers */}

        {/* begin:: Modals */}
        <InviteUsers />
        <UpgradePlan />
        {/* end:: Modals */}
        <ScrollTop />
      </ThemeModeProvider>
    </PageDataProvider>
  )
}

export { MasterLayout }
