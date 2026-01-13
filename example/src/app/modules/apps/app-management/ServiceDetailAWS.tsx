import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
    accessKey: string,
    secretKey: string,
    regionName: string,
) {
    return {
        accessKey,
        secretKey,
        regionName
    };
}

function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} >
                <TableCell align="left">{row.accessKey}</TableCell>
                <TableCell align="left">{row.secretKey}</TableCell>
                <TableCell align="left">{row.regionName}</TableCell>
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
export default function ServiceDetailAWS({
    // dataid,
    servicedetail
}: Props) {

    console.log("Service ARRAY --->", servicedetail);

    // const allfields = useQuery(ALL_FIELDS, { variables: { id: catalogid } });

    return (
        <>
            <div style={{ width: '130%' }} >
                <TableContainer component={Paper} style={{ width: '120%' }}>
                    <Table className='col_table'>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Access Key</TableCell>
                                <TableCell align="left">Secret Key</TableCell>
                                <TableCell align="left">Region Name</TableCell>
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
