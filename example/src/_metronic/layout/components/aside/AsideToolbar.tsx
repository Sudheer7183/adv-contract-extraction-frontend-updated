import { useAuth } from '../../../../app/modules/auth'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import { HeaderUserMenu, Search } from '../../../partials'
import React from 'react';

/* eslint-disable jsx-a11y/anchor-is-valid */
const AsideToolbar = () => {
  const { currentUser } = useAuth()

  return (
    <>
      {/*begin::User*/}
      <div>
        {/* <div className='aside-user d-flex align-items-sm-center justify-content-center py-5' style={{ borderTop: '1px solid #00A4EF' }}> */}
        {/*begin::Symbol*/}
        {/* <div className='symbol symbol-50px'>
          <img src='/media/avatars/300-1.jpg' alt='' />
        </div> */}
        {/*end::Symbol*/}

        {/*begin::Wrapper*/}
        <div className='aside-user-info flex-row-fluid flex-wrap ms-5'>
          {/*begin::Section*/}
          <div className='d-flex'>
            {/*begin::Info*/}
            <div className='flex-grow-1 me-2'>
              {/*begin::Username*/}
              {/* <a href='#' className='text-black text-hover-light fs-6 fw-bold'>
                {currentUser?.username}
              </a> */}
              {/*end::Username*/}

              {/*begin::Description*/}
              {/* <span className='text-white fw-bold d-block fs-8 mb-1'>{currentUser?.email}</span> */}
              {/*end::Description*/}

              {/*begin::Label*/}
              {/* <div className='d-flex align-items-center text-white fs-9'>
                <span className='bullet bullet-dot bg-success me-1'></span>online
              </div> */}
              {/*end::Label*/}
            </div>
            {/*end::Info*/}

            {/*begin::User menu*/}
            <div className='me-n2'>
              {/*begin::Action*/}
              {/* <a
                href='#'
                className='btn btn-icon btn-sm btn-active-color-primary mt-n2'
                data-kt-menu-trigger='click'
                data-kt-menu-placement='bottom-start'
                data-kt-menu-overflow='false'
              >
                <KTIcon iconName='setting-2' className='text-black fs-1' />
              </a> */}

              {/* <HeaderUserMenu /> */}
              {/*end::Action*/}
            </div>
            {/*end::User menu*/}
          </div>
          {/*end::Section*/}
        </div>
        {/*end::Wrapper*/}
      </div>
      {/*end::User*/}

      {/*begin::Aside search*/}
      {/* <div className='aside-search py-5'> */}
      <div className='py-5'>
        {/* <?php Theme::getView('partials/search/_inline', array(
        'class' => 'w-100',
        'menu-placement' => 'bottom-start',
        'responsive' => 'false'
    ))?> */}
        <Search />
      </div>
      {/*end::Aside search*/}
    </>
  )
}

export { AsideToolbar }
