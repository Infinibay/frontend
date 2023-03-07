import React, { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import SocketIOFileUploadServer from "socketio-file-upload";
import * as Yup from "yup";
import { useFormik } from "formik";

import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    Modal,
    Container,
    Label,
    Progress,
    Input,
    FormFeedback,
    Form,
    Alert
} from "reactstrap";


const IsoModel = (props) => {

    const [modal_standard, setmodal_standard] = useState(false);
    const [vmPassData, setVmPassData] = useState({})
    const [alert, setAlert] = useState()

    // console.log(props.dataParentToChild)

    function tog_standard() {
        setmodal_standard(!modal_standard);
        removeBodyCss();
    }

    function removeBodyCss() {
        document.body.classList.add("no_padding");
    }

    // console.log(typeof(alert));

    const handleVmPassChange = (e) => {
        setVmPassData({
            ...vmPassData,
            [e.target.name]: e.target.value
        });
    }

    const handleVmPassSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://157.245.19.134:5001', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "jsonrpc": "2.0",
                "method": "updateSpicePasswordCall",
                "params": {
                    "name": props.dataParentToChild,
                    "password": vmPassData.VmPassword
                },
                "id": 1
            })
        })
        const res = await response.json();
        if (res) {
            console.log(res.result.status)
            if (res.result.status === true) {
                setAlert("true")
            }
            else {
                setAlert("false")
            }
        }
    }


    return (
        <React.Fragment>
            <Col>
                <div>
                    <button
                        style={{ float: "right" }}
                        type="button"
                        onClick={() => {
                            tog_standard();
                        }}
                        className="btn btn-primary btn-label"
                        data-toggle="modal"
                        data-target="#myModal"
                    >
                        <i className="bx bx-key label-icon"></i> Set Password
                    </button>
                    <Modal
                        isOpen={modal_standard}
                        toggle={() => {
                            tog_standard();
                        }}
                    >
                        <div className="modal-header">
                            <h5 className="modal-title mt-0" id="myModalLabel">
                                Set VirtualMachine Password
                            </h5>
                            <button
                                type="button"
                                onClick={() => {
                                    setmodal_standard(false);
                                }}
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">


                            <Row>
                                <div className="mb-3">
                                    <Label for="basicpill-phoneno-input3">
                                        Set Password
                                    </Label>
                                    <div>
                                        <Input
                                            type="password"
                                            className="form-control"
                                            id="setVmPass"
                                            placeholder="Set Vm Password"
                                            name="VmPassword"
                                            onChange={(e) => { handleVmPassChange(e) }}
                                        />
                                    </div>
                                </div>
                            </Row>

                            <Row>
                                <div className="mb-3">
                                    <Label for="basicpill-phoneno-input3">
                                        Confirm Password
                                    </Label>
                                    <div>
                                        <Input
                                            type="password"
                                            className="form-control"
                                            id="setVmPassC"
                                            placeholder="Confirm Vm Password"
                                            name="CVmPassword"
                                            onChange={(e) => { handleVmPassChange(e) }}
                                        />
                                    </div>
                                </div>
                            </Row>

                            <Row>
                                <Col>
                                    {alert && alert ? (
                                        alert === "false" && alert === "false" ? (
                                        <Alert color="danger">Failed To Update Password</Alert>)
                                        :<Alert color="success">Password Updated Successfully</Alert>
                                    ):null}
                                </Col>
                            </Row>

                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                onClick={() => {
                                    tog_standard();
                                }}
                                className="btn btn-secondary "
                                data-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary "
                                onClick={handleVmPassSubmit}
                            >
                                Save Password
                            </button>
                        </div>
                        {/* </Form> */}
                    </Modal>
                </div>
            </Col>

        </React.Fragment >
    )
}

export default IsoModel