import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, CardHeader, Col, TabContent, TabPane, DropdownMenu, DropdownToggle, UncontrolledDropdown, Row, } from "reactstrap"
import classnames from "classnames"
import img1 from "../../assets/images/small/img-6.jpg"
import img2 from "../../assets/images/small/img-2.jpg"
import img3 from "../../assets/images/small/img-1.jpg"

//SimpleBar
import SimpleBar from "simplebar-react"

const VmNotification = props => {
    const [activeTab, setActiveTab] = useState("1")

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }
    return (
        <React.Fragment>
            <Col lg="12">
                <Card>
                    <div style={{ height: "469px" }}>
                        <CardHeader className="bg-transparent border-bottom">
                            <div className="d-flex flex-wrap">
                                <div className="me-2">
                                    <h5 className="card-title mt-1 mb-0">Notifications</h5>
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody className="d-flex justify-content-center align-items-center">
                            <div className="justify-content-center" style={{ marginTop: "120px" }}>
                                <Row className="justify-content-center">
                                    <i className="bx bx-bell-off bx-lg d-flex justify-content-center"></i>
                                </Row>
                                <Row className="justify-content-center">
                                    No Notifications yet
                                </Row>
                            </div>
                            {/* <SimpleBar style={{ maxHeight: "380px" }}>
                                <div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item py-3">
                                            <div className="d-flex">
                                                <div className="me-3">
                                                    <img
                                                        src={img1}
                                                        alt=""
                                                        className="avatar-md h-auto d-block rounded"
                                                    />
                                                </div>

                                                <div className="align-self-center overflow-hidden me-auto">
                                                    <div>
                                                        <h5 className="font-size-14 text-truncate">
                                                            <Link to="#" className="text-dark">
                                                                Beautiful Day with Friends
                                                            </Link>
                                                        </h5>
                                                        <p className="text-muted mb-0">10 Nov, 2020</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </li>

                                        <li className="list-group-item py-3">
                                            <div className="d-flex">
                                                <div className="me-3">
                                                    <img
                                                        src={img2}
                                                        alt=""
                                                        className="avatar-md h-auto d-block rounded"
                                                    />
                                                </div>
                                                <div className="align-self-center overflow-hidden me-auto">
                                                    <div>
                                                        <h5 className="font-size-14 text-truncate">
                                                            <Link to="#" className="text-dark">
                                                                Drawing a sketch
                                                            </Link>
                                                        </h5>
                                                        <p className="text-muted mb-0">02 Nov, 2020</p>
                                                    </div>
                                                </div>

                                                <UncontrolledDropdown className="ms-2">
                                                    <DropdownToggle
                                                        className="text-muted font-size-14"
                                                        color="white"
                                                        type="button"
                                                    >
                                                        <i className="mdi mdi-dots-horizontal"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end">
                                                        <Link className="dropdown-item" to="#">
                                                            Action
                                                        </Link>
                                                        <Link className="dropdown-item" to="#">
                                                            Another action
                                                        </Link>
                                                        <Link className="dropdown-item" to="#">
                                                            Something else
                                                        </Link>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </div>
                                        </li>

                                        <li className="list-group-item py-3">
                                            <div className="d-flex">
                                                <div className="me-3">
                                                    <img
                                                        src={img2}
                                                        alt=""
                                                        className="avatar-md h-auto d-block rounded"
                                                    />
                                                </div>
                                                <div className="align-self-center overflow-hidden me-auto">
                                                    <div>
                                                        <h5 className="font-size-14 text-truncate">
                                                            <Link to="#" className="text-dark">
                                                                Drawing a sketch
                                                            </Link>
                                                        </h5>
                                                        <p className="text-muted mb-0">02 Nov, 2020</p>
                                                    </div>
                                                </div>

                                                <UncontrolledDropdown className="ms-2">
                                                    <DropdownToggle
                                                        className="text-muted font-size-14"
                                                        color="white"
                                                        type="button"
                                                    >
                                                        <i className="mdi mdi-dots-horizontal"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end">
                                                        <Link className="dropdown-item" to="#">
                                                            Action
                                                        </Link>
                                                        <Link className="dropdown-item" to="#">
                                                            Another action
                                                        </Link>
                                                        <Link className="dropdown-item" to="#">
                                                            Something else
                                                        </Link>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </div>
                                        </li>

                                        <li className="list-group-item py-3">
                                            <div className="d-flex">
                                                <div className="me-3">
                                                    <img
                                                        src={img3}
                                                        alt=""
                                                        className="avatar-md h-auto d-block rounded"
                                                    />
                                                </div>

                                                <div className="align-self-center overflow-hidden me-auto">
                                                    <div>
                                                        <h5 className="font-size-14 text-truncate">
                                                            <Link to="#" className="text-dark">
                                                                Project discussion with team
                                                            </Link>
                                                        </h5>
                                                        <p className="text-muted mb-0">24 Oct, 2020</p>
                                                    </div>
                                                </div>

                                                <UncontrolledDropdown className="ms-2">
                                                    <DropdownToggle
                                                        className="text-muted font-size-14"
                                                        color="white"
                                                        type="button"
                                                    >
                                                        <i className="mdi mdi-dots-horizontal"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end">
                                                        <Link className="dropdown-item" to="#">
                                                            Action
                                                        </Link>
                                                        <Link className="dropdown-item" to="#">
                                                            Another action
                                                        </Link>
                                                        <Link className="dropdown-item" to="#">
                                                            Something else
                                                        </Link>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </div>
                                        </li>

                                        <li className="list-group-item py-3">
                                            <div className="d-flex">
                                                <div className="me-3">
                                                    <img
                                                        src={img2}
                                                        alt=""
                                                        className="avatar-md h-auto d-block rounded"
                                                    />
                                                </div>

                                                <div className="align-self-center overflow-hidden me-auto">
                                                    <div>
                                                        <h5 className="font-size-14 text-truncate">
                                                            <Link to="#" className="text-dark">
                                                                Riding bike on road
                                                            </Link>
                                                        </h5>
                                                        <p className="text-muted mb-0">20 Oct, 2020</p>
                                                    </div>
                                                </div>

                                                <UncontrolledDropdown className="ms-2">
                                                    <DropdownToggle
                                                        className="text-muted font-size-14"
                                                        color="white"
                                                        type="button"
                                                    >
                                                        <i className="mdi mdi-dots-horizontal"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-end">
                                                        <Link className="dropdown-item" to="#">
                                                            Action
                                                        </Link>
                                                        <Link className="dropdown-item" to="#">
                                                            Another action
                                                        </Link>
                                                        <Link className="dropdown-item" to="#">
                                                            Something else
                                                        </Link>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </SimpleBar> */}
                        </CardBody>
                    </div>
                </Card>

            </Col>
        </React.Fragment>
    )
}

export default VmNotification
