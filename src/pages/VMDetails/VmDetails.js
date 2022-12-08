import React from 'react'
import { Card, CardBody, Col, Button, Container, CardImg, CardText, Form, FormGroup, Input, Label, NavItem, NavLink, Row, TabContent, TabPane, CardTitle, Table } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Link } from "react-router-dom"
import StBtn from './StBtn'


const VmDetails = () => {
    document.title = "VM Details";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="VM List" breadcrumbItem="VM Details" />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <Row>
                                    <Col lg="4">
                                        <Card >
                                            <CardBody>
                                                <h4 className="card-title mb-4">VM Image</h4>
                                                <CardImg className="img-fluid" src="./1..jpg" alt="Skote" />
                                            </CardBody>
                                            <CardBody>
                                                <Row>
                                                    <Col>
                                                        <StBtn />
                                                        {/* <div className="d-grid gap-2">
                                                            <Button type="button" className="btn-lg btn-success">
                                                                <i className="mdi mdi-play d-block font-size-40"></i>{" "}
                                                                START
                                                            </Button>
                                                        </div> */}
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col lg="8">
                                        <Card>
                                            <CardBody>
                                                <h4 className="card-title mb-4">VM Details</h4>
                                                <Row>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                <CardTitle>Name:</CardTitle>
                                                                <CardText>
                                                                    Virtual Machine 1
                                                                </CardText>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                <CardTitle>Operating system:</CardTitle>
                                                                <CardText>
                                                                    Windows
                                                                </CardText>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                <CardTitle>Date:</CardTitle>
                                                                <CardText>
                                                                    31/12/1999
                                                                </CardText>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                <CardTitle>Description:</CardTitle>
                                                                <CardText>
                                                                    This is another card with title and supporting text below.
                                                                    This card has some additional content to make it slightly
                                                                    taller overall.
                                                                </CardText>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col>
                                                        <Link to="/update-vm" >
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary  btn-label">
                                                                <i className="bx bx-edit label-icon"></i> Update VM
                                                            </button>
                                                        </Link>
                                                    </Col>

                                                    <Col>
                                                        <Link to="/#" >
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger  btn-label">
                                                                <i className="bx bx-trash label-icon"></i> Delete VM
                                                            </button>
                                                        </Link>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                </Container>
            </div>
        </React.Fragment >
    )
}

export default VmDetails