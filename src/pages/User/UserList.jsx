import React from 'react'
import { useHistory } from "react-router-dom";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from 'components/Common/TableContainer'
import { useMemo } from 'react';

const UserList = () => {

    const history = useHistory();

    const cellFunction = ({ value, column: { getProps } }) => {
        return <>
            <i
                className="mdi mdi-delete label-icon"
                style={{ fontSize: '17px', color: 'white', cursor: 'pointer' }}
                onClick={() => { console.log('clicked') }}
            />
            <i
                className="bx bx-edit label-icon"
                style={{ fontSize: '17px', color: 'white', cursor: 'pointer', marginLeft:"10px"}}
                onClick={() => { console.log('clicked') }}
            />
        </>
    }

    const columns = useMemo(
        () => [
            {
                Header: 'User Name',
                accessor: 'username',
            },
            {
                Header: 'Email',
                id: 'filetype',
                // accessor: d => d.filetype,
                accessor:'email'
            },
            {
                Header: 'Actions',
                accessor: 'Actions',
                Cell: cellFunction,
                // getProps: () => ({ name: 'table' })
            },
        ],
        []
    );

    const data = [
        {
            "username":"anaskhan",
            "filename": "horn-od926",
            "filetype": "selection-gsykp",
            "age": 22,
            "visits": 20,
            "progress": 39,
            "status": "single",
            "email":"anaskhankin1999@mail.com"
        },
        {
            "username":"Liam",
            "filename": "heart-nff6w",
            "filetype": "information-nyp92",
            "age": 16,
            "visits": 98,
            "progress": 40,
            "status": "complicated",
            "email":"Liam1234@mail.com"
        },
        {
            "username":"Noah",
            "filename": "minute-yri12",
            "filetype": "fairies-iutct",
            "age": 7,
            "visits": 77,
            "progress": 39,
            "status": "single",
            "email":"Noah2212@mail.com"
        },
        {
            "username":"Oliver",
            "filename": "degree-jx4h0",
            "filetype": "man-u2y40",
            "age": 27,
            "visits": 54,
            "progress": 92,
            "status": "relationship",
            "email":"Oliver4569@mail.com"
        },
        {
            "username":"Elijah",
            "filename": "horn-od926",
            "filetype": "selection-gsykp",
            "age": 22,
            "visits": 20,
            "progress": 39,
            "status": "single",
            "email":"Elijah66558@mail.com"
        },
        {
            "username":"James",
            "filename": "heart-nff6w",
            "filetype": "information-nyp92",
            "age": 16,
            "visits": 98,
            "progress": 40,
            "status": "complicated",
            "email":"James893893@mail.com"
        },
        {
            "username":"William",
            "filename": "minute-yri12",
            "filetype": "fairies-iutct",
            "age": 7,
            "visits": 77,
            "progress": 39,
            "status": "single",
            "email":"William38239@mail.com"
        },
        {
            "username":"Lucas",
            "filename": "degree-jx4h0",
            "filetype": "man-u2y40",
            "age": 27,
            "visits": 54,
            "progress": 92,
            "status": "relationship",
            "email":"Lucas2222@mail.com"
        },
        {
            "username":"Benjamin",
            "filename": "horn-od926",
            "filetype": "selection-gsykp",
            "age": 22,
            "visits": 20,
            "progress": 39,
            "status": "single",
            "email":"Benjamin7767@mail.com"
        },
        {
            "username":"Theodore",
            "filename": "heart-nff6w",
            "filetype": "information-nyp92",
            "age": 16,
            "visits": 98,
            "progress": 40,
            "status": "complicated",
            "email":"Theodore4335@mail.com"
        },
        {
            "username":"johnny",
            "filename": "minute-yri12",
            "filetype": "fairies-iutct",
            "age": 7,
            "visits": 77,
            "progress": 39,
            "status": "single",
            "email":"johnny5677@mail.com"
        },
        {
            "username":"Henry",
            "filename": "degree-jx4h0",
            "filetype": "man-u2y40",
            "age": 27,
            "visits": 54,
            "progress": 92,
            "status": "relationship",
            "email":"Henry3738@mail.com"
        }
    ];

    document.title = "Iso File List";

    return (
        <div className="page-content">
            <div className="container-fluid">

                <Breadcrumbs title="ISO File" breadcrumbItem="File List" />

                <div className='mb-2 overflow-auto' >
                    <button
                        className="btn btn-primary w-md float-end"
                        onClick={() => history.push('/create-user')}
                    >
                        Create User
                    </button>
                </div>

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

export default UserList
