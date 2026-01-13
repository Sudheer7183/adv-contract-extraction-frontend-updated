import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { KTIcon } from '../../../helpers';
import { useLayout } from '../../core';
import { HeaderToolbar } from './HeaderToolbar';
import AppContext from '../../../../app/AppContext';
import { request, gql } from 'graphql-request';
import BASEURL from '../../../../app/config/baseurl';
import './ModernHeaderWrapper.scss';

const companyDetail = gql`
  query {
    allSiteSetting {
      id
      companyName
      companyLogo
    }
  }
`;

export function ModernHeaderWrapper() {
  const { config, classes, attributes } = useLayout();
  const { aside } = config;
  const { viewerPageActive } = useContext(AppContext);
  const [logo, setLogo] = useState('');

  useEffect(() => {
    request(
      `${BASEURL}graphql/`,
      companyDetail,
      {},
      { Authorization: `Bearer ${localStorage.getItem('Token')}` }
    ).then((res: any) => {
      setLogo(res.allSiteSetting[0].companyLogo);
    }).catch(err => {
      console.log('Error fetching company details:', err);
    });
  }, []);

  return (
    <div
      id='kt_header'
      className={clsx('modern-header', classes.header.join(' '))}
      {...attributes.headerMenu}
    >
      {/* begin::Brand */}
      <div className='modern-header-brand'>
        {aside.minimize && (
          <div
            id='kt_aside_toggle'
            className='modern-aside-toggle'
            data-kt-toggle='true'
            data-kt-toggle-state='active'
            data-kt-toggle-target='body'
            data-kt-toggle-name='aside-minimize'
          >
            {viewerPageActive != true && (
              <button className='modern-toggle-btn'>
                <KTIcon iconName='bi bi-list' className='fs-1' />
              </button>
            )}
          </div>
        )}

        {/* begin::Logo */}
        <div className='modern-logo'>
          <Link to='/'>
            {logo ? (
              <img
                alt='Logo'
                src={'http://127.0.0.1:8000/' + logo}
                className='modern-logo-img'
              />
            ) : (
              <img
                alt='Default Logo'
                src='/media/logos/Aavanam.png'
                className='modern-logo-img'
              />
            )}
          </Link>
        </div>
        {/* end::Logo */}

        {/* begin::Aside toggle mobile */}
        <div className='modern-mobile-toggle' title='Show aside menu'>
          <div
            className='modern-mobile-toggle-btn'
            id='kt_aside_mobile_toggle'
          >
            <KTIcon iconName='abstract-14' className='fs-1' />
          </div>
        </div>
        {/* end::Aside toggle mobile */}
      </div>
      {/* end::Brand */}

      {/* begin::Toolbar */}
      <div className='modern-header-toolbar'>
        <HeaderToolbar />
      </div>
      {/* end::Toolbar */}
    </div>
  );
}
