import React, { useState, useRef } from "react"

import { Card, CardBody, Col, Container, Form, FormGroup, Input, Label, NavItem, NavLink, Row, TabContent, TabPane, CardTitle, Table } from "reactstrap"

import classnames from "classnames"
import { Link } from "react-router-dom"


import Slider from "react-rangeslider"
import "react-rangeslider/lib/index.css"
import UploadImg from "pages/CreateVm/UploadImg"
import RamSlider from "pages/CreateVm/RamSlider"
import StoregeSlider from "pages/CreateVm/StoregeSlider"


const DcVm = () => {

    const [passedSteps, setPassedSteps] = useState([1])
    const [passedStepsVertical, setPassedStepsVertical] = useState([1])
    const [activeTabVartical, setoggleTabVertical] = useState(1)

    const uploadedImage = useRef(null);
    const imageUploader = useRef(null);

    const handleImageUpload = e => {
        const [file] = e.target.files;
        if (file) {
            const reader = new FileReader();
            const { current } = uploadedImage;
            current.file = file;
            reader.onload = e => {
                current.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    function toggleTabVertical(tab) {
        if (activeTabVartical !== tab) {
            var modifiedSteps = [...passedStepsVertical, tab]

            if (tab >= 1 && tab <= 4) {
                setoggleTabVertical(tab)
                setPassedStepsVertical(modifiedSteps)
            }
        }
    }

    return (
        <React.Fragment>
            <Col lg="12">
                <Card>
                    <CardBody>
                        <h4 className="card-title mb-4">Create VM</h4>
                        <div className="vertical-wizard wizard clearfix vertical">
                            <div className="steps clearfix">
                                <p>  </p>
                                <ul>
                                    <NavItem
                                        className={classnames({
                                            current: activeTabVartical === 1,
                                        })}
                                    >
                                        <NavLink
                                            className={classnames({
                                                active: activeTabVartical === 1,
                                            })}
                                            onClick={() => {
                                                toggleTabVertical(1)
                                            }}
                                            disabled={!(passedStepsVertical || []).includes(1)}
                                        >
                                            <span className="number">1.</span> CreateVm
                                        </NavLink>
                                    </NavItem>
                                    <NavItem
                                        className={classnames({
                                            current: activeTabVartical === 2,
                                        })}
                                    >
                                        <NavLink
                                            className={classnames({
                                                active: activeTabVartical === 2,
                                            })}
                                            onClick={() => {
                                                toggleTabVertical(2)
                                            }}
                                            disabled={!(passedStepsVertical || []).includes(2)}
                                        >
                                            <span className="number">2.</span>{" "}
                                            <span>Upload VM Image</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem
                                        className={classnames({
                                            current: activeTabVartical === 3,
                                        })}
                                    >
                                        <NavLink
                                            className={
                                                (classnames({
                                                    active: activeTabVartical === 3,
                                                }),
                                                    "done")
                                            }
                                            onClick={() => {
                                                toggleTabVertical(3)
                                            }}
                                            disabled={!(passedStepsVertical || []).includes(3)}
                                        >
                                            <span className="number">3.</span> Advance Options
                                        </NavLink>
                                    </NavItem>
                                    <NavItem
                                        className={classnames({
                                            current: activeTabVartical === 4,
                                        })}
                                    >
                                        <NavLink
                                            className={
                                                (classnames({
                                                    active: activeTabVartical === 4,
                                                }),
                                                    "done")
                                            }
                                            onClick={() => {
                                                toggleTabVertical(4)
                                            }}
                                            disabled={!(passedStepsVertical || []).includes(4)}
                                        >
                                            <span className="number">4.</span> Confirm Detail
                                        </NavLink>
                                    </NavItem>
                                </ul>
                            </div>
                            <div className="content clearfix">
                                <TabContent
                                    activeTab={activeTabVartical}
                                    className="body"
                                >
                                    <TabPane tabId={1}>
                                        <Form>
                                            <Row>
                                                <Col lg="6">
                                                    <Row>
                                                        <div className="mb-3" >
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
                                                                ISO File
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="basicpill-phoneno-input3"
                                                                placeholder="Enter ISO File"
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
                                                        <StoregeSlider />
                                                    </Row>
                                                    <br></br>

                                                    <Row>
                                                        <RamSlider />
                                                    </Row>
                                                    <Row>
                                                        <div style={{ height: "10px" }}></div>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </TabPane>
                                    <TabPane tabId={2}>
                                        <div>
                                            <Form>
                                                <div className="row justify-content-center">
                                                    <Col lg="6">
                                                        <div className="text-center">
                                                            <div style={{ height: "250px" }}>
                                                                <img ref={uploadedImage} width="270px" height="250px" style={{ borderRadius: "5px" }}></img>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col lg="6">
                                                        <div className="text-center" style={{ height: "265px" }}>
                                                            <br></br>
                                                            <br></br>
                                                            <br></br>
                                                            <br></br>
                                                            <br></br>
                                                            {/* <button
                                                                onClick={handleImageUpload}
                                                                // onChange={handleImageUpload}
                                                                type="file"
                                                                className="btn btn-primary  w-sm"
                                                            >
                                                                <i className="mdi mdi-upload d-block font-size-16"></i>{" "}
                                                            </button> */}
                                                            <Input className="form-control" type="file" id="formFile" accept="image/*" onChange={handleImageUpload} ref={imageUploader} />
                                                        </div>
                                                    </Col>
                                                </div>
                                            </Form>
                                        </div>
                                    </TabPane>
                                    <TabPane tabId={3}>
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
                                                                <div
                                                                    className="form-check form-switch form-switch-lg mb-3"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        id="customSwitchsizelg"
                                                                        defaultChecked
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="customSwitchsizelg"
                                                                    >
                                                                        Switch
                                                                    </label>
                                                                </div>
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
                                                        <div style={{ height: "10px" }}></div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </div>
                                    </TabPane>
                                    <TabPane tabId={4}>
                                        <div className="row justify-content-center">
                                            <Col lg="6">
                                                <div className="text-center" style={{ height: "265px" }}>
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
                                            activeTabVartical === 1
                                                ? "previous disabled"
                                                : "previous"
                                        }
                                    >
                                        <Link
                                            to="#"
                                            onClick={() => {
                                                toggleTabVertical(activeTabVartical - 1)
                                            }}
                                        >
                                            Previous
                                        </Link>
                                    </li>
                                    <li
                                        className={
                                            activeTabVartical === 4 ? "next disabled" : "next"
                                        }
                                    >
                                        <Link
                                            to="#"
                                            onClick={() => {
                                                toggleTabVertical(activeTabVartical + 1)
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
            </Col>
        </React.Fragment>
    )
};



export default DcVm;
