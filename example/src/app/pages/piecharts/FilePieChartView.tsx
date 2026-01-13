import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useNavigate } from "react-router-dom";
import { request, gql } from 'graphql-request'
import { useQueryResponseLoading } from "../../modules/apps/project-management/users-list/core/QueryResponseProvider";
import BASEURL from "../../config/baseurl";

export const file_pie = gql`
query{
  fileStatusPiechart{
    id
    fileStatus
    count
    percentage
  }
}`

export default function PieChartView() {
    const nav = useNavigate()
    const themeModeColor = localStorage.getItem("themeMode")
    console.log("themeColorPie->", themeModeColor);

    const color = themeModeColor == "dark" ? "#343a40" : "#ffffff"
    const [data, setdata] = useState<any>([])
    const isLoading = useQueryResponseLoading()
    useEffect(() => {
        request(`${BASEURL}graphql/`, file_pie, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setdata(res.fileStatusPiechart))
    }, [])

    const lenn = data.length
    console.log("lenn", lenn)
    let option: any[] = [];
    let filestatusval: any[] = [];
    let countval: any[] = [];

    for (var i = 0; i < lenn; i++) {
        const fs = data[i].fileStatus
        const cnt = data[i].count
        filestatusval.push(fs)
        countval.push(cnt)
    }
    console.log("filestatus arr", filestatusval)
    console.log("Count arr", countval)
    option.push({ values: countval, labels: filestatusval, type: "pie" });

    console.log("Option arr", option)

    const HandleClick = (event: any) => {
        const point = event.points[0];
        console.log("Pie click value-->", point)
        let labelval = point.label
        let value = point.value
        console.log("label, value -->", labelval, value)
        let chart = 'file_status'
        nav("/piechart1-management/barfiles/" + labelval + "/" + chart)
    }

    if (isLoading) return <> Loading...</>

    return (
        <Plot
            data={option}
            onClick={HandleClick}
            layout={{
                width: 700, height: 500, title: 'Files by Status',
                font: {
                    color: themeModeColor == "dark" ? "#ffffff" : "#343a40"
                },
                paper_bgcolor: color, plot_bgcolor: color
            }}
            config={{ displaylogo: false }}
        />
    );
}

