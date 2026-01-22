// import React from 'react';
// import { ListViewProvider, useListView } from './core/ListViewProvider'
// import { QueryRequestProvider } from './core/QueryRequestProvider'
// import { QueryResponseProvider } from './core/QueryResponseProvider'
// import { UsersListHeader } from './components/header/UsersListHeader'
// import { UsersTable } from './table/UsersTable'
// import { UserEditModal } from './user-edit-modal/UserEditModal'
// import { KTCard } from '../../../../../_metronic/helpers'
// import { useAuth } from '../../../auth';
// import { ReviewTable } from './table/ReviewTable';

// const UsersList = () => {
//   const { fileUpload, userAssign, contractAssign } = useListView()
//   const { currentUser } = useAuth()
//   const Role = currentUser?.role
//   return (
//     <>
//       {Role == "Admin" ? (
//         <KTCard>
//           <UsersListHeader />
//           <UsersTable />
//         </KTCard>
//       ) : Role == "Manager" ? (
//         <KTCard>
//           <UsersListHeader />
//           <UsersTable />
//         </KTCard>
//       ) : (
//         <KTCard>
//           <UsersListHeader />
//           <ReviewTable />
//         </KTCard>
//       )}

//       {fileUpload === true && <UserEditModal />}
//       {userAssign === true && <UserEditModal />}
//       {contractAssign === true && <UserEditModal />}
//     </>
//   )
// }

// const UsersListWrapper = () => (
//   <QueryRequestProvider>
//     <QueryResponseProvider>
//       <ListViewProvider>
//         <UsersList />
//       </ListViewProvider>
//     </QueryResponseProvider>
//   </QueryRequestProvider>
// )

// export { UsersListWrapper }


import React from 'react';
import { ListViewProvider, useListView } from './core/ListViewProvider'
import { QueryRequestProvider } from './core/QueryRequestProvider'
import { QueryResponseProvider } from './core/QueryResponseProvider'
import { UsersListHeader } from './components/header/UsersListHeader'
import { UsersTable } from './table/UsersTable'
import { UserEditModal } from './user-edit-modal/UserEditModal'
import { useAuth } from '../../../auth';
import { ReviewTable } from './table/ReviewTable';
// import './ModernDocumentList.scss';  // Import modern styles
import './DocumentList.css'


// Modern Card Component (if not already available)
const ModernCard = ({ children, padding = 'lg', shadow = 'md', className = '' }) => {
  const paddingClass = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-0'  // No padding for card, content has its own padding
  }[padding];

  const shadowClass = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }[shadow];

  return (
    <div className={`modern-card ${paddingClass} ${shadowClass} ${className}`}>
      {children}
    </div>
  );
};

const ModernUsersList = () => {
  const { fileUpload, userAssign, contractAssign } = useListView();
  const { currentUser } = useAuth();
  const Role = currentUser?.role;

  return (
    <div className='modern-document-list'>
      <ModernCard padding='lg' shadow='md'>
        <UsersListHeader />
        {Role === 'Admin' || Role === 'Manager' ? (
          <UsersTable />
        ) : (
          <ReviewTable />
        )}
      </ModernCard>

      {/* Modals */}
      {fileUpload === true && <UserEditModal />}
      {userAssign === true && <UserEditModal />}
      {contractAssign === true && <UserEditModal />}
    </div>
  );
};

const UsersListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ModernUsersList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { UsersListWrapper, ModernUsersList };