import React from 'react';
import { useListView, ListViewProvider } from './core/ListViewProvider';
import { QueryRequestProvider } from './core/QueryRequestProvider';
import { QueryResponseProvider } from './core/QueryResponseProvider';
import { UsersListHeader } from './components/header/UsersListHeader';
import { ModernUsersTable } from './table/ModernUsersTable';
import { UserEditModal } from './user-edit-modal/UserEditModal';
import { useAuth } from '../../../auth';
import { ModernReviewTable } from './table/ModernReviewTable';
import { ModernCard } from '../../../../components/modern-ui';
import './ModernUsersList.scss';

const ModernUsersList = () => {
  const { itemIdForUpdate } = useListView();
  const { currentUser } = useAuth();

  const Role = currentUser?.role;

  return (
    <div className='modern-users-list'>
      <ModernCard padding='lg' shadow='md'>
        <UsersListHeader />
        {Role === 'Admin' || Role === 'Manager' ? (
          <ModernUsersTable />
        ) : (
          <ModernReviewTable />
        )}
      </ModernCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </div>
  );
};

const ModernUsersListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ModernUsersList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { ModernUsersList, ModernUsersListWrapper };
