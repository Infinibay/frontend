import React from "react";
import { Row, Col, CardBody, Card, Container, Button, Form, Label, Input, FormFeedback, Alert } from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { EMAIL_VERIFICATION } from "gqlOprations/Mutations";
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";
import { useMutation } from "@apollo/client";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const ForgetPasswordPage = () => {

  document.title = "Email Verification"

  toastr.options = {
    positionClass: "toast-top-center",
    closeButton: true,
  }

  const [emailVerification, { data, loading, error }] = useMutation(EMAIL_VERIFICATION);

  if (loading) {
    console.log("loading...")
  }
  if (data) {
    console.log(data)
  }
  if (error) {
    console.log(error)
  }

  const history = useHistory();
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      Email: '',
    },
    validationSchema: Yup.object({
      Email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
      console.log(values);

      emailVerification({
        variables: {
          input: values
        }
      });
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
                        <h5 className="text-primary">Email Verification</h5>
                        <p>Enter Your Valid Mail</p>
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
                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md "
                            type="submit"
                            id="vMailBtn"
                          >
                            Verify
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </div>

                  {error && error ? (
                    <Alert color="danger" style={{ marginTop: "20px" }}>Please Enter Valid Email</Alert>
                  ) : null}

                  {data && data ? (
                    <Alert color="success" style={{ marginTop: "20px" }}>check Your Mail</Alert>
                  ) : null}

                  <div className="mt-4 text-center">
                    <p>
                      Go back to{" "}
                      <Link
                        to="/login"
                        className="fw-medium text-primary"
                      >
                        {" "}
                        Sign In{" "}
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

export default ForgetPasswordPage;
