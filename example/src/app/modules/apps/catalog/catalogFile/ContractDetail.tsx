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
                <TableCell align="left">{row.zuvaContractType}</TableCell>
                <TableCell align="left">{row.fieldName}</TableCell>
                <TableCell align="left">{row.fieldId}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}


interface Props {
    contractfields: {
        zuvaContractType: string,
        fieldName: string,
        fieldId: string
    }[]
}
export default function ContractDetail({
    // dataid,
    contractfields
}: Props) {

    console.log("CONTRACT ARRAY --->", contractfields);

    // const allfields = useQuery(ALL_FIELDS, { variables: { id: catalogid } });

    return (
        <>
            <div style={{ width: '130%' }} >
                <TableContainer component={Paper} style={{ width: '120%' }}>
                    <Table className='col_table'>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Zuva Contract Type</TableCell>
                                <TableCell align="left">Field Name</TableCell>
                                <TableCell align="left">Field Id</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contractfields
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
