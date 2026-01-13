/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { KTIcon } from '../../../helpers'

type Props = {
  className: string
  color: string
  title: string
  count: number
  titleColor?: string
  textColor?: string
  cardWidth?: string;
  cardHeight?: string;
}

const StatisticsWidget5: React.FC<Props> = ({
  className,
  color,
  title,
  titleColor,
  textColor,
  count,
  cardWidth,
  cardHeight,
}) => {
  const cardStyle: React.CSSProperties = {
    width: cardWidth || '200px',    // Set default width if not provided
    height: cardHeight || '300px',  // Set default height if not provided
  };
  return (
    <a href='#' className={`card ${color} hoverable ${className}`} style={cardStyle}>
      <div className='card-body d-flex flex-column align-items-center justify-content-center'>
        <div className={`text-${textColor}`} style={{ fontSize: '20px' }} >{count}</div>
        <div className={`text-${titleColor} fw-bold text-uppercase`} style={{ fontSize: '12.5px' }}>{title}</div>
      </div>
    </a>
  )
}

export { StatisticsWidget5 }
