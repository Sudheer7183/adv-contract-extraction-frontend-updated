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
    FieldValue: string,
) {
    return {
        FieldName,
        FieldValue,
    };
}

function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} >
                {/* <TableCell align="left">{row.node.zuvaContractType}</TableCell> */}
                <TableCell align="left">{row.node.fieldId}</TableCell>
                <TableCell align="left">{row.node.fieldName}</TableCell>
                <TableCell align="left">{row.node.currentPrompt}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}


interface Props {
    contractfields: {
        node: {
            zuvaContractType: string,
            fieldName: string,
            fieldId: string,
            currentPrompt: string,
        }
    }[]
}
export default function ContractDetail({
    // dataid,
    contractfields
}: Props) {

    console.log("CONTRACT ARRAY --->", contractfields);
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
            <div className="scrollable-container" >
                <TableContainer component={Paper} style={{ width: '100%' }}>
                    <Table className='col_table'>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" style={{ width: '30%' }}>Field Id</TableCell>
                                <TableCell align="left" style={{ width: '30%' }}>Field Name</TableCell>
                                <TableCell align="left" style={{ width: '90%' }}>Current Prompt</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contractfields
                                .map((row: any) => (
                                    <Row key={row.node.id} row={row} />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}
