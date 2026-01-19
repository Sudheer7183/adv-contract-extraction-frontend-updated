/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import { useLayout } from '../../core'
import { HeaderToolbar } from './HeaderToolbar'
import AppContext from '../../../../app/AppContext';
import { request, gql } from 'graphql-request'
import BASEURL from '../../../../app/config/baseurl';

const companyDetail = gql`
query{
  allSiteSetting{
    id
    companyName
    companyLogo
  }
}`


export function HeaderWrapper() {
  const { config, classes, attributes } = useLayout()
  const { aside } = config
  const { viewerPageActive } = useContext(AppContext);
  const [logo, setLogo] = useState("")

  useEffect(() => {
    request(`${BASEURL}graphql/`, companyDetail, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`})
      .then((res: any) => {
        if (res?.allSiteSetting && res.allSiteSetting.length > 0 && res.allSiteSetting[0]?.companyLogo) {
          setLogo(res.allSiteSetting[0].companyLogo)
        }
      })
      .catch((err) => {
        console.log('Error fetching company details:', err)
      })
  }, [])


  console.log("ToggleMenuclick", viewerPageActive)

  return (
    <div
      id='kt_header'
      className={clsx('header', classes.header.join(' '), 'align-items-stretch')}
      {...attributes.headerMenu}
    >
      {/* begin::Brand */}
      <div className='header-brand'>
        {/* <div className='header-brand' style={{ backgroundColor: '#00A4EF' }}> */}
        {aside.minimize && (
          <div
            id='kt_aside_toggle'
            className='btn btn-icon w-auto px-0 btn-active-color-primary aside-minimize'
            data-kt-toggle='true'
            data-kt-toggle-state='active'
            data-kt-toggle-target='body'
            data-kt-toggle-name='aside-minimize'
          >
            {viewerPageActive != true && (
              <>
                {/* <KTIcon iconName='bi bi-list' className='fs-1 text-white minimize-default' />
                <KTIcon iconName='bi bi-list' className='fs-1 text-white minimize-active' /> */}

                <KTIcon
                  iconName='bi bi-list'
                  className='fs-1 minimize-default text-gray-800 text-dark-mode-white'
                />
                <KTIcon
                  iconName='bi bi-list'
                  className='fs-1 minimize-active text-gray-800 text-dark-mode-white'
                />
              </>
            )}

          </div>
        )}
        {/* begin::Logo */}
        <div className='p-5'>
          <Link to='/'>
            {logo ? (
              <img
                alt='Logo'
                src={"http://127.0.0.1:8000/" + logo}
                className='h-50px h-lg-40px'
              />
            ) : (
              <img
                alt='Default Logo'
                src='/media/logos/Aavanam.png'
                className='h-50px h-lg-40px'
              />
            )}
          </Link>
        </div>
        {/* <div className='p-5'>
          <Link to='/'>
            <img
              alt='Logo'
              src={"http://127.0.0.1:8000/" + logo}
              // src='/media/logos/vanigamlogo.png'
              className='h-50px h-lg-25px'
            />
          </Link>
        </div> */}
        {/* end::Logo */}

        {/* begin::Aside toggle */}
        <div className='d-flex align-items-center d-lg-none ms-n3 me-1' style={{ color: 'white' }} title='Show aside menu'>
          <div
            className='btn btn-icon btn-active-color-primary w-30px h-30px'
            id='kt_aside_mobile_toggle'
          >
            <KTIcon iconName='abstract-14' className='fs-1' />
          </div>
        </div>
        {/* end::Aside toggle */}
      </div>
      {/* end::Brand */}
      <HeaderToolbar />
    </div>
  )
}
