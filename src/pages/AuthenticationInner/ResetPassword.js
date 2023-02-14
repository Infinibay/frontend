import React from "react";
import { Row, Col, CardBody, Card, Container, Button, Form, Label, Input, FormFeedback, Alert } from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import profile from "../../assets/images/profile-img.png";
import { CHANGE_USER_PASSWORD } from "gqlOprations/Mutations";
import { useMutation } from "@apollo/client";

const ResetPassword = () => {

    document.title = "Reset Password"

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }

    const token = getQueryVariable("token")

    const [changePassword, { data, loading, error }] = useMutation(CHANGE_USER_PASSWORD);

    if (loading) {
        console.log("loading...")
    }

    if (data) {
        console.log(data)
    }

    if (error) {
        console.log(error.message)
    }

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            Password: '',
            CPassword: ''
        },
        validationSchema: Yup.object({
            Password: Yup.string().required("Please Enter New Password"),
            CPassword: Yup.string().required("Please Confirm New Password"),
        }),
        onSubmit: (values) => {
            console.log(values);
            if (values.CPassword == values.Password) {
                changePassword({
                    variables: {
                        input: {
                            token: token,
                            Password: values.Password
                        }
                    }
                })
            }

        }
    });
    return (
        <React.Fragment>
            <div className="home-btn d-none d-sm-block">
                <Link to="/" className="text-dark">
                    <i className="fas fa-home h2" />
                </Link>
            </div>
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="overflow-hidden">
                                <div className="bg-soft bg-primary">
                                    <Row>
                                        <Col className="col-7">
                                            <div className="text-primary p-4">
                                                <h5 className="text-primary">Reset Password</h5>
                                                <p></p>
                                            </div>
                                        </Col>
                                        <Col className="col-5 align-self-end">
                                            <img src={profile} alt="" className="img-fluid" />
                                        </Col>
                                    </Row>
                                </div>
                                <CardBody className="pt-0">
                                    <div className="p-2">
                                        <Form
                                            className="form-horizontal"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                validation.handleSubmit();
                                                return false;
                                            }}
                                        >
                                            <Row>
                                                <div className="mb-3">
                                                    <Label className="form-label">New Password</Label>
                                                    <Input
                                                        name="Password"
                                                        className="form-control"
                                                        placeholder="Enter New Password"
                                                        type="password"
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
                                            </Row>
                                            <Row>
                                                <div className="mb-3">
                                                    <Label className="form-label">Confirm New Password</Label>
                                                    <Input
                                                        name="CPassword"
                                                        className="form-control"
                                                        placeholder="Confirm New Password"
                                                        type="password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.CPassword || ""}
                                                        invalid={
                                                            validation.touched.CPassword && validation.errors.CPassword ? true : false
                                                        }
                                                    />
                                                    {validation.touched.CPassword && validation.errors.CPassword ? (
                                                        <FormFeedback type="invalid">{validation.errors.CPassword}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </Row>
                                            <Row className="mb-3">
                                                <Col className="text-end">
                                                    <button
                                                        className="btn btn-primary w-md "
                                                        type="submit"
                                                    >
                                                        Change
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>

                                    {error && error ? (
                                        <Alert color="danger" style={{ marginTop: "20px" }}>{error.message}</Alert>
                                    ) : null}

                                    {data && data ? (
                                        <Alert color="danger" style={{ marginTop: "20px" }}>{data.resetPassword+": Back To Login"}</Alert>
                                    ) : null}

                                    <div className="mt-4 text-center">
                                        <p>
                                            Go back to{" "}
                                            <Link
                                                to="/login"
                                                className="fw-medium text-primary"
                                            >
                                                {" "}
                                                Login{" "}
                                            </Link>{" "}
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ResetPassword;
