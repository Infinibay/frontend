import React from 'react';

import {
    Card,
    Col,
    Container,
    Row,
    CardBody,
    CardTitle,
    Label,
    Button,
    Form,
    Input,
    InputGroup,
    CardImg,
    CardText,
} from "reactstrap";

import avatar5 from "../../assets/images/users/avatar-5.jpg";

import Breadcrumbs from "../../components/Common/Breadcrumb";

const CreateUser = props => {

    document.title = "Create User";

    return (
        <React.Fragment>
            <div className="page-content" >
                <Container fluid={true}>

                    <Breadcrumbs title="Users" breadcrumbItem="Create New User" />

                    <Row>
                        <div style={{ display: 'flex', justifyContent: 'center', }}>
                            <Col lg={7}>
                                <Card>
                                    <CardBody>
                                        <CardTitle className="mb-4">Create User</CardTitle>

                                        <Form>

                                            <div style={{ display: 'flex', justifyContent: 'center', }}>
                                                <Row>
                                                    <Col lg={4}>
                                                        <CardImg
                                                            src={avatar5}
                                                            alt="Skote"
                                                            className="rounded-circle avatar-lg"
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                            <br />
                                            <div className="mb-3">
                                                <Label htmlFor="formrow-firstname-Input">FUll Name</Label>
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    id="formrow-firstname-Input"
                                                    placeholder="Enter Your First Name"
                                                />
                                            </div>

                                            <Row>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="formrow-email-Input">Email</Label>
                                                        <Input
                                                            type="email"
                                                            className="form-control"
                                                            id="formrow-email-Input"
                                                            placeholder="Enter Your Email ID"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="formrow-email-Input">Phone</Label>
                                                        <Input
                                                            type="text"
                                                            className="form-control"
                                                            id="formrow-phone-Input"
                                                            placeholder="Enter Your Phone"
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <div className="mb-3">
                                                <Label htmlFor="formrow-password-Input">Password</Label>
                                                <Input
                                                    type="password"
                                                    className="form-control"
                                                    id="formrow-password-Input"
                                                    placeholder="Enter Your Password"
                                                />
                                            </div>

                                            <Row>
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary  btn-label"
                                                    >
                                                        <i className="mdi mdi-upload-outline label-icon"></i> Upload Profile Image
                                                    </button>
                                                </div>
                                            </Row>

                                            <br />
                                            <Label style={{ color: 'white' }}>Change Password</Label>
                                            <br />
                                            <br />

                                            <Row>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="formrow-password-Input">New Password</Label>
                                                        <Input
                                                            type="password"
                                                            className="form-control"
                                                            id="formrow-password-Input"
                                                            placeholder="Enter Your Password"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="formrow-password-Input">Confirm Password</Label>
                                                        <Input
                                                            type="password"
                                                            className="form-control"
                                                            id="formrow-password-Input"
                                                            placeholder="Enter Your Password"
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <div>
                                                <button type="submit" className="btn btn-primary w-md">
                                                    Submit
                                                </button>
                                            </div>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default CreateUser