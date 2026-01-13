import React, { useState } from 'react';
import { KTCard } from '../../../../_metronic/helpers'
import { QueryRequestProvider } from './contractType/users-list/core/QueryRequestProvider';
import { QueryResponseProvider } from './contractType/users-list/core/QueryResponseProvider';
import { ListViewProvider } from './contractType/users-list/core/ListViewProvider';

import ContractDetailPage from './contractType/ContractDetailPage';
import CatalogDetailPage from './catalogFile/CatalogDetailPage';
const CatalogManagementList = () => {

  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'catalog'||'contract'||'legal-contract'||'legal-catalog');

  const handleTabChange = (className: any) => {
    setActiveTab(className);
  };

  const storedActiveTab = localStorage.getItem('activeTab');
  console.log("ActiveTab --->", storedActiveTab)
  return (
    <>
      <div>
        <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">
          <li
            className="nav-item"
          >
            <a
              className={`nav-link ${activeTab === 'catalog' ? 'active' : ''}`}
              data-bs-toggle="tab" href="#kt_tab_pane_7"
              onClick={() => handleTabChange('catalog')}
            >Catalog</a>
          </li>
          <li
            className="nav-item"
          >
            <a
              className={`nav-link ${activeTab === 'contract' ? 'active' : ''}`}
              data-bs-toggle="tab" href="#kt_tab_pane_8"
              onClick={() => handleTabChange('contract')}
            >Contract Type</a>
          </li>
        </ul>
      </div>
      <div className="tab-content" id="myTabContent">
        <div
          className={`tab-pane fade ${activeTab === 'catalog' ? 'show active' : ''}`}
          id="kt_tab_pane_7" role="tabpanel">
          <KTCard>
            <CatalogDetailPage />
          </KTCard>
        </div>
        <div
          className={`tab-pane fade ${activeTab === 'contract' ? 'show active' : ''}`}
          id="kt_tab_pane_8" role="tabpanel">
          <KTCard>
            <ContractDetailPage />
          </KTCard>
        </div>
      </div>
    </>
  )
}

const CatalogManagementListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <CatalogManagementList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export { CatalogManagementListWrapper }

