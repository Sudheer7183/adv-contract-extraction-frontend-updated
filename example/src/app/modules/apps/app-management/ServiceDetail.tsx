import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
    serviceApiKey: string,
    serviceApiUrl: string,
) {
    return {
        serviceApiKey,
        serviceApiUrl,
    };
}

function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} >
                <TableCell align="left">{row.serviceApiUrl}</TableCell>
                <TableCell
                    // className='badge text-wrap'
                    align="left"
                    style={{ maxWidth: "20ch" }}
                >{row.serviceApiKey}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}


interface Props {
    servicedetail: {
        id: number,
        description: string,
        serviceApiKey: string,
        serviceApiUrl: string,
        accessKey: string,
        secretKey: string,
        regionName: string,
        service: {
            serviceName: string
        }
    }[]
}
export default function ServiceDetail({
    // dataid,
    servicedetail
}: Props) {

    console.log("Service ARRAY --->", servicedetail);

    return (
        <>
            <div style={{ width: '100%' }} >
                <TableContainer component={Paper} style={{ width: '100%' }}>
                    <Table className='col_table'>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" style={{ width: '25%' }}>Service Url</TableCell>
                                <TableCell align="left">Service Token</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <Row key={servicedetail.id} row={servicedetail} />

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}
