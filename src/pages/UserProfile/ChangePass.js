import { useMutation } from "@apollo/client";
import { CHANGE_USER_PASSWORD } from "gqlOprations/Mutations";
import { set } from "lodash";
import React, { useState, useRef } from "react"
import { Card, CardBody, Col, Form, Input, Label, Row, FormFeedback } from "reactstrap"
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";


const ChangePass = () => {

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
    // console.log(mvToken);

    toastr.options = {
        positionClass: "toast-top-center",
        closeButton: true,
    }

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
            // console.log(values);
            if (values.CPassword == values.Password) {
                changePassword({
                    variables: {
                        input: {
                            token: mvToken,
                            Password: values.Password
                        }
                    }
                })

            }
            toastr.success("Password Reset");
        }
    });
    
    return (
        <React.Fragment>
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
                                <Col lg="12">
                                    <Card >
                                        <CardBody>
                                            <h4 className="card-title mb-4">Change Password</h4>
                                            <Row>
                                                <Col>
                                                    <div className="mb-3">
                                                        <Label htmlFor="formrow-email-Input">New Password</Label>
                                                        <Input
                                                            type="password"
                                                            className="form-control"
                                                            id="pass1-Input"
                                                            placeholder="Enter New Password"
                                                            name="Password"
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
                                                <Col>
                                                    <div className="mb-3">
                                                        <Label htmlFor="pass2-Input">Confirm Password</Label>
                                                        <Input
                                                            type="password"
                                                            className="form-control"
                                                            id="formrow-email-Input"
                                                            placeholder="Confirm Password"
                                                            name="CPassword"
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
                                                </Col>
                                                <Col style={{ marginTop: "25px" }}>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary  btn-label">
                                                        {loading && loading ? (<i className="bx bx-sync label-icon bx-spin"></i>) :
                                                            (<i className="bx bx-sync label-icon"></i>)} Change Now
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
        </React.Fragment>
    )
};

export default ChangePass;

