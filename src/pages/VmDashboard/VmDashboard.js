import React from 'react'
import {Col, Container, Row, } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb";
import VmNotification from 'pages/CreateVm/VmNotification';
import DcVm from './DcVm';
import DashVmCard from './DashVmCard';


const VmDashboard = () => {
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Dashboard" breadcrumbItem="Dashboard" />
                    <Row>
                        <Col lg="8">
                            <DcVm />
                        </Col>
                        <Col lg="4">
                            <VmNotification />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <h4 className="card-title mb-4">Active Virtual Machines</h4>
                            <Row>
                                <DashVmCard />
                                <DashVmCard />
                                <DashVmCard />
                                <DashVmCard />
                            </Row>
                        </Col>
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    )
}

export default VmDashboard