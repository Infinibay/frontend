import React, { useEffect, useState } from 'react'
import { Card, CardBody, Col, Button, Container, CardImg, CardText, Form, FormGroup, Input, Label, NavItem, NavLink, Row, TabContent, TabPane, CardTitle, Table } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Link, useHistory, useParams } from "react-router-dom"
import StBtn from './StBtn'
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_SPECIFIC_VM } from 'gqlOprations/Queries'
import Vm from "../../assets/images/1..jpg";
import { DELETE_VM, VM_ACTION } from 'gqlOprations/Mutations'
import alt from "assets/images/Azure.png"


const VmDetails = () => {
    document.title = "VM Details";
    const history = useHistory();
    const { vmId } = useParams();
    const [svmData, setSvmData] = useState();
    const [state, setState] = useState();

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

    const [getSpecificVm, { loading, data, error }] = useLazyQuery(GET_SPECIFIC_VM, {
        variables: {
            input: {
                token: mvToken,
                id: vmId
            }
        },
        onCompleted: (data) => {
            setSvmData({ ...data })
            console.log(data, 'vvvvvvvvvvvvvvvvvvvvv');
            // setSvmData()
        },
        fetchPolicy: "cache-and-network"
    });
    console.log(svmData?.getSpecificVM, '...........')
    const [deleteVm, { loading: loadingA, data: dataA, error: errorA }] = useMutation(DELETE_VM)

    const [changeVmStatus, { loading: loadingB, data: dataB, error: errorB }] = useMutation(VM_ACTION)

    // if(dataA){
    //     console.log(dataA)
    // }

    const handleDeleteVm = () => {

        deleteVm({
            variables: {
                input: {
                    token: mvToken,
                    id: [vmId]
                }
            },
            onCompleted: (dataA) => {
                console.log(dataA);
                history.push("/vmlist")
            }

        });
    };

    const toggleTrue = () => {
        changeVmStatus({
            variables: {
                input: {
                    "button": false,
                    "id": vmId,
                    "token": mvToken
                }
            },
            onCompleted: () => {

                setSvmData(prev => {
                    const newData = { getSpecificVM: { ...prev.getSpecificVM, Status: false } }
                    return newData
                })

                // getSpecificVm()
            }
        })
    }

    const toggleFalse = () => {
        changeVmStatus({
            variables: {
                input: {
                    "button": true,
                    "id": vmId,
                    "token": mvToken
                }
            },
            // onCompleted: () => getSpecificVm()
            onCompleted: () => {
                setSvmData(prev => {
                    const newData = { getSpecificVM: { ...prev.getSpecificVM, Status: true } }
                    return newData
                })
            }
        })
    }

    const handleVnc = () => {
        window.open(`http://157.245.19.134/vmview/?name=${svmData.getSpecificVM.VirtualMachine_Name}`, '_blank', 'noreferrer')
    }


    useEffect(() => {
        getSpecificVm()
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="VM List" breadcrumbItem="VM Details" />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <Row>
                                    <Col lg="4">
                                        <Card >
                                            <CardBody>
                                                <h4 className="card-title mb-4">VM Image</h4>
                                                <CardImg className="img-fluid" src={svmData && svmData ? ("http://167.99.36.48:3003/" + svmData.getSpecificVM.VM_Image.split("app/")[1]) : alt} alt='Vm Image' style={{ height: "300px" }} />
                                            </CardBody>
                                            <CardBody>
                                                <Row>
                                                    <Col>
                                                        <div className="d-grid gap-2">
                                                            {svmData && svmData ? (
                                                                svmData.getSpecificVM.Status === true && svmData.getSpecificVM.Status ? (
                                                                    <Button onClick={toggleTrue} color={'danger'} type="button" className="btn btn-label" >
                                                                        <i className={'bx bx-pause label-icon'}></i>
                                                                        {'STOP'}
                                                                    </Button>
                                                                ) : (
                                                                    <Button onClick={toggleFalse} color={'success'} type="button" className="btn btn-label" >
                                                                        <i className={'bx bx-play label-icon'}></i>
                                                                        {'START'}
                                                                    </Button>
                                                                )
                                                            ) : ""}

                                                        </div>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col lg="8">
                                        <Card>
                                            <CardBody>
                                                <Row>
                                                    <Col lg="11">
                                                        <h4 className="card-title mb-4">VM Details</h4>
                                                    </Col>
                                                    <Col>

                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                <CardTitle>Name :</CardTitle>
                                                                <CardText>
                                                                    {svmData && svmData ? (svmData.getSpecificVM.VirtualMachine_Name) : ""}
                                                                </CardText>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                <CardTitle>Operating system :</CardTitle>
                                                                <CardText>
                                                                    {svmData && svmData ? (JSON.parse(svmData.getSpecificVM.Config).getConfigFile.Operating_System) : "Windows"}
                                                                </CardText>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                <CardTitle>Date :</CardTitle>
                                                                <CardText>
                                                                    31/12/1999
                                                                </CardText>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                <CardTitle>Description :</CardTitle>
                                                                <CardText>
                                                                    {svmData && svmData ? (svmData.getSpecificVM.Description) : ""}                                                                </CardText>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                <CardTitle>IP :</CardTitle>
                                                                <CardText>
                                                                    {"59.103.210.167"}
                                                                </CardText>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col></Col>
                                                </Row>

                                                <Row>
                                                    <Col>
                                                        <Link to={`/update-vm/${vmId}`} >
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary  btn-label">
                                                                <i className="bx bx-edit label-icon"></i> Update VM
                                                            </button>
                                                        </Link>
                                                    </Col>

                                                    <Col>

                                                        <button
                                                            type="button"
                                                            className="btn btn-danger  btn-label"
                                                            onClick={handleDeleteVm}
                                                        >
                                                            <i className="bx bx-trash label-icon"></i> Delete VM
                                                        </button>

                                                    </Col>

                                                    <Col>
                                                        {svmData && svmData ? (
                                                            svmData.getSpecificVM.Status === true && svmData.getSpecificVM.Status ? (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-success  btn-label"
                                                                    onClick={handleVnc}
                                                                >
                                                                    <i className="bx bx-window-open label-icon"></i> Open VNC
                                                                </button>
                                                            ) : (
                                                                ""
                                                            )
                                                        ) : ""}
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                </Container>
            </div>
        </React.Fragment >
    )
}

export default VmDetails