import React, { useEffect, useState } from 'react';
import { useListView } from '../../core/ListViewProvider'
import { KTIcon } from '../../../../../../../_metronic/helpers'

const RepositorySearchTypeDropDown = () => {
  const { setSmartSearchType } = useListView();
  const [searchType, setSearchType] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSearchType(newValue);
    // setsearchtype(newValue);
    console.log('Selected value:', newValue, typeof newValue);
  };

  // Sync local state with global searchtype when it changes externally
  useEffect(() => {
    setSmartSearchType(searchType);
    console.log('Updated searchtype:', searchType);
  }, [searchType]);

  return (
    <div className="card-title" style={{ paddingRight: '38rem' }}>
      <div className="d-flex align-items-center position-relative my-1">
        <KTIcon iconName="arrow-down" className="fs-1 position-absolute ms-6" />
        <select
          className="form-control form-control-solid w-250px ps-14"
          onChange={handleChange}
          value={searchType} // Controlled by local state, synced with global searchtype
        >
          <option value="">
            Choose Relevant Type
          </option>
          <option value="semantic">Semantic Search</option>
          <option value="ai-risk">File Based Search</option>
        </select>
      </div>
    </div>
  );
};

export { RepositorySearchTypeDropDown };
