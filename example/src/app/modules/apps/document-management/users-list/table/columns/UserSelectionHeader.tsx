import React, { FC, PropsWithChildren, useState } from 'react'
import { HeaderProps } from 'react-table'
import { useListView } from '../../core/ListViewProvider'
import { User } from '../../core/_models'
import { BsCaretDownFill } from "react-icons/bs";
import request, { gql } from 'graphql-request';
import BASEURL from '../../../../../../config/baseurl';
import './style.css';


type Props = {
  tableProps: PropsWithChildren<HeaderProps<User>>
}

const FILE_STATUS = gql`
query listFilesStatus($filestatus: [String], $projectid: String!){
  listFilesStatus(filestatus: $filestatus, projectid: $projectid){
    id
    fileName
    fileStatus
    fileType
    filePath
    pages
  }
}`


const UserSelectionHeader: FC<Props> = ({ tableProps }) => {
  const { isAllSelected, onSelectAll, projectid, setSelected, setSelected1, selected, setSelectedStatus, setFileStatus, filestatus } = useListView();
  console.log("selection projectid", projectid);


  const handleStatusSelect = async (selectedOption: any) => {
    console.log("selectedOption", selectedOption);
    setSelectedStatus(selectedOption)


    try {
      const res = await request(`${BASEURL}graphql/`, FILE_STATUS, {
        projectid: projectid,
        filestatus: selectedOption, // Assuming filestatus is an array
      }, {Authorization: `Bearer ${localStorage.getItem('Token')}`});


      console.log("response", res.listFilesStatus);


      if (res.listFilesStatus) {
        const selectedIds = res.listFilesStatus.map((item: { id: any }) => item.id);
        setFileStatus(true)
        setSelected(selectedIds);
        console.log("selectedIds", selectedIds);
      } else {
        // If the response does not contain file status, set selected to an empty array
        setSelected([]);
        setFileStatus(false)
      }
    } catch (error) {
      console.error("Error fetching file status:", error);
      // Handle error as needed
    }
  };

  const handleCheckboxChange = () => {
    if (isAllSelected) {
      setSelected([]); // Unselect all items
      setSelected1([]);
      setFileStatus(false)
    } else {
      onSelectAll(); // Toggle checkbox state
      setFileStatus(true)
    }
  };


  const fileStatus = [
    { value: 'All', label: 'All' },
    { value: 'To be Processed', label: 'To be Processed' },
    { value: 'Being Processed', label: 'Being Processed' },
    { value: 'Data Extracted', label: 'Data Extracted' },
    { value: 'Being Reviewed', label: 'Being Reviewed' },
    { value: 'Review Completed', label: 'Review Completed' },
    { value: 'error in process', label: 'error in process' },
  ];


  console.log("filestatus", fileStatus);
  return (
    <th {...tableProps.column.getHeaderProps()} className='w-10px pe-2'>
      <div className='form-check form-check-sm form-check-custom form-check-solid me-3' style={{ cursor: 'pointer' }}>
        <input
          className='form-check-input'
          type='checkbox'
          data-kt-check={isAllSelected}
          data-kt-check-target='#kt_table_users .form-check-input'
          checked={isAllSelected}
          onChange={handleCheckboxChange}
          title='Select'
          style={{
            width: '20px',
            height: '20px',
            border: '1px solid #6c757d',
            cursor: 'pointer',
            borderRadius: '5px',
            backgroundColor: isAllSelected ? '#3498db' : 'transparent',
          }}
        />&nbsp;&nbsp;
        <span
          className='hover'
          style={{
            cursor: 'pointer'
          }}
          // type='dropdown'
          id='dropdownMenuButton'
          data-bs-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
        >
          <BsCaretDownFill />
        </span>
        <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
          {fileStatus.map((status) => (
            <a key={status.value}
              className='dropdown-item'
              onClick={() => handleStatusSelect(status.value)}
            >
              {status.label}
            </a>
          ))}
        </div>
      </div>
    </th>
  );
};


export { UserSelectionHeader }
