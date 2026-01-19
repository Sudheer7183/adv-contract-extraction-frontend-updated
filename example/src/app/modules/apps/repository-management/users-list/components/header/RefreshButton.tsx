import React from "react";
import { useListView } from "../../core/ListViewProvider";
import { set } from "lodash";


const RefreshButton = () => {
    const { clicked, setClicked } = useListView()
    const handleClick = () => {
        setClicked(true)
        console.log('clicked', clicked)
    }
    return (
        <div className="d-flex justify-content-end">
            <i
                className="fas fa-sync"
                onClick={handleClick}
                style={{ fontSize: '20px', paddingTop: '30px', cursor: 'pointer' }}
            ></i>
        </div>
    );
};


export default RefreshButton;
