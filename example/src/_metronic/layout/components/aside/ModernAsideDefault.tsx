import React, { FC } from 'react';
import { useLayout } from '../../core';
import { AsideMenu } from './AsideMenu';
import './ModernAsideDefault.scss';

const ModernAsideDefault: FC = () => {
  const { classes } = useLayout();

  return (
    <div
      id='kt_aside'
      className='modern-aside'
      data-kt-drawer='true'
      data-kt-drawer-name='aside'
      data-kt-drawer-activate='{default: true, lg: false}'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction='start'
      data-kt-drawer-toggle='#kt_aside_mobile_toggle'
    >
      {/* begin::Aside menu */}
      <div className='modern-aside-menu flex-column-fluid'>
        <AsideMenu asideMenuCSSClasses={classes.asideMenu} />
      </div>
      {/* end::Aside menu */}
    </div>
  );
};

export { ModernAsideDefault };
