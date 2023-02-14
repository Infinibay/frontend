import React, { useState, useMemo } from 'react';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/TableContainer';
import { GET_IOS_BY_ID } from 'gqlOprations/Queries';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { DELETE_ISO } from 'gqlOprations/Mutations';
// import { Type } from 'pages/Crypto/CryptoWallet/CryptoWalCol';
// import { map } from 'lodash';

const IsoFileList = () => {

    const [isoData, setIsoData] = useState([])

    const getCookies = (cname) => {
        const cArray = document.cookie.split("; ")
        let result = null
        cArray.forEach(element => {
            if (element.indexOf(cname) == 0) {
                result = element.substring(cname.length + 1)
            }
        })
        return result;
    }

    const mvToken = getCookies("MvUserToken");
    const mvid = getCookies("MvUserID");
    // console.log(mvToken)

    const [getIos, { loading, data, error }] = useLazyQuery(GET_IOS_BY_ID, {
        variables: {
            input: {
                token: mvToken
            }
        },
        onCompleted: data => {
            // console.log(data);
            setIsoData(data.getIOSById);
        },
        fetchPolicy: "cache-and-network"
    });

    const [deleteIso, { data:dataD, loading:loadingD, error:errorD }] = useMutation(DELETE_ISO)

    const cellFunction = (row) => {
        const { value, column: { getProps } } = row;
        return <i
            className="mdi mdi-cloud-download label-icon"
            style={{ fontSize: '17px', color: 'white', cursor: 'pointer' }}
            onClick={() => { console.log('clicked') }}
        />
    }

    const cellFunctionD = (row) => {
        const { value, column: { getProps } } = row;
        return <i
            className="mdi mdi-delete label-icon"
            style={{ fontSize: '17px', color: 'white', cursor: 'pointer' }}
            onClick={() => {
                console.log(row.cell.row.original.id)
                console.log(mvToken)
                deleteIso({
                    variables:{
                        input:{
                            id: row.cell.row.original.id,
                            token: mvToken
                        }
                    },
                    onCompleted: () => getIos()
                })
            }}
        />
    }

    const columns = useMemo(
        () => [
            {
                Header: 'File Name',
                accessor: 'Name',
            },
            {
                Header: 'File Type',
                // id: 'Type',
                accessor: 'Type',
            },
            {
                Header: 'File Size',
                accessor: 'Size',
            },
            {
                Header: 'Download',
                accessor: 'download',
                Cell: cellFunction,
                getProps: () => ({ name: 'table' })
            },
            {
                Header: 'Delete',
                accessor: 'delete',
                Cell: cellFunctionD,
                getProps: () => ({ name: 'table' })
            },
        ],
        []
    );

    document.title = "Iso File List";

    useEffect(() => { getIos() }, [])

    return (
        <div className="page-content">
            <div className="container-fluid">

                <Breadcrumbs title="Dashboard" breadcrumbItem="ISO Files List" />

                <TableContainer
                    columns={columns}
                    data={isoData}
                    isGlobalFilter={true}
                    // isAddOptions={true}
                    customPageSize={10}
                    className="custom-header-css"
                />
            </div>
        </div>
    )
}

export default IsoFileList

/* REACT TABLE CELL PRAMS SEND-BOX */
/* https://codesandbox.io/s/r5n96yvwnm?file=/index.js:917-930 */