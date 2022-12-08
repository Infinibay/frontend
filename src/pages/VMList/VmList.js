import React from 'react'
import { useHistory } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Card, CardBody, Container, Col, Row } from 'reactstrap';
import VmCard from './VmCard';



const VmList = () => {

    const history = useHistory();

    document.title = "VM List";

    return (
        <React.Fragment>
            <div className="page-content">

                <Container fluid={true}>
                    <Breadcrumbs title="VM list" breadcrumbItem="VM List" />
                </Container>

                <div className='mb-2 overflow-auto' >
                    <button
                        className="btn btn-primary w-md float-end"
                        onClick={() => history.push('/createvm')}
                    >
                        Create VM
                    </button>
                    <button
                        className="btn btn-danger w-md float-end"
                        onClick={() => history.push('/createvm')}
                        style={{marginRight:"10px"}}
                    >
                        Delete Selected VMs
                    </button>
                </div>

                <Row>
                    <VmCard />
                    <VmCard />
                    <VmCard />
                    <VmCard />
                    <VmCard />
                    <VmCard />
                    <VmCard />
                    <VmCard />
                    <VmCard />
                </Row>
            </div>
        </React.Fragment>
    )
}

export default VmList;