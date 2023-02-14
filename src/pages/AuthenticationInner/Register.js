import React, { useEffect, useState } from "react";
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, CardBody, Card, Container, Form, Label, Input, FormFeedback, UncontrolledAlert, Alert } from "reactstrap";
import profileImg from "../../assets/images/profile-img.png";
import { useMutation } from "@apollo/client";
import { USER_REGISTER } from "gqlOprations/Mutations";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import text from "./windowBase64.txt"

const Register = () => {

  //meta title
  document.title = "Sign Up";
  
  const [userImage, setUserImage] = useState()

  const history = useHistory();

  toastr.options = {
    positionClass: "toast-top-center",
    closeButton: true,
  }

  const [userRegister, { data, loading, error }] = useMutation(USER_REGISTER);

  if(data){
    toastr.success("Register Successful Please Login Your Account");
    history.push("/login");
  }


  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      id:null,
      firstName: '',
      lastName: '',
      Email: '',
      Password: '',
      Deleted:false,
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required("Please Enter Your First Name"),
      lastName: Yup.string().required("Please Enter Your Last Name"),
      Email: Yup.string().required("Please Enter Your Email"),
      Password: Yup.string().required("Please Enter Your Password"),
    }),

    onSubmit: (values) => {
      console.log(values.firstName, values.lastName, values.Email, values.Password, userImage);

      userRegister({
        variables:{
          input:{
            id: null,
            firstName: values.firstName,
            lastName: values.lastName,
            Email: values.Email,
            Password: values.Password,
            userImage: userImage,
            Deleted: false
          }
        },

        onCompleted: data => {
          // console.log(data)
          toastr.success("Register Successful Please Login Your Account");
          history.push("/login");
        }
      })
    }
  });

  useEffect(()=> {
    fetch(text)
    .then(r => r.text())
    .then(text => {
        console.log('text decoded:', text);
        setUserImage(text)

    });
  },[])

  console.log(alert)

  return (
    <React.Fragment>
      <div className="account-pages my-4 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={8} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h4 className="text-primary">SIGN UP</h4>
                        <p>Welcome !</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
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
                        <Label className="form-label">First Name</Label>
                        <Input
                          name="firstName"
                          type="text"
                          placeholder="Enter First Name"
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

                      <div className="mb-3">
                        <Label className="form-label">Last Name</Label>
                        <Input
                          name="lastName"
                          type="text"
                          placeholder="Enter Last Name"
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

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          id="email"
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
                          placeholder="Enter Password"
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
                      <div className="mt-4 d-grid">
                        <button
                          className="btn btn-primary btn-block "
                          type="submit"
                        >
                          {loading && loading ? (
                            <i className="bx bx-loader-alt bx-spin bx-sx"></i>
                          ) : "SIGN UP"}
                        </button>
                      </div>

                      {error && error ? (
                        <Alert color="danger" style={{ marginTop: "20px" }}>User Already Exist</Alert>
                      ) : null}

                      <div className="mt-4 text-center">
                        <p>
                          Already have an account ?{" "}
                          <Link
                            to="/login"
                            className="fw-medium text-primary"
                          >
                            {" "}
                            Sign In
                          </Link>{" "}
                        </p>
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

export default Register;
