import React, { useMemo } from 'react';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/TableContainer';

const IsoFileList = () => {

    const cellFunction = ({ value, column: { getProps } }) => {
        return <i
            className="mdi mdi-cloud-download label-icon"
            style={{ fontSize: '17px', color: 'white', cursor: 'pointer' }}
            onClick={() => { console.log('clicked') }}
        />
    }

    const columns = useMemo(
        () => [
            {
                Header: 'File Name',
                accessor: 'filename',
            },
            {
                Header: 'File Type',
                id: 'filetype',
                accessor: d => d.filetype,
            },
            {
                Header: 'File Size',
                accessor: 'progress',
            },
            {
                Header: 'Download',
                accessor: 'age',
                Cell: cellFunction,
                getProps: () => ({ name: 'table' })
            },
        ],
        []
    );

    const data = [
        {
            "filename": "horn-od926",
            "filetype": "selection-gsykp",
            "age": 22,
            "visits": 20,
            "progress": 39,
            "status": "single"
        },
        {
            "filename": "heart-nff6w",
            "filetype": "information-nyp92",
            "age": 16,
            "visits": 98,
            "progress": 40,
            "status": "complicated"
        },
        {
            "filename": "minute-yri12",
            "filetype": "fairies-iutct",
            "age": 7,
            "visits": 77,
            "progress": 39,
            "status": "single"
        },
        {
            "filename": "degree-jx4h0",
            "filetype": "man-u2y40",
            "age": 27,
            "visits": 54,
            "progress": 92,
            "status": "relationship"
        },
        {
            "filename": "horn-od926",
            "filetype": "selection-gsykp",
            "age": 22,
            "visits": 20,
            "progress": 39,
            "status": "single"
        },
        {
            "filename": "heart-nff6w",
            "filetype": "information-nyp92",
            "age": 16,
            "visits": 98,
            "progress": 40,
            "status": "complicated"
        },
        {
            "filename": "minute-yri12",
            "filetype": "fairies-iutct",
            "age": 7,
            "visits": 77,
            "progress": 39,
            "status": "single"
        },
        {
            "filename": "degree-jx4h0",
            "filetype": "man-u2y40",
            "age": 27,
            "visits": 54,
            "progress": 92,
            "status": "relationship"
        },
        {
            "filename": "horn-od926",
            "filetype": "selection-gsykp",
            "age": 22,
            "visits": 20,
            "progress": 39,
            "status": "single"
        },
        {
            "filename": "heart-nff6w",
            "filetype": "information-nyp92",
            "age": 16,
            "visits": 98,
            "progress": 40,
            "status": "complicated"
        },
        {
            "filename": "minute-yri12",
            "filetype": "fairies-iutct",
            "age": 7,
            "visits": 77,
            "progress": 39,
            "status": "single"
        },
        {
            "filename": "degree-jx4h0",
            "filetype": "man-u2y40",
            "age": 27,
            "visits": 54,
            "progress": 92,
            "status": "relationship"
        }
    ];


    document.title = "Iso File List";

    return (
        <div className="page-content">
            <div className="container-fluid">

                <Breadcrumbs title="ISO File" breadcrumbItem="File List" />

                <TableContainer
                    columns={columns}
                    data={data}
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