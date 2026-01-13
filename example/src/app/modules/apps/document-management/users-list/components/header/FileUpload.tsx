import React from 'react'
import { useAuth } from '../../../../../auth';
import { useListView } from '../../core/ListViewProvider';
import { FaUpload } from "react-icons/fa";


function FileUpload() {
    const { currentUser } = useAuth()
    const Role = currentUser?.role
    const { setFileUpload } = useListView()

    const Upload = () => {
        console.log("upload function")
        setFileUpload(true)
    }


    const color = localStorage.getItem("themeColor")
    console.log("colorcolor", color)
    const themec = color != null ? color + " " + 'btn' : 'p-3 bg-primary text-white btn'
    console.log("themec", themec);

    return (
        <div>
            {(Role === "Admin" || Role === "Manager") ?
                <button type='button' className={themec} style={{ marginLeft: "10px" }}
                    onClick={Upload} title='File upload'
                ><b><FaUpload /></b></button>
                : null
            }
        </div>
    )
}

export default FileUpload


