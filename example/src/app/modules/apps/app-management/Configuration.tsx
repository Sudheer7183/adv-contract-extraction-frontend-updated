
import React from 'react';
import { KTCard } from '../../../../_metronic/helpers'
import { QueryResponseProvider } from './users-list/core/QueryResponseProvider';
import { QueryRequestProvider } from './users-list/core/QueryRequestProvider';
import { ListViewProvider } from './users-list/core/ListViewProvider';
import Settings from './pages/Settings';
import Notification from './pages/Notification';
import { ServicesListWrapper } from './users-list/UsersList';
const Configuration = () => {
  return (
    <>
      <div>
        <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
          <li className="nav-item">
            <a className="nav-link active" data-bs-toggle="tab" href="#kt_tab_pane_8"
            >Site-Settings</a>
          </li>
          <li className="nav-item">
            <a className="nav-link " data-bs-toggle="tab" href="#kt_tab_pane_7"
            >Services</a>
          </li>
          <li className="nav-item">
            <a className="nav-link " data-bs-toggle="tab" href="#kt_tab_pane_9"
            >Notifications</a>
          </li>
        </ul>
      </div>
      <div className="tab-content" id="myTabContent">
        <div className="tab-pane fade" id="kt_tab_pane_7" role="tabpanel">
          <KTCard>
            <ServicesListWrapper />
          </KTCard>
        </div>
        <div className="tab-pane fade show active" id="kt_tab_pane_8" role="tabpanel">
          <KTCard>
            <Settings />
          </KTCard>
        </div>
        <div className="tab-pane fade" id="kt_tab_pane_9" role="tabpanel">
          <KTCard>
            <Notification />
          </KTCard>
        </div>
      </div>
    </>
  )
}

const ConfigurationWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <Configuration />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>


)

export { ConfigurationWrapper }
