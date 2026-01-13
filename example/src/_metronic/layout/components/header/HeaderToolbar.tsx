/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import noUiSlider from 'nouislider'
import { useLayout } from '../../core'
import { KTIcon } from '../../../helpers'
import { DefaultTitle } from './page-title/DefaultTitle'
import { HeaderUserMenu, ThemeModeSwitcher } from '../../../partials'
import { ThemeColor } from '../../../partials/layout/theme-mode/ThemeColor'
// import { ThemeModeSwitcher1 } from '../../../partials/layout/theme-adv/ThemeModeSwitcher'


const HeaderToolbar = () => {
  const { classes } = useLayout()
  const [status, setStatus] = useState<string>('1')
  const themeColor1 = localStorage.getItem("themeColor")
  const asideTheme11 = "asideTheme" + "-" + themeColor1 + " " + "toolbar d-flex align-items-stretch"



  useEffect(() => {
    const rangeSlider = document.querySelector('#kt_toolbar_slider')
    const rangeSliderValueElement = document.querySelector('#kt_toolbar_slider_value')


    if (!rangeSlider || !rangeSliderValueElement) {
      return
    }


    // @ts-ignore
    noUiSlider.create(rangeSlider, {
      start: [5],
      connect: [true, false],
      step: 1,
      format: {
        to: function (value) {
          const val = +value
          return Math.round(val).toString()
        },
        from: function (value) {
          return value
        },
      },
      range: {
        min: [1],
        max: [10],
      },
    })


    // @ts-ignore
    rangeSlider.noUiSlider.on('update', function (values, handle) {
      rangeSliderValueElement.innerHTML = values[handle]
    })


    const handle = rangeSlider.querySelector('.noUi-handle')
    if (handle) {
      handle.setAttribute('tabindex', '0')
    }


    // @ts-ignore
    handle.addEventListener('click', function () {
      // @ts-ignore
      this.focus()
    })


    // @ts-ignore
    handle.addEventListener('keydown', function (event) {
      // @ts-ignore
      const value = Number(rangeSlider.noUiSlider.get())
      // @ts-ignore
      switch (event.which) {
        case 37:
          // @ts-ignore
          rangeSlider.noUiSlider.set(value - 1)
          break
        case 39:
          // @ts-ignore
          rangeSlider.noUiSlider.set(value + 1)
          break
      }
    })
    return () => {
      // @ts-ignore
      rangeSlider.noUiSlider.destroy()
    }
  }, [])


  return (
    <div className={asideTheme11}>
      {/* <div className='toolbar d-flex align-items-stretch'
    // style={{ color: 'white' }}
    > */}
      {/* begin::Toolbar container */}
      <div
        className={`${classes.headerContainer.join(
          ' '
        )} py-6 py-lg-0 d-flex flex-column flex-lg-row align-items-lg-stretch justify-content-lg-between`}
      >
        {/* <DefaultTitle /> */}
        <div className='d-flex align-items-stretch overflow-auto pt-3 pt-lg-0'>

          <div className='d-flex'>
            {/* <div className=' d-flex align-items-center '>
              <ThemeModeSwitcher toggleBtnClass='btn btn-sm btn-icon btn-icon-muted btn-light btn-active-icon-dark' />
            </div> */}
            <div className='d-flex align-items-center'>
              {/* <span className='fs-7 text-gray-700 fw-bolder pe-3 d-xxl-block'>
              Quick Tools:
            </span> */}
              <div className='me-n2'>
                {/*begin::Action*/}
                {/* <a
                  href='#'
                  className='btn btn-icon btn-sm btn-active-color-primary mt-n2'
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-start'
                  data-kt-menu-overflow='false'
                >
                  <KTIcon iconName='setting-2' className='btn btn-sm btn-icon btn-icon-muted btn-light btn-active-icon-dark' />
                </a>


                <HeaderUserMenu /> */}
                {/*end::Action*/}
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex align-items-stretch overflow-auto pt-3 pt-lg-0'>

          <div className='d-flex align-items-center'>

            {/* <span className='fs-7 text-gray-700 fw-bolder pe-3 d-xxl-block'>
              Quick Tools:
            </span> */}

            <div className='d-flex align-items-center'>

              {/* <a
                href='#'
                className='btn btn-sm btn-icon btn-icon-muted btn-active-icon-secondary'
                data-bs-toggle='modal'
                data-bs-target='#kt_modal_invite_friends'
              >
              </a>&nbsp; */}

              {/* <div className='d-flex align-items-center'>
                <ThemeColor toggleBtnClass='btn btn-sm btn-icon btn-icon-muted btn-light btn-active-icon-primary' />
              </div> */}

              <div className='d-flex align-items-center'>
                <ThemeModeSwitcher toggleBtnClass='btn btn-sm btn-icon btn-icon-muted btn-light btn-active-icon-dark' />
                {/* <a href='#' className='btn btn-sm btn-icon btn-icon-muted btn-active-icon-primary'>
                  <KTIcon iconName='add-files' className='text-black fs-1' />
                </a> */}


              </div>
              <div className='d-flex align-items-center'>
                <a
                  href='#'
                  className='btn btn-icon btn-sm btn-active-color-primary mt-n2'
                  data-kt-menu-trigger='click'
                  data-kt-menu-placement='bottom-start'
                  data-kt-menu-overflow='false'
                >
                  <KTIcon iconName='setting-2' className='text-black fs-1' />
                </a>

                <HeaderUserMenu />

              </div>

              {/* <div className=' d-flex align-items-center '>
                <ThemeModeSwitcher toggleBtnClass='btn btn-sm btn-icon btn-icon-muted btn-light btn-active-icon-dark' />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}


export { HeaderToolbar }


