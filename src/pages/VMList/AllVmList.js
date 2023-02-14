import React from 'react'
import { useHistory } from "react-router-dom";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from 'components/Common/TableContainer'
import { useMemo } from 'react';
import { useLayoutEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_ALL_VMS } from 'gqlOprations/Queries';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import alt from "assets/images/Azure.png"
import { Card, CardBody, Container, Col, Row, Spinner, Button, Label } from 'reactstrap';


const AllVmsList = () => {

    const history = useHistory();
    const [allVmsList, setAllVmsList] = useState([])

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

    const mvUserType = getCookies("MvUserType");
    const mvToken = getCookies("MvUserToken");

    const [getAllVms, { loading, data, error }] = useLazyQuery(GET_ALL_VMS, {
        variables: {
            input: {
                token: mvToken
            }
        },
        onCompleted: data => {
            setAllVmsList(data.getAllVM);
        },
        fetchPolicy: "cache-and-network"
    })

    useLayoutEffect(() => {
        if (mvUserType !== "admin") {
            history.push("/dashboard")
        }
    }, [])

    useEffect(() => { getAllVms() }, [])

    const ListFunc = (row) => {
        const { value, column: { getProps } } = row;

        return <>
            <Row>
                <Col sm="auto" style={{ marginLeft: "4px" }}>
                    {allVmsList && allVmsList ? (
                        row.cell.row.original.Status === true && row.cell.row.original.Status === true ? (
                            <Spinner type="grow" size="sm" color="success" style={{ marginTop: "15px" }} />
                        ) : <div style={{ width: "16px" }}></div>

                    ) : null}
                </Col>

                <Col sm="auto">
                    <div className="avatar-sm me-2">
                        <span className="avatar-title rounded bg-light text-danger font-size-16">
                            <img src={
                                allVmsList && allVmsList ? (
                                    "http://167.99.36.48:3003/" + row.cell.row.original.VM_Image.split("app/")[1] || alt
                                ) : alt
                            }
                                height="45"
                                width="45"
                                style={{ borderRadius: "4px" }}
                            />
                        </span>
                    </div>
                </Col>
                <Col lg="6">
                    <Label for="basicpill-phoneno-input3" style={{ marginTop: "15px" }}>
                        {allVmsList && allVmsList ? (row.cell.row.original.VirtualMachine_Name) : ""}
                    </Label>
                </Col>
                <Col sm="auto">
                    {/* <Button onClick={() => { console.log(row.cell.row.original.VM_Image) }}><i className="mdi mdi-desktop-classic" /></Button> */}
                </Col>
                <Col>
                </Col>
                <Col>

                </Col>
            </Row>

        </>
    }

    const columns = useMemo(
        () => [
            {
                Header: 'All Virtual Machine List',
                accessor: "VirtualMachine_Name",
                Cell: ListFunc
            }
        ],
        []
    );


    document.title = "All VMs List";

    return (
        <div className="page-content">
            <div className="container-fluid">

                <Breadcrumbs title="VMs" breadcrumbItem="All VMs List" />

                <div >
                    <TableContainer
                        columns={columns}
                        data={allVmsList}
                        isGlobalFilter={true}
                        // isAddOptions={true}
                        customPageSize={10}
                        className="custom-header-css"
                    />
                </div>
            </div>
        </div>
    )
}

export default AllVmsList
