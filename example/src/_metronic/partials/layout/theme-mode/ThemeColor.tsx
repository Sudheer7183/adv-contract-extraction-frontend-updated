import React from 'react';
import clsx from 'clsx'
import { KTIcon } from '../../../helpers'
import { ThemeModeComponent } from '../../../assets/ts/layout'
import { ThemeModeType, useThemeMode } from './ThemeModeProvider'

/* eslint-disable jsx-a11y/anchor-is-valid */
type Props = {
    toggleBtnClass?: string
    toggleBtnIconClass?: string
    menuPlacement?: string
    menuTrigger?: string
}

const systemMode = ThemeModeComponent.getSystemMode() as 'light' | 'dark'

const ThemeColor = ({
    toggleBtnClass = '',
    toggleBtnIconClass = 'fs-1',
    menuPlacement = 'bottom-end',
    menuTrigger = "{default: 'click', lg: 'hover'}",
}: Props) => {
    const { mode, menuMode, updateMode, updateMenuMode } = useThemeMode()
    const calculatedMode = mode === 'system' ? systemMode : mode

    const switchMode = (_mode: any) => {
        // updateMenuMode(_mode)
        console.log("mode1->", _mode);
        localStorage.setItem("themeColor", _mode)
        window.location.reload()


    }
    const themeColor1 = localStorage.getItem("themeColor")
    console.log("themeColor->", themeColor1);
    return (
        <>
            {/* begin::Menu toggle */}
            <a
                href='#'
                className={clsx('btn btn-icon ', toggleBtnClass)}
                data-kt-menu-trigger={menuTrigger}
                data-kt-menu-attach='parent'
                data-kt-menu-placement={menuPlacement}
            >
                {calculatedMode === 'dark' && (
                    <KTIcon iconName='moon' className={clsx('theme-light-hide', toggleBtnIconClass)} />
                )}

                {calculatedMode === 'light' && (
                    <KTIcon iconName='night-day' className={clsx('theme-dark-hide', toggleBtnIconClass)} />
                )}
            </a>
            {/* begin::Menu toggle */}

            {/* begin::Menu */}
            <div
                className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-muted menu-active-bg menu-state-primary fw-semibold py-4 fs-base w-175px'
                data-kt-menu='true'
            >

                <div>&nbsp;
                    <button className="p-3 mb-2 bg-primary text-white rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-primary text-white")}></button>
                    <button className="p-3 mb-2 bg-secondary text-white rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-secondary text-white")}></button>
                    <button className="p-3 mb-2 bg-success text-white rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-success text-white")}></button>
                    <button className="p-3 mb-2 bg-danger text-white rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-danger text-white")}></button>
                    <button className="p-3 mb-2 bg-warning text-dark rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-warning text-dark")}></button>
                    <button className="p-3 mb-2 bg-info text-white rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-info text-white")}></button>
                    <button className="p-3 mb-2 bg-light text-dark rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-light text-dark")}></button>
                    <button className="p-3 mb-2 bg-dark text-white rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-dark text-white")}></button>
                    <button className="p-3 mb-2 bg-white text-dark rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-white text-dark")}></button>


                    {/* <button className="p-3 mb-2 bg-primary text-white rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-primary text-white")}></button>&nbsp;
                    <button className="p-3 mb-2 bg-secondary text-white rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-secondary text-white")}></button>&nbsp;
                    <button className="p-3 mb-2 bg-info text-white rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-info text-white")}></button>&nbsp;
                    <button className="p-3 mb-2 bg-warning text-dark rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-warning text-dark")}></button>&nbsp;
                    <button className="p-3 mb-2 bg-success text-white rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-success text-white")}></button>&nbsp;
                    <button className="p-3 mb-2 bg-danger text-white rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-danger text-white")}></button>&nbsp;
                    <button className="p-3 mb-2 bg-warning text-dark rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-warning text-dark")}></button>&nbsp;
                    <button className="p-3 mb-2 bg-success text-white rounded-circle" onClick={() => switchMode("p-3 mb-2 bg-success text-white")}></button>&nbsp; */}
                </div>

            </div>

        </>
    )
}

export { ThemeColor }
