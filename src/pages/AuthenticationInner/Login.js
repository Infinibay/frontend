import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, CardBody, Card, Container, Form, Input, Label, FormFeedback, Alert } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import profile from "../../assets/images/profile-img.png";
import { useMutation } from "@apollo/client";
import { USER_LOGIN } from "gqlOprations/Mutations";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const Login = () => {

  document.title = "Login";

  const history = useHistory();

  toastr.options = {
    positionClass: "toast-top-center",
    closeButton: true,
  }

  const [userLogin, { data, loading, error }] = useMutation(USER_LOGIN);

  if (data) {
    console.log(data);
    document.cookie = "MvUserToken" + "=" + data.Login.token;
    document.cookie = "MvUserId" + "=" + data.Login.id;
    document.cookie = "MvUserType" + "=" + data.Login.User_Type;
    toastr.success("Login Successful");
    history.push("/dashboard")
  }


  if (loading) {
    console.log("loading...")
  }

  if (error) {
    console.log(error.message)
  }

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      Email: '',
      Password: '',
    },
    validationSchema: Yup.object({
      Email: Yup.string().required("Please Enter Your Email"),
      Password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      console.log(values);

      userLogin({
        variables: {
          input: values
        }
      });
    }
  });
  return (
    <React.Fragment>
      <div className="account-pages my-4 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Please Sign in to continue</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div className="p-2">
                    <Form className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="Email"
                          className="form-control"
                          placeholder="Enter Your Email"
                          type="email"
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

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="Password"
                          type="password"
                          placeholder="Enter Your Password"
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

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          Remember me
                        </label>
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block "
                          type="submit"
                        >
                          {loading && loading ? (
                            <i className="bx bx-loader-alt bx-spin bx-sx"></i>
                          ) : "SIGN IN"}
                        </button>
                      </div>

                      {error && error ? (
                        <Alert color="danger" style={{ marginTop: "20px" }}>{error.message}</Alert>
                      ) : null}

                      <div className="mt-4 text-center">
                        <p>
                          Don&apos;t have an account ?{" "}
                          <Link
                            to="/register"
                            className="fw-medium text-primary"
                          >
                            {" "}
                            Signup now{" "}
                          </Link>{" "}
                        </p>
                      </div>

                      <div className="mt-4 text-center">
                        <Link to="/forgot-pwd" className="text-muted">
                          <i className="mdi mdi-lock me-1" /> Forgot your
                          password?
                        </Link>
                      </div>
                    </Form>
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

export default Login;
