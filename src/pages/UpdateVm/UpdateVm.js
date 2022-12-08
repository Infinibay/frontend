import React from 'react'
import { Card, CardBody, Col, Button, Container, CardImg, CardText, Form, FormGroup, Input, Label, NavItem, NavLink, Row, TabContent, TabPane, CardTitle, Table } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import RamSlider from 'pages/CreateVm/RamSlider'
import StoregeSlider from 'pages/CreateVm/StoregeSlider'

const UpdateVm = () => {
    document.title = "Update VM";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Update VM" breadcrumbItem="Update VM" />
                    <Row>
                        <Col xl="4">
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">VM Image</CardTitle>
                                    <img src='./1..jpg' height="100%" width="100%" />
                                    <CardBody>
                                        <Row>
                                            <div className="d-grid gap-2">
                                                <Button color="primary" type="button" className="btn-lg" >
                                                    Upload New Image
                                                </Button>
                                            </div>
                                        </Row>
                                    </CardBody>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col lg="8">
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4"> Update VM </CardTitle>
                                    <Form>
                                        <Row>
                                            <Col lg="6">
                                                <div className="mb-3">
                                                    <Label for="basicpill-phoneno-input3">
                                                        Name:
                                                    </Label>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        id="basicpill-phoneno-input3"
                                                        placeholder="Enter VM Name"
                                                    />
                                                </div>
                                            </Col>
                                            <Col lg="6">
                                                <div className="mb-3">
                                                    <Label for="basicpill-phoneno-input3">
                                                        Change:
                                                    </Label>
                                                    <Input
                                                        type="text"
                                                        className="form-control"
                                                        id="basicpill-phoneno-input3"
                                                        placeholder="Enter VM Change Name"
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <br></br>
                                        <Row>
                                        <StoregeSlider />
                                        </Row>
                                        <br></br>
                                        <Row>
                                            <RamSlider />
                                        </Row>
                                        <br></br>
                                        <Row>
                                            <div className="mb-3">
                                                <Label for="basicpill-address-input1">
                                                    Description:
                                                </Label>
                                                <textarea
                                                    id="basicpill-address-input1"
                                                    className="form-control"
                                                    rows="2"
                                                    placeholder="Description..."
                                                />
                                            </div>
                                        </Row>
                                        
                                        <Row>
                                            <div className="d-grid gap-2">
                                                <Button color="primary" type="button" className="btn-lg" >
                                                    UPDATE
                                                </Button>
                                            </div>
                                        </Row>
                                        
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default UpdateVm