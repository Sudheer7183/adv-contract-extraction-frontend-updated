import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table'
import { Box, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryResponseLoading } from '../../core/QueryResponseProvider';
import request, { gql } from 'graphql-request';
import CatalogDetail from './CatalogDetail';
import BASEURL from '../../../../../../config/baseurl';
// import CatalogDetail from './CatalogDetail';
// import { AiFillEdit } from 'react-icons/ai'

const all_catalog_files = gql`
query{
  allCatalogfiles{
    id
    catalogName
    active
    catalogdetail{
      id
      userContractTypeMaster{
        id
        contractTypeName
        active
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
    }
  }
}`

const Catalog = () => {
    // const { data } = useQuery(ALL_CATALOG_FILES);
    // console.log("catalog data", data)
    // const { data } = useQuery(CATALOG_FILES);

    const [data, setdata] = useState<any>([])
    const isLoading = useQueryResponseLoading()
    useEffect(() => {
        request(`${BASEURL}graphql/`, all_catalog_files, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => setdata(res.allCatalogfiles))
    }, [])

    console.log("catalog data", data)
    const nav = useNavigate()

    const Create = () => {
        nav("/catalog-management/catalog/createcatalog")
    }

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'catalogName',
                header: 'Catalog Name',
            },
            // {
            //     accessorKey: 'projectNames',
            //     header: 'Project Names',
            // }
        ],
        [],
    );

    return (
        <>
            {/* <Home /> */}
            <div className='table_top'>
                <MaterialReactTable
                    columns={columns}
                    data={data ?? []}
                    // data={data?.allCatalogFiles ?? []}
                    // displayColumnDefOptions={{
                    //     'mrt-row-numbers': {
                    //         enableColumnOrdering: true,
                    //         enableResizing: true,
                    //         muiTableHeadCellProps: {
                    //             sx: {
                    //                 fontSize: '1.2rem',
                    //             },
                    //         },
                    //     },
                    //     'mrt-row-select': {
                    //         enableColumnActions: true,
                    //         enableHiding: true,
                    //         size: 100,
                    //     },
                    //     'mrt-row-actions': {
                    //         size: 120,
                    //         muiTableHeadCellProps: {
                    //             align: 'left',
                    //         },
                    //     },
                    // }}
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
                                //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                onClick={Create}
                                // startIcon={<GrAdd />}
                                className='fs-5 text-capitalize'
                                variant="contained"
                            >
                                Create Catalog
                            </Button>
                        </Box>
                    )}
                    // enableRowActions
                    // renderRowActions={({ row }) => (
                    //     <Box sx={{ display: 'flex', gap: '1rem' }}>
                    //         <Button><Link to={""} style={{ color: 'black' }}>
                    //           <AiFillEdit className='zoom' /></Link></Button>
                    //     </Box>
                    // )}
                    renderDetailPanel={({ row }) => (
                        <Box
                            sx={{
                                display: 'grid',
                                margin: 'auto',
                                gridTemplateColumns: '1fr 1fr',
                                width: '100%',
                            }}
                        >
                            <CatalogDetail
                                // catalogid={row.original.catalogId}
                                catalogfields={row.original.catalogdetail}
                            />
                        </Box>
                    )}
                    enableColumnResizing />
            </div></>
    )
};

export default Catalog;

