import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
    FieldName: string,
    FieldId: string,
) {
    return {
        FieldName,
        FieldId,
    };
}


function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;

    console.log("row---->", row)

    const fieldArr = row?.userContractTypeMaster?.usercontracttypedetail?.edges

    const ContractName = row?.userContractTypeMaster?.contractTypeName

    console.log("FieldArr--->", fieldArr, ContractName);


    return (
        <React.Fragment>
            <TableRow>
                <TableCell><b style={{ color: 'blue' }}>Contract Type:</b>&nbsp;{ContractName}</TableCell>
                <TableCell align="left" style={{ color: 'blue' }}>Field Names</TableCell>
            </TableRow>
            {fieldArr.map((val: any) => {
                return (
                    <TableRow key={val.node.id}>
                        <TableCell align="left"></TableCell>
                        <TableCell align="left">{val.node.fieldName}</TableCell>
                    </TableRow>
                );
            })}
        </React.Fragment>
    );
}


interface Props {
    catalogfields:
    {
        id: number,
        userContractTypeMaster: {
            id: number,
            contractTypeName: string,
            active: boolean,
            usercontracttypedetail: {
                edges: {
                    node: {
                        id: number,
                        fieldId: string,
                        fieldName: string,
                        zuvaContractType: string
                    }
                }[]

            }
        }
    }[]
}

export default function CatalogDetail({
    catalogfields
}: Props) {

    console.log("CATALOG DATA ID --->", catalogfields);
    const themeColor1 = localStorage.getItem("themeColor")
    console.log("Viewer themeColor->", themeColor1);
    const getBackgroundColor = (classNames: any) => {
        const regex = /bg-(\w+)/;
        if (typeof classNames === 'string' && classNames.trim() !== '') {
            const match = classNames.match(regex);
            if (match && match[1]) {
                return match[0];
            }
        }
        return '';
    };

    const backgroundColor = getBackgroundColor(themeColor1);
    console.log("backgroundColor", backgroundColor)
    const bootstrapColorToHexMapThumb: any = {
        'bg-white': '#ffffff',
        'bg-primary': '#009ef7',
        'bg-secondary': '#e1e3ea',
        'bg-success': '#50cd89',
        'bg-danger': '#f1416c',
        'bg-warning': '#ffc700',
        'bg-info': '#7239ea',
        'bg-light': '#f8f9fa',
        'bg-dark': '#343a40',
    };

    const bootstrapColorToHexMapTrack: any = {
        'bg-white': '#ffffff',
        'bg-primary': '#f1faff',
        'bg-secondary': '#f9f9f9',
        'bg-success': '#c9f7f5',
        'bg-danger': '#ffe2e5',
        'bg-warning': '#fff4de',
        'bg-info': '#eee5ff',
        'bg-light': '#f8f9fa',
        'bg-dark': '#f8f9fa',
    };

    const TrackhexCode = bootstrapColorToHexMapTrack[backgroundColor] || '#f1faff';
    const ThumbhexCode = bootstrapColorToHexMapThumb[backgroundColor] || '#0080FF';

    function changeScrollbarColor(trackcolor: any, thumbcolor: any) {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
        .scrollable-container::-webkit-scrollbar-track {
            background-color: ${trackcolor} !important;
        }
        .scrollable-container::-webkit-scrollbar-thumb {
            background-color: ${thumbcolor} !important;
        }
        `;
        document.head.appendChild(styleElement);
    }

    changeScrollbarColor(TrackhexCode, ThumbhexCode);

    return (
        <>
            <div className="scrollable-container">
                <TableContainer component={Paper} style={{ width: '100%' }}>
                    <Table >
                        <TableBody>
                            {catalogfields
                                .map((row: any) => (
                                    <Row key={row.id} row={row} />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}
