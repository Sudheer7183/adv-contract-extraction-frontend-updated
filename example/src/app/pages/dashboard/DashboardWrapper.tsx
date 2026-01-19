import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import {
  StatisticsWidget5,
} from '../../../_metronic/partials/widgets'
import BarChartView from '../barcharts/BarChartView'
import FileBarChartView from '../barcharts/FileBarChartView'
import PieChartView from '../piecharts/FilePieChartView'
import DocPieChart from '../piecharts/DocPieChart'
import { request, gql } from 'graphql-request';
import BASEURL from '../../config/baseurl';

const SummaryData = gql`
query{
  summary{
    id
    projects
    files
    catalog
    contractType
    reviewerUser
  }
}`

const DashboardWrapper = () => {
  const intl = useIntl()
  const [summaryData, setSummaryData] = useState<any>({})
  useEffect(() => {
    request(`${BASEURL}graphql/`, SummaryData, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
      console.log("dashboard summary", res)
      setSummaryData(res.summary[0])
    })
  }, [])
  // const summaryData = jsonData.data.summary[0]; // Extract the summary data
  const themeColor1 = localStorage.getItem("themeColor")
  const getBackgroundColor = (classNames: any) => {
    const regex = /bg-(\w+)/;
    if (typeof classNames === 'string' && classNames.trim() !== '') {
      const match = classNames.match(regex);
      if (match && match[1]) {
        return match[0];
      }
    }
    return '';
  };

  const backgroundColor = getBackgroundColor(themeColor1);
  console.log("backgroundColor dashboard screen", backgroundColor);


  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      {/* <DashboardPage /> */}
      <div className='row g-5 g-xl-8' style={{ paddingLeft: '15px' }}>
        <div className='col-xl-2'>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-8'
            color={themeColor1 ? backgroundColor : 'bg-primary'}
            title='Projects'
            titleColor='white'
            textColor='white'
            count={summaryData.projects}
            cardWidth='250px'
            cardHeight='70px'
          />
        </div>
        <div className='col-xl-2'>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-8'
            color={themeColor1 ? backgroundColor : 'bg-primary'}
            title='Files'
            titleColor='white'
            textColor='white'
            count={summaryData.files}
            cardWidth='250px'
            cardHeight='70px'
          />
        </div>
        <div className='col-xl-2'>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-8'
            color={themeColor1 ? backgroundColor : 'bg-primary'}
            title='Catalogs'
            titleColor='white'
            textColor='white'
            count={summaryData.catalog}
            cardWidth='250px'
            cardHeight='70px'
          />
        </div>
        <div className='col-xl-2'>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-8'
            color={themeColor1 ? backgroundColor : 'bg-primary'}
            title='Contract Types'
            count={summaryData.contractType}
            titleColor='white'
            textColor='white'
            cardWidth='250px'
            cardHeight='70px'
          />
        </div>
        <div className='col-xl-2'>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-8'
            color={themeColor1 ? backgroundColor : 'bg-primary'}
            title='Reviewer Users'
            count={summaryData.reviewerUser}
            titleColor='white'
            textColor='white'
            cardWidth='250px'
            cardHeight='70px'
          />
        </div>
      </div>
      <div className="container-fluid">
        <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
          <li className="nav-item">
            <a className="nav-link active" data-bs-toggle="tab" href="#kt_tab_pane_1">
              Projects by Contract Type
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_pane_2">
              Files by Contract Type
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_pane_3">
              Files by Status
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_pane_4">
              Files by Contract Type
            </a>
          </li>
        </ul>


        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active text-center" id="kt_tab_pane_1" role="tabpanel">
            <BarChartView />
          </div>
          <div className="tab-pane fade text-center" id="kt_tab_pane_2" role="tabpanel">
            <FileBarChartView />
          </div>
          <div className="tab-pane fade text-center" id="kt_tab_pane_3" role="tabpanel">
            <PieChartView />
          </div>
          <div className="tab-pane fade text-center" id="kt_tab_pane_4" role="tabpanel">
            <DocPieChart />
          </div>
        </div>
      </div>

      {/* <div style={{ height: '59.7vh' }}>
        <div>
          <BarChartView />
          <FileBarChartView />
        </div>
        <div>
          <PieChartView />
          <DocPieChart />
        </div>
      </div> */}

    </>
  )
}

export { DashboardWrapper }
