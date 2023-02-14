import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';

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
    FormFeedback
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";

import avatar5 from "../../assets/images/users/avatar-5.jpg";
import alt from "assets/images/userAlt.jpg"

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { USER_REGISTER } from 'gqlOprations/Mutations';
import { useHistory } from 'react-router-dom';
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const CreateUser = props => {

    document.title = "Create User";

    const [img, setImg] = useState();
    const history = useHistory();

    toastr.options = {
        positionClass: "toast-top-center",
        closeButton: true,
    }
    const [userRegister, { data, loading, error }] = useMutation(USER_REGISTER);


    const handleImageUp = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImg(reader.result.toString());
            const eImage = reader.result.toString();
        };
        reader.readAsDataURL(file)
    }

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            id: null,
            firstName: '',
            lastName: '',
            Email: '',
            Password: '',
            Deleted: false,
            userImage: img || ""
        },

        validationSchema: Yup.object({
            firstName: Yup.string().required("Please Enter User First Name"),
            lastName: Yup.string().required("Please Enter User Last Name"),
            Email: Yup.string().required("Please Enter User Last Name"),
            Password: Yup.string().required("Please Enter User Password"),
            userImage: Yup.string().required("Please Enter User Image")
        }),

        onSubmit: (values) => {
            // console.log(values);

            userRegister({
                variables: {
                    input: values
                },
                onCompleted: () => {
                    toastr.success("User Created");
                    history.push("/user-list")
                }
            })

            // toastr.success("Register Successful Please Login Your Account");
            // console.log(data)
        }
    });

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="User List" breadcrumbItem="Create User" />
                    <Row>
                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                            }}
                        >
                            <Row>
                                <Col lg="12">
                                    <Card>
                                        <Row>
                                            <Col lg="3">
                                                <Card >
                                                    <CardBody>
                                                        <h4 className="card-title mb-4">Upload Image</h4>
                                                        <div className="text-center">
                                                            <div style={{ height: "250px" }}>
                                                                <img className="rounded-circle"
                                                                    id="UserImage"
                                                                    src={img || alt}
                                                                    width="270px"
                                                                    height="270px"
                                                                ></img>
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                    <CardBody>
                                                        <Row>
                                                            <Col>
                                                                <Input className="form-control"
                                                                    type="file"
                                                                    id="userImageUpdate"
                                                                    accept="image/*"
                                                                    name="userImage"
                                                                    onBlur={validation.handleBlur}
                                                                    onChange={handleImageUp}
                                                                    invalid={
                                                                        validation.touched.userImage && validation.errors.userImage ? true : false
                                                                    }
                                                                />
                                                                {validation.touched.userImage && validation.errors.userImage ? (
                                                                    <FormFeedback type="invalid">{validation.errors.userImage}</FormFeedback>
                                                                ) : null}
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col lg="9">
                                                <Card>
                                                    <CardBody>
                                                        <h4 className="card-title mb-4">User Details</h4>
                                                        <Row style={{ marginTop: "45px" }}>
                                                            <Col md={6}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="formrow-email-Input">First Name</Label>
                                                                    <Input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="Update-first-name-input"
                                                                        name="firstName"
                                                                        placeholder='Enter First Name'
                                                                        onChange={validation.handleChange}
                                                                        onBlur={validation.handleBlur}
                                                                        value={validation.values.firstName || ""}
                                                                        invalid={
                                                                            validation.touched.firstName && validation.errors.firstName ? true : false
                                                                        }
                                                                    />
                                                                    {validation.touched.firstName && validation.errors.firstName ? (
                                                                        <FormFeedback type="invalid">{validation.errors.firstName}</FormFeedback>
                                                                    ) : null}
                                                                </div>
                                                            </Col>
                                                            <Col md={6}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="formrow-email-Input">Last Name</Label>
                                                                    <Input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="Update-last-name-input"
                                                                        name="lastName"
                                                                        placeholder='Enter Last Name'
                                                                        onChange={validation.handleChange}
                                                                        onBlur={validation.handleBlur}
                                                                        value={validation.values.lastName || ""}
                                                                        invalid={
                                                                            validation.touched.lastName && validation.errors.lastName ? true : false
                                                                        }
                                                                    />
                                                                    {validation.touched.lastName && validation.errors.lastName ? (
                                                                        <FormFeedback type="invalid">{validation.errors.lastName}</FormFeedback>
                                                                    ) : null}
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ marginTop: "45px" }}>
                                                            <Col md={6}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="formrow-email-Input">Email</Label>
                                                                    <Input
                                                                        type="email"
                                                                        className="form-control"
                                                                        id="update-email-input"
                                                                        name="Email"
                                                                        placeholder="Enter Your Email"
                                                                        onChange={validation.handleChange}
                                                                        onBlur={validation.handleBlur}
                                                                        value={validation.values.Email || ""}
                                                                        invalid={
                                                                            validation.touched.Email && validation.errors.Email ? true : false
                                                                        }
                                                                    />
                                                                    {validation.touched.Email && validation.errors.Email ? (
                                                                        <FormFeedback type="invalid">{validation.errors.Email}</FormFeedback>
                                                                    ) : null}
                                                                </div>
                                                            </Col>
                                                            <Col md={6}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="formrow-email-Input">Password</Label>
                                                                    <Input
                                                                        type="password"
                                                                        className="form-control"
                                                                        id="update-password-input"
                                                                        name="Password"
                                                                        placeholder='Enter Password'
                                                                        onChange={validation.handleChange}
                                                                        onBlur={validation.handleBlur}
                                                                        value={validation.values.Password || ""}
                                                                        invalid={
                                                                            validation.touched.Password && validation.errors.Password ? true : false
                                                                        }
                                                                    />
                                                                    {validation.touched.Password && validation.errors.Password ? (
                                                                        <FormFeedback type="invalid">{validation.errors.Password}</FormFeedback>
                                                                    ) : null}
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col style={{ marginTop: "63px" }}>
                                                                <button
                                                                    id="update-submit"
                                                                    type="submit"
                                                                    className="btn btn-primary  btn-label"> Update Now
                                                                    {loading && loading ? (<i className="bx bx-sync label-icon bx-spin"></i>) :
                                                                        (<i className="bx bx-sync label-icon"></i>)} Update Now
                                                                </button>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default CreateUser