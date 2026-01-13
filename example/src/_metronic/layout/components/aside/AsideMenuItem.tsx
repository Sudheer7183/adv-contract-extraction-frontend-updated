import React, { FC } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { checkIsActive, KTIcon, WithChildren } from '../../../helpers'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
}

const AsideMenuItem: FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
}) => {
  const { pathname } = useLocation()
  const isActive = checkIsActive(pathname, to)
  const themeMode = localStorage.getItem("themeMode")

  console.log("themeMode->", themeMode);

  return (
    <div className='menu-item'>
      <Link className={themeMode == "light" ? clsx('menu-link without-sub hover-scale bg-active-dark', { active: isActive }) : clsx('menu-link without-sub hover-scale bg-active-light', { active: isActive })} to={to}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && (
          <span className='menu-icon'>
            <KTIcon iconName={icon} className={themeMode == "light" ? 'text-white fs-2' : 'text-dark fs-2'} />
          </span>
        )}
        {fontIcon && <i className={themeMode == "light" ? clsx('text-white fs-3', fontIcon) : clsx('text-dark fs-3', fontIcon)}></i>}
        <span className={themeMode == "light" ? 'menu-title text-white' : 'menu-title text-dark'}>{title}</span>
      </Link>
      {children}
    </div>
  )
}

export { AsideMenuItem }
