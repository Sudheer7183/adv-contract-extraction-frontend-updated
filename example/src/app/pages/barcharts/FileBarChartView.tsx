import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { useNavigate } from 'react-router-dom';
import { request, gql } from 'graphql-request'
import BASEURL from '../../config/baseurl';

export const file_bar = gql`
query{
  fileBarchart{
    id
    fileStatus
    contractType{
        contractTypeName
      }
    count
  }
}`

function FileBarChartView() {
    const nav = useNavigate()
    const themeModeColor = localStorage.getItem("themeMode")

    const color = themeModeColor == "dark" ? "#343a40" : "#ffffff"
    const [data, setdata] = useState<any>([])
    useEffect(() => {
        request(`${BASEURL}graphql/`, file_bar, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setdata(res.fileBarchart))
    }, [])
    const lenn = data.length
    console.log("lenn", lenn)
    let option: any[] = [];
    let filestatus: any[] = [];
    let doctype: any[] = [];
    let count: any[] = [];
    let newcount: any[] = [];
    let option1: any[] = [];

    for (let a = 0; a < lenn; a++) {
        const fs = data[a].fileStatus
        filestatus.push(fs)
        const dt = data[a].contractType == null ? "Yet to be Processed" : data[a].contractType.contractTypeName
        doctype.push(dt)
        const cnt = data[a].count
        count.push(cnt)
    }

    for (let i = 0; i < lenn; i++) {
        let cntval = [];
        for (let j = 0; j < lenn; j++) {
            if (i == j) {
                cntval.push(count[i])
            }
            else {
                cntval.push(0)
            }
        }
        newcount.push(cntval)
    }

    for (let o = 0; o < lenn; o++) {
        option.push({ x: filestatus, y: newcount[o], name: doctype[o], type: "bar" });
    }
    console.log("Bar chart json ", option)

    function cleanDocumentType(name: any) {
        return name.replace(/\s+/g, ''); // Remove all spaces
    }

    for (let d = 0; d < doctype.length; d++) {
        let list1: number[][] = [];
        const currentName = doctype[d];
        const aggregatedName = cleanDocumentType(currentName);
        const newData = option.filter(item => cleanDocumentType(item.name) === aggregatedName);
        newData.map(val => list1.push(val.y));
        const len = list1.length;
        for (let k = 0; k < len; k++) {
            for (let l = 0; l < list1[k].length; l++) {
                if (list1[k][l] > 0) {
                    list1[0][l] = list1[k][l];
                }
            }
        }
        let req_y = list1[0];
        let req_doctype = currentName;
        option1.push({ x: filestatus, y: req_y, name: req_doctype, type: "bar", hoverinfo: "x+y" });
    }

    console.log("option1-->", option1)

    let pp = option1.filter((ele, ind) => ind === option1.findIndex(elem => elem.name === ele.name && elem.y === ele.y))

    console.log(pp)

    const HandleClick = (event: any) => {
        const point = event.points[0];
        console.log("Pie click value-->", point)
        let labelval = point.label
        let value = point.value
        let data = point.data.name
        console.log("Doctype-->", data)
        console.log("label, value -->", labelval, value)
        let chart = 'file_status'
        nav("/piechart-management/barfiles/" + labelval + "/" + chart + "/" + data)
    }

    return (
        <Plot
            data={pp}
            onClick={HandleClick}
            layout={{
                width: 700, height: 300, title: 'Files by Contract Type',
                font: {
                    color: themeModeColor == "dark" ? "#ffffff" : "#343a40"
                },
                paper_bgcolor: color, plot_bgcolor: color
            }}
            config={{ displaylogo: false, modeBarButtonsToRemove: ['zoom2d', 'select2d', 'lasso2d',] }}
        />

    )
}


export default FileBarChartView
