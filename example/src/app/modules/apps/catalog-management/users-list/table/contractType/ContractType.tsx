import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table'
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ContractDetail from './ContractDetail';
import { useQueryResponseLoading } from '../../core/QueryResponseProvider';
import request, { gql } from 'graphql-request';
import BASEURL from '../../../../../../config/baseurl';

const all_contract_types = gql`
query{
  allContractTypes{
    id
    active
    contractTypeName
    usercontracttypedetail{
        edges{
            node{
              id
              fieldId
              fieldName
            }
        }
    }
  }
}`

const ContractType = () => {
    // const { data } = useQuery(ALL_CONTRACT_TYPES);
    // console.log("catalog data", data)
    const nav = useNavigate()

    const [data, setdata] = useState<any>([])
    const isLoading = useQueryResponseLoading()
    useEffect(() => {
        request(`${BASEURL}graphql/`, all_contract_types, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setdata(res.allContractTypes))
    }, [])

    const Create = () => {
        nav("/catalog-management/catalog/createcontract")
    }

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'contractTypeName',
                header: 'Contract Types',
            },
            // {
            //     accessorKey: 'active',
            //     header: 'Active Status',
            // }
        ],
        [],
    );

    console.log("DATAAAA", data)
    return (
        <>
            {/* <Home /> */}
            <div className='table_top'>
                <MaterialReactTable
                    columns={columns}
                    data={data ?? []}
                    muiTableHeadCellProps={{
                        sx: (theme) => ({
                            background: 'rgba(52, 210, 235, 0.1)',
                            borderRight: '1px solid rgba(224,224,224,1)',
                            color: theme.palette.text.primary,
                        }),
                    }}
                    renderTopToolbarCustomActions={({ table }) => (
                        <Box
                            sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                        >
                            <Button
                                color="primary"
                                onClick={Create}
                                variant="contained"
                                className='fs-5 text-capitalize'
                            >
                                Create Contract Type
                            </Button>
                        </Box>
                    )}
                    renderDetailPanel={({ row }) => (
                        <Box
                            sx={{
                                display: 'grid',
                                margin: 'auto',
                                gridTemplateColumns: '1fr 1fr',
                                width: '100%',
                            }}
                        >
                            <ContractDetail
                                contractfields={row.original.usercontracttypedetail.edges}
                            />
                        </Box>
                    )}
                    enableColumnResizing />
            </div></>
    )
};

export default ContractType;

