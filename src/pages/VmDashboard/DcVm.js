import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Col, Container, Form, FormGroup, Input, Label, FormFeedback, NavItem, NavLink, Row, TabContent, TabPane, Progress, CardTitle, Table } from "reactstrap";
import classnames from "classnames";
import { Link, useHistory } from "react-router-dom";
import "react-rangeslider/lib/index.css";
import UploadImg from "pages/CreateVm/UploadImg";
import RamSlider from "pages/CreateVm/RamSlider";
import StoregeSlider from "pages/CreateVm/StoregeSlider";
import { io } from "socket.io-client";
import SocketIOFileUploadServer from "socketio-file-upload";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_CONFIG, GET_IOS_BY_ID, CHECK_VM_NAME } from "gqlOprations/Queries";
import { CREATE_ISO, CREATE_VM } from "gqlOprations/Mutations";
import alt from "assets/images/Azure.png"
import vin from "assets/images/widows.jpg"
import lin from "assets/images/linux.jpg"
import { use } from "i18next";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import text from "./windowBase64.txt"
import text1 from "./linuxBase64.txt"

const DcVm = () => {

    const [passedSteps, setPassedSteps] = useState([1]);
    const [passedStepsVertical, setPassedStepsVertical] = useState([1]);
    const [activeTabVartical, setoggleTabVertical] = useState(1);
    const [filename, setFilename] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [isoList, setIsoList] = useState([]);
    const [vmData, setVmData] = useState({
    });
    const [img, setImg] = useState();
    const [configData, setConfigData] = useState({});
    const [dropdownVal, setDropDownVal] = useState({});
    const [tpmSwitch, setTpmSwitch] = useState(false);
    const [nameV, setNameV] = useState();
    const [dropImage, setDropImage] = useState(alt);
    const history = useHistory()

    toastr.options = {
        positionClass: "toast-top-center",
        closeButton: true,
    }

    const handleTpmSwitch = () => {
        setTpmSwitch(!tpmSwitch);
        console.log(tpmSwitch)
        setConfigData({
            ...configData,
            getConfigFile: {
                ...configData.getConfigFile,
                TPM: tpmSwitch,
            }
        })
    }

    const handleIsoDrop = (e) => {
        e.preventDefault(),
            // console.log(e)
            setConfigData({
                ...configData,
                getConfigFile: {
                    ...configData.getConfigFile,
                    IsoFile: e.target.value,
                }
            })
        console.log(configData)
    }

    const handleOpDrop = (e) => {
        e.preventDefault(),
            // console.log(e)
        setConfigData({
            ...configData,
            getConfigFile: {
                ...configData.getConfigFile,
                Operating_System: e.target.value,
            }
        })

        // console.log(configData.getConfigFile.Operating_System)

        if (e.target.value === "Windows") {
            setDropImage(vin)
            fetch(text)
                .then(r => r.text())
                .then(text => {
                    // console.log('text decoded:', text);
                    setVmData(prevState => ({
                        ...prevState,
                        vmImage: text
                    }))
                });
        }

        if (e.target.value === "Linux" || "") {
            setDropImage(lin)
            fetch(text1)
                .then(r => r.text())
                .then(text => {
                    // console.log('text decoded:', text);
                    setVmData(prevState => ({
                        ...prevState,
                        vmImage: text
                    }))
                });
        }

        else {
            setDropImage(vin)
            fetch(text)
                .then(r => r.text())
                .then(text => {
                    // console.log('text decoded:', text);
                    setVmData(prevState => ({
                        ...prevState,
                        vmImage: text
                    }))
                });
        }
    }

    const handleCpuDrop = (e) => {
        e.preventDefault(),
            console.log(e)
        setConfigData({
            ...configData,
            getConfigFile: {
                ...configData.getConfigFile,
                processor: {
                    ...configData.getConfigFile.processor,
                    Processors: e.target.value
                }
            }
        })

        console.log(configData)
    }

    const getStorageVal = (storage) => {
        console.log("this is Storage Value : ",storage);
        // console.log(typeof(storage))
        setConfigData({
            ...configData,
            getConfigFile: {
                ...configData.getConfigFile,
                Storage: storage
            }
        })
    };
    const getRamVal = (ram) => {
        console.log("this is Ram Value : ", ram);
        setConfigData({
            ...configData,
            getConfigFile: {
                ...configData.getConfigFile,
                Memory: ram
            }
        })
    }

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
    const mvid = getCookies("MvUserId");

    const handleDataChange = (e) => {
        setVmData({
            ...vmData,
            [e.target.name]: e.target.value
        });
    };



    const [checkVmName, { loading: loadingE, data: dataE, error: errorE }] = useLazyQuery(CHECK_VM_NAME)
    const [getConfig, { loading: loadingD, data: dataD, error: errorD }] = useLazyQuery(GET_CONFIG);
    const [createIso, { loading: loadingB, data: dataB, error: errorB }] = useMutation(CREATE_ISO);
    const [createVm, { loading: loadingC, data: dataC, error: errorC }] = useMutation(CREATE_VM);
    const [getIsoList, { loading: loadingA, data: dataA, error: errorA }] = useLazyQuery(GET_IOS_BY_ID, {
        variables: {
            input: {
                token: mvToken
            }
        },
        onCompleted: dataA => {
            setIsoList(dataA.getIOSById)
        },
        fetchPolicy: "cache-and-network"
    });

    // console.log(mvToken)

    const vmValidation = e => {
        checkVmName({
            variables: {
                input: {
                    virtualMachineName: e.target.value
                }
            },
            onCompleted: dataE => {
                // console.log()
                setNameV(dataE.findVMName)
                // console.log(nameV.type)
            },
            fetchPolicy: "cache-and-network"
        })
    }

    if(dataC){
        console.log(dataC)
    }

    if (errorC){
        console.log(errorC)
    }

    const handleVmSubmit = (e) => {
        e.preventDefault(),
            console.log(vmData)
        console.log(configData)
        const config = JSON.stringify(configData);
        console.log(JSON.stringify(config));
        createVm({
            variables: {
                input: {
                    "Status": false,
                    "Config": config,
                    "token": mvToken,
                    "Title": vmData.virtualMachineName,
                    "virtualMachineName": vmData.virtualMachineName,
                    "Description": vmData.Description || "",
                    "vmImage": vmData.vmImage
                }
            },
            onCompleted: (dataC) => {
                toastr.success("Virtual Machine Created")
                history.push("/vmlist")
                console.log(dataC)
            }
        })
    }

    function toggleTabVertical(tab) {
        if (activeTabVartical !== tab) {
            var modifiedSteps = [...passedStepsVertical, tab]

            if (tab >= 1 && tab <= 4) {
                setoggleTabVertical(tab)
                setPassedStepsVertical(modifiedSteps)
            }
        }
    }

    const handleImageUp = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImg(reader.result.toString());
            const eImage = reader.result.toString();
            console.log(eImage)
            setVmData(prevState => ({
                ...prevState,
                vmImage: eImage
            })
            )
        };
        reader.readAsDataURL(file)
    }


    // const uplaodURL = 'http://placed.ro:2000';
    const uplaodURL = 'http://157.245.19.134:2000';

    useEffect(() => {
        var socket = io.connect(uplaodURL)
        var uploader = new SocketIOFileUploadServer(socket)

        uploader.addEventListener("complete", function (event) {
            console.log(event.file.name, 'Upload Complete');
            console.log(event.file, "111this is file ");
            // console.log(configData.getConfigFile.Operating_System || "")
            createIso({
                variables: {
                    input: {
                        Name: event.file.name,
                        Size: event.file.size,
                        Type: event.file.type,
                        userId: mvid,
                        token: mvToken
                    }
                },
                onCompleted: () => getIsoList()
            })

            toastr.success("Create Iso Successful");
            setUploadPercentage(p => 0)
        })
        uploader.addEventListener("choose", function (event) {
            console.log(event.file, "Choose");
        })
        uploader.addEventListener("start", function (event) {
            console.log(event.file.name, "Start");
            setFilename(p => (event.file.name))
            const videoFile = event.file;
            const filename=event.file.name.split(".");
            const ext=filename.pop();
            console.log(ext)
            if(ext.toLowerCase()!=='iso'){
                console.log('dd')
                toastr.error("Please Select Iso File");
                document.getElementById("file-upload-btn").removeEventListener("click",funcA=()=>{});
                uploader.destroy()
                toastr.error("Please Select Iso File");
            }
        })
        uploader.addEventListener("progress", function (event) {
            setUploadPercentage(p => (event.bytesLoaded / event.file.size * 100))
            console.log(event.bytesLoaded / event.file.size * 100, 'Upload progress');
        })
        uploader.addEventListener("load", function (event) {
            console.log(event.file.name, "load");
        })
        uploader.addEventListener("error", function (event) {
            console.error(event.message)
        })
        uploader.useBuffer = true
        uploader.chunkSize = ((1 * 1000) * (0.2 * 1000))
        //uploader.maxFileSize = 90000
        // uploader.useText = true
        // uploader.serializedOctets = true

        uploader.listenOnInput(document.getElementById("file-upload-btn"));

        document.getElementById("file-upload-btn").addEventListener("click", uploader.prompt, false);



    }, [])


    useEffect(() => {
        if (loadingD) console.log("loadingD...")
        if (dataD) {
            console.log(dataD);
            setConfigData(p => ({
                ...dataD,
                getConfigFile: {
                    ...dataD.getConfigFile,
                    Operating_System: "Windows",
                    IsoFile: "",
                    TPM: false,
                    processor: {
                        ...dataD.getConfigFile.processor,
                        Processors: 2
                    }
                }
            }))
        }
        if (errorD) console.log(errorD)
    }, [dataD])

    useEffect(() => { getConfig() }, [])
    useEffect(() => { getIsoList() }, [])

    useEffect(() => {
        setDropImage(vin)
        fetch(text)
            .then(r => r.text())
            .then(text => {
                // console.log('text decoded:', text);
                setVmData(prevState => ({
                    ...prevState,
                    vmImage: text
                }))
            });
    }, [])

    return (
        <React.Fragment>
            <Form onSubmit={handleVmSubmit}>
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
                                                <span className="number">1</span> Create VM
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
                                                <span className="number">2</span>{" "}
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
                                                <span className="number">3</span> Advance Options
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
                                            <Row>
                                                <Col lg="6">
                                                    <Row>
                                                        <div className="mb-3" >
                                                            <Label for="basicpill-phoneno-input3">
                                                                Name :
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                id="vm-name"
                                                                placeholder="Enter VM Name"
                                                                name="virtualMachineName"
                                                                // onChange={handleDataChange}
                                                                // onBlur={vmValidation}
                                                                onChange={(e) => { handleDataChange(e); vmValidation(e) }}
                                                                value={vmData.virtualMachineName || ""}
                                                                invalid={nameV === "true" && nameV === "true" ? true : false}
                                                                valid={nameV === "false" && nameV === "false" ? true : false}
                                                            />
                                                            {nameV === "true" && nameV === "true" ? (
                                                                <FormFeedback type="invalid">{"Invalid VM Name"}</FormFeedback>
                                                            ) : (<FormFeedback valid>{"valid VM Name"}</FormFeedback>)}
                                                            {/* {nameV.length  && nameV.length  < 1 ? ("nnnnn") : null} */}
                                                        </div>
                                                    </Row>
                                                    <Row>
                                                        <div className="mb-3">
                                                            <Label for="basicpill-phoneno-input3">
                                                                ISO File :
                                                            </Label>
                                                            <div>

                                                                <div>
                                                                    <div className="d-flex">
                                                                        <select defaultValue="0"
                                                                            className="form-select"
                                                                            style={{ marginRight: "5px" }}
                                                                            // onClick={handleDropDownClick}
                                                                            onChange={handleIsoDrop}
                                                                        // value={dropdownVal.IsoFile}
                                                                        // onClick={()=>console.log('dd')}
                                                                        >
                                                                            <option value="0">Choose...</option>
                                                                            {isoList.map(e => {
                                                                                return <option
                                                                                    key={e.id}
                                                                                    value={e.Name}
                                                                                >
                                                                                    {e.Name}
                                                                                </option>
                                                                            })}

                                                                        </select>
                                                                        <button
                                                                            style={{ margin: "0px" }}
                                                                            id="file-upload-btn"
                                                                            className="btn btn-primary"
                                                                            onClick={(e) => e.preventDefault()}
                                                                        >
                                                                            Upload
                                                                        </button>
                                                                    </div>
                                                                    <Progress
                                                                        className="progress-sm"
                                                                        color="primary"
                                                                        value={uploadPercentage}
                                                                        style={{ marginTop: "3px" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Row>
                                                    <Row>
                                                        <div className="mb-3">
                                                            <Label for="basicpill-phoneno-input3">
                                                                Operating System :
                                                            </Label>
                                                            <select
                                                                className="form-control"
                                                                name="Operating_System"
                                                                onChange={handleOpDrop}
                                                            >
                                                                <option> Windows </option>
                                                                <option> Linux </option>
                                                            </select>
                                                        </div>
                                                    </Row>
                                                </Col>
                                                <Col lg="6">
                                                    <Row>
                                                        <StoregeSlider sValue={getStorageVal} />
                                                    </Row>

                                                    <Row>
                                                        <RamSlider rValue={getRamVal} />
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <div className="mb-3">
                                                    <Label htmlFor="formmessage">Description :</Label>
                                                    <Input
                                                        type="textarea"
                                                        id="formmessage"
                                                        className="form-control"
                                                        rows="1"
                                                        placeholder="Enter your Message"
                                                        name="Description"
                                                        onChange={handleDataChange}
                                                        value={vmData.Description || ""}
                                                    />
                                                </div>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId={2}>
                                            <div style={{ marginBottom: "63px" }}>
                                                <div className="row justify-content-center">
                                                    <Col lg="6">
                                                        <div className="text-center">
                                                            <div style={{ height: "250px" }}>
                                                                <img
                                                                    src={img || dropImage}
                                                                    width="270px"
                                                                    height="250px"
                                                                    style={{ borderRadius: "5px" }}
                                                                ></img>
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
                                                            <Input
                                                                className="form-control"
                                                                type="file"
                                                                id="formFileImage"
                                                                accept="image/*"
                                                                name="vmImage"
                                                                onChange={handleImageUp}
                                                            />
                                                        </div>
                                                    </Col>
                                                </div>
                                            </div>
                                        </TabPane>
                                        <TabPane tabId={3}>
                                            <div style={{ marginBottom: "57px" }}>
                                                <Row>
                                                    <Col lg="6">
                                                        <Row>
                                                            <div className="mb-3">
                                                                <Label for="basicpill-phoneno-input3">
                                                                    CPU's:
                                                                </Label>
                                                                <select
                                                                    className="form-control"
                                                                    name="cpus"
                                                                    onChange={handleCpuDrop}
                                                                // value={dropdownVal.cpus}
                                                                >
                                                                    <option> 0 </option>
                                                                    <option> 1 </option>
                                                                    <option> 2 </option>
                                                                    <option> 3 </option>
                                                                    <option> 4 </option>
                                                                    <option> 5 </option>
                                                                </select>
                                                                <Label> Minimum required -2 </Label>
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
                                                                        onClick={(e) => { handleTpmSwitch(e) }}
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
                                                    </Col>
                                                </Row>
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
                                        {activeTabVartical < 3 && activeTabVartical < 3 ? (
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
                                        ) :
                                            <li>
                                                {/* <Link
                                                type="submit"
                                            >
                                                Submit
                                            </Link> */}
                                                <button
                                                    style={{ margin: 0 }}
                                                    id="update-submit"
                                                    type="submit"
                                                    className="btn btn-primary">
                                                    Submit
                                                </button>
                                            </li>
                                        }
                                    </ul>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Form>
        </React.Fragment>
    )
};



export default DcVm;
