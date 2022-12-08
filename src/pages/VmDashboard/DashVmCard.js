import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Container, Col, UncontrolledTooltip, Row, Badge, Button, Spinner } from 'reactstrap';

const DashVmCard = () => {


    const [state, setState] = useState(false);
    const toggle = () => {
        setState(!state);
        console.log(state)
    }
    return (
        <React.Fragment>
            <Col xl="3" sm="6">
                <Card>
                    <Link to="/vmdetails">
                        <CardBody>
                            <div className="d-flex">
                                <Col lg="3">
                                    <div className="avatar-sm me-4">
                                        <span className="avatar-title rounded bg-light text-danger font-size-16">
                                            <img src='./1..jpg' height="45" width="45" style={{ borderRadius: "4px" }} />
                                        </span>
                                    </div>
                                </Col>
                                <Col lg="8">
                                    <div className="flex-grow-1 overflow-hidden" style={{ marginTop: '14px' }}>

                                        <h5 className="text-truncate font-size-14">
                                            This is Virtual Machine 1
                                        </h5>
                                    </div>
                                </Col>
                                <Col lg="1">
                                    <div style={{ marginTop: "15px", marginLeft: '12px' }}>
                                        <Spinner type="grow" size="sm" color="success" style={{ display: state ? '' : 'none' }} />
                                    </div>
                                </Col>
                            </div>
                        </CardBody>
                    </Link>

                    <div className="px-4 py-3 border-top">
                        <Row>
                            <Col lg="10">
                                <div className="d-grid gap-2">
                                    <Button onClick={toggle} color={state ? 'danger' : 'success'} type="button" className="btn-sm btn-label" >
                                        <i className={state ? 'bx bx-pause label-icon' : 'bx bx-play label-icon'}></i>
                                        {state ? 'STOP' : 'START'}
                                    </Button>
                                </div>
                            </Col>

                            <Col lg="1">
                                <Link to="/update-vm">
                                    <div style={{ marginTop: "2px", display: "flex", justifyContent: "center", marginLeft: "20px" }}>
                                        <i className="bx bx-sync bx-sm " />
                                    </div>
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </Card>

            </Col>
        </React.Fragment>

    )
}

export default DashVmCard