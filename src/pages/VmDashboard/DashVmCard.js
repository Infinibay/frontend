import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_USER_VMS } from 'gqlOprations/Queries';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Container, Col, UncontrolledTooltip, Row, Badge, Button, Spinner } from 'reactstrap';
import Vm from "../../assets/images/1..jpg";
import alt from "assets/images/Azure.png"
import { VM_ACTION } from 'gqlOprations/Mutations';

const DashVmCard = () => {

    const [activeVmList, setActiveVmList] = useState([])

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

    const [changeVmStatus, { loading: loadingB, data: dataB, error: errorB }] = useMutation(VM_ACTION)

    const [getActiveVms, { loading: loadingA, data: dataA, error: errorA }] = useLazyQuery(GET_USER_VMS, {
        variables: {
            input: {
                Status: true,
                token: mvToken
            }
        },
        onCompleted : dataA => {
            // console.log(dataA.getUserAllVM)
            setActiveVmList(dataA.getUserAllVM)
        },
        fetchPolicy: "cache-and-network"
    });

    const toggle = (id) => {
        changeVmStatus({
            variables:{
                input:{
                    button: false,
                    token: mvToken,
                    id: id
                }
            },

            onCompleted: () => getActiveVms()
        })
    }

    useEffect(() => {
        getActiveVms()
    }, [])

    return (
        <React.Fragment>
            {activeVmList && activeVmList ? (activeVmList.map(e => {
                return <Col xl="3" sm="6" key={e.id} value={e.VirtualMachine_Name}>
                    <Card>
                        <Link to={`/vmdetails/${e.id}`}>
                            <CardBody>
                                <div className="d-flex">
                                    <Col lg="3">
                                        <div className="avatar-sm me-4">
                                            <span className="avatar-title rounded bg-light text-danger font-size-16">
                                                <img src={"http://167.99.36.48:3003/" + e.VM_Image.split("app/")[1] || alt} height="45" width="45" style={{ borderRadius: "4px" }} />
                                            </span>
                                        </div>
                                    </Col>
                                    <Col lg="8">
                                        <div className="flex-grow-1 overflow-hidden" style={{ marginTop: '14px' }}>

                                            <h5 className="text-truncate font-size-14">
                                                {e.VirtualMachine_Name}
                                            </h5>
                                        </div>
                                    </Col>
                                    <Col lg="1">
                                        <div style={{ marginTop: "15px", marginLeft: '12px' }}>
                                            <Spinner type="grow" size="sm" color="success" />
                                        </div>
                                    </Col>
                                </div>
                            </CardBody>
                        </Link>

                        <div className="px-4 py-3 border-top">
                            <Row>
                                <Col lg="10">
                                    <div className="d-grid gap-2">
                                        <Button onClick={()=> toggle(e.id)} color={'danger'} type="button" className="btn-sm btn-label" >
                                            <i className={'bx bx-pause label-icon'}></i>
                                            {'STOP'}
                                        </Button>
                                    </div>
                                </Col>

                                <Col lg="1">
                                    <Link to={`/update-vm/${e.id}`}>
                                        <div style={{ marginTop: "2px", display: "flex", justifyContent: "center", marginLeft: "20px" }}>
                                            <i className="bx bx-edit bx-sm " />
                                        </div>
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                    </Card>

                </Col>
            })) : ""}
        </React.Fragment>

    )
}

export default DashVmCard