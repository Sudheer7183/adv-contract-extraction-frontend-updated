import React, { FC, useMemo } from 'react'
import { ID } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'

type Props = {
  id: ID
}

const UserSelectionCell: FC<Props> = ({ id }) => {
  console.log("idddd", id);


  const { selected, selected1, onSelect, setSelected, setSelected1, setFileStatus, filestatus, setSelectedStatus, selectedStatus } = useListView()
  const isSelected = useMemo(() => selected.includes(id), [id, selected])

  const handleCheckboxChange = () => {
    console.log("Checkbox changed for id:", id, isSelected);
    setSelected(id);
    setSelected1(id);
    setSelectedStatus(id?.fileStatus);
    if (!isSelected) {
      setSelectedStatus(id?.fileStatus);
      setFileStatus(true);
      console.log("Checkbox changed for id: is true");
    } else {
      setFileStatus(false);
      console.log("Checkbox changed for id: is false");
    }
    onSelect(id);
  };

  return (
    <div className='form-check form-check-custom form-check-solid'>
      <input
        className='form-check-input'
        type='checkbox'
        data-kt-check={isSelected}
        data-kt-check-target='#kt_table_users .form-check-input'
        checked={isSelected}
        onChange={handleCheckboxChange}
        // onChange={() => onSelect(id)}
        style={{
          width: '20px',
          height: '20px',
          border: '1px solid #6c757d',
          borderRadius: '5px',
          backgroundColor: isSelected ? '#3498db' : 'transparent',
          cursor: 'pointer',
        }}
        title='select'
      />
    </div>
  )
}


export { UserSelectionCell }
