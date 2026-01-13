/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';
import { useListView } from '../../core/ListViewProvider';

type Props = {
    allData?: any
}

const Expand: FC<Props> = ({ allData }) => {
    const { Expand, setExpand } = useListView()
    const nav = useNavigate();
    console.log("Expand->", Expand);
    console.log('all data in expand',allData);
    const openTable = () => {
        if (Expand === allData) {
            setExpand(0)
        } else {
            setExpand(allData)
        }


        // nav("/document-management/document/" + allData.node.id);

        
        

    }
    return (
        <div className='d-flex align-items-center'>

            <div className='d-flex flex-column'>
                <a href='#' onClick={openTable} className='text-gray-800 text-hover-primary mb-1'>
                    {
                        Expand === allData
                            ? <i className="bi bi-arrow-down" style={{ fontSize: "25px", fontWeight: "bold" }}></i>
                            : <i className="bi bi-arrow-right" style={{ fontSize: "25px", fontWeight: "bold" }}></i>

                    }
                </a>

            </div>
        </div>
    )
}


export { Expand }
