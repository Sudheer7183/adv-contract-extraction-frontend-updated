/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, { FC } from 'react'
import { toAbsoluteUrl } from '../../../helpers'
import { useLang, setLanguage, setColor, useColor } from '../../../i18n/Metronici18n'


const colors = [
    {
        className: 'p-3 bg-primary text-white',
        name: 'Blue',
        flag: '/media/flags/united-states.svg',
    },
    // {
    //     className: 'p-3 bg-secondary text-white',
    //     name: 'Gray',
    //     flag: '/media/flags/china.svg',
    // },
    {
        className: 'p-3 bg-success text-white',
        name: 'Green',
        flag: '/media/flags/spain.svg',
    },
    {
        className: 'p-3 bg-danger text-white',
        name: 'Red',
        flag: '/media/flags/japan.svg',
    },
    {
        className: 'p-3 bg-warning text-dark',
        name: 'Yellow',
        flag: '/media/flags/germany.svg',
    },
    {
        className: 'p-3 bg-info text-white',
        name: 'Violet',
        flag: '/media/flags/france.svg',
    },
    // {
    //     className: 'p-3 bg-light text-dark',
    //     name: 'Light',
    //     flag: '/media/flags/france.svg',
    // }, {
    //     className: 'p-3 bg-dark text-white',
    //     name: 'Dark',
    //     flag: '/media/flags/france.svg',
    // }, {
    //     className: 'p-3 bg-white text-dark',
    //     name: 'White',
    //     flag: '/media/flags/france.svg',
    // },
]


const Colors: FC = () => {
    const color = localStorage.getItem("themeColor")
    const currentColor = colors.find((x) => x.className === color)
    const name = currentColor?.className + " " + 'w-15px h-15px rounded-2 ms-2'


    return (
        <div
            className='menu-item px-5'
            data-kt-menu-trigger='hover'
            data-kt-menu-placement='left-start'
            data-kt-menu-flip='bottom'
        >
            <a href='#' className='menu-link px-5'>
                <span className='menu-title position-relative'>
                    Theme
                    <span className='fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0'>
                        {currentColor?.name}{' '}
                        {/* <img
                            className='w-15px h-15px rounded-1 ms-2'
                            src={currentLanguage?.flag}
                            alt='metronic'
                        /> */}
                        {/* <img
                            className='w-15px h-15px rounded-1 ms-2'
                            src={currentLanguage?.flag}
                            alt='metronic'
                        /> */}
                        <span className={name}></span>
                    </span>
                </span>
            </a>


            <div className='menu-sub menu-sub-dropdown w-175px py-4'>
                {colors.map((l: any) => (
                    <div
                        className='menu-item px-3'
                        key={l.className}
                        onClick={() => {
                            setColor(l.className)
                        }}
                    >
                        <a
                            href='#'
                            className={clsx('menu-link d-flex px-5', { active: l.className === currentColor?.className })}
                        >
                            <span className='symbol symbol-20px me-4'>
                                <button className={l.className} ></button>


                                {/* <img className='rounded-1' src={l.flag} alt='metronic' /> */}
                            </span>
                            {l.name}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}


export { Colors }
