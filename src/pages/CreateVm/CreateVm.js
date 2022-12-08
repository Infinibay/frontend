import React, { useState } from "react"

import { Card, CardBody, Col, Container, Form, FormGroup, Input, Label, NavItem, NavLink, Row, TabContent, TabPane, CardTitle, Table } from "reactstrap"

import classnames from "classnames"
import { Link } from "react-router-dom"

import Breadcrumbs from "../../components/Common/Breadcrumb"
import DcVm from "pages/VmDashboard/DcVm"

import Slider from "react-rangeslider"
import "react-rangeslider/lib/index.css"
import RamSlider from "./RamSlider"
import StoregeSlider from "./StoregeSlider"
import UploadImg from "./UploadImg"


const CreateVm = () => {

  document.title = "Create Vm";

  // const [prefix, setprefix] = useState(50)
  // const [activeTab, setactiveTab] = useState(1)
  // const [passedSteps, setPassedSteps] = useState([1])

  // function toggleTab(tab) {
  //   if (activeTab !== tab) {
  //     var modifiedSteps = [...passedSteps, tab]
  //     if (tab >= 1 && tab <= 3) {
  //       setactiveTab(tab)
  //       setPassedSteps(modifiedSteps)
  //     }
  //   }
  // }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Create Vm" breadcrumbItem="Create VM" />
          <Row>
          <DcVm/>


          {/* <Row>
            <Col xl="4">
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">VM Image</CardTitle>
                  <CardBody>
                    <UploadImg/>
                  </CardBody>
                </CardBody>
              </Card>
            </Col>

            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Create VM</h4>
                  <div className="wizard clearfix">
                    <div className="steps clearfix">
                      <ul>
                        <NavItem
                          className={classnames({ current: activeTab === 1 })}
                        >
                          <NavLink
                            className={classnames({ current: activeTab === 1 })}
                            onClick={() => {
                              setactiveTab(1)
                            }}
                            disabled={!(passedSteps || []).includes(1)}
                          >
                            <span className="number">01</span> Create
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 2 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 2 })}
                            onClick={() => {
                              setactiveTab(2)
                            }}
                            disabled={!(passedSteps || []).includes(2)}
                          >
                            <span className="number ms-2">02</span> Advanced Settings
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 3 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 3 })}
                            onClick={() => {
                              setactiveTab(3)
                            }}
                            disabled={!(passedSteps || []).includes(3)}
                          >
                            <span className="number">03</span> Confirm Detail
                          </NavLink>
                        </NavItem>
                      </ul>
                    </div>
                    <div className="content clearfix mt-4">
                      <TabContent activeTab={activeTab}>
                        <TabPane tabId={1}>
                          <Form>
                            <Row>
                              <Col lg="6">
                                <Row>
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
                                </Row>
                                <Row>
                                  <div className="mb-3">
                                    <Label for="basicpill-phoneno-input3">
                                      IOS File
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="basicpill-phoneno-input3"
                                      placeholder="Enter IOS"
                                    />
                                  </div>
                                </Row>
                                <Row>
                                  <div className="mb-3">
                                    <Label for="basicpill-phoneno-input3">
                                      Operating System:
                                    </Label>
                                    <select className="form-control">
                                      <option> Windows </option>
                                      <option> Linux </option>
                                      <option> IOS </option>
                                      <option> Others </option>
                                    </select>
                                  </div>
                                </Row>
                              </Col>
                              <Col lg="6">
                                <Row>
                                  <StoregeSlider/>
                                </Row>
                                <br></br>
                                
                                <Row>
                                    <RamSlider/>
                                </Row>
                              </Col>
                            </Row>

                            <Row>
                              <Col lg="12">
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
                              </Col>
                            </Row>
                          </Form>
                        </TabPane>
                        <TabPane tabId={2}>
                          <div>
                            <Form>
                              <Row>
                                <Col lg="6">
                                  <Row>
                                  <div className="mb-3">
                                    <Label for="basicpill-phoneno-input3">
                                    CPU's:
                                    </Label>
                                    <select className="form-control">
                                      <option> 0 </option>
                                      <option> 1 </option>
                                      <option> 2 </option>
                                      <option> 3 </option>
                                      <option> 4 </option>
                                      <option> 5 </option>
                                    </select>
                                    <Label> minimum requird 2 </Label>
                                  </div>
                                  </Row>
                                  <br></br>
                                  <br></br>
                                  <Row>
                                  <div className="mb-3">
                                    <Label for="basicpill-phoneno-input3">
                                    TPM Module:
                                    </Label>
                                    <select className="form-control">
                                      <option> 0 </option>
                                      <option> 1 </option>
                                      <option> 2 </option>
                                      <option> 3 </option>
                                      <option> 4 </option>
                                      <option> 5 </option>
                                    </select>
                                    <Label> Create </Label>
                                  </div>
                                  </Row>
                                  </Col>
                                  <Col lg="6">
                                  <Row>
                                  <div className="mb-3">
                                    <Label for="basicpill-phoneno-input3">
                                    I/O Diaries:
                                    </Label>
                                    <select className="form-control">
                                      <option> 0 </option>
                                      <option> 1 </option>
                                      <option> 2 </option>
                                      <option> 3 </option>
                                      <option> 4 </option>
                                      <option> 5 </option>
                                    </select>
                                    <Label> Create </Label>
                                  </div>
                                  </Row>
                                  <br></br>
                                  <br></br>
                                  <Row>
                                  <div className="mb-3">
                                    <Label for="basicpill-phoneno-input3">
                                    Network:
                                    </Label>
                                    <select className="form-control">
                                      <option> 0 </option>
                                      <option> 1 </option>
                                      <option> 2 </option>
                                      <option> 3 </option>
                                      <option> 4 </option>
                                      <option> 5 </option>
                                    </select>
                                    <Label> Create </Label>
                                  </div>
                                  </Row>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>

                                </Col>
                              </Row>
                            </Form>
                          </div>
                        </TabPane>
                        <TabPane tabId={3}>
                          <div className="row justify-content-center">
                            <Col lg="6">
                              <div className="text-center">
                                <div className="mb-4">
                                  <i className="mdi mdi-check-circle-outline text-success display-4" />
                                </div>
                                <div>
                                  <h5>Confirm Detail</h5>
                                  <p className="text-muted">
                                    If several languages coalesce, the grammar
                                    of the resulting
                                  </p>
                                </div>
                              </div>
                            </Col>
                          </div>
                        </TabPane>
                      </TabContent>
                    </div>
                    <div className="actions clearfix">
                      <ul>
                        <li
                          className={
                            activeTab === 1 ? "previous disabled" : "previous"
                          }
                        >
                          <Link
                            to="#"
                            onClick={() => {
                              toggleTab(activeTab - 1)
                            }}
                          >
                            Back
                          </Link>
                        </li>
                        <li
                          className={activeTab === 3 ? "next disabled" : "next"}
                        >
                          <Link
                            to="#"
                            onClick={() => {
                              toggleTab(activeTab + 1)
                            }}
                          >
                            Next
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CreateVm;
