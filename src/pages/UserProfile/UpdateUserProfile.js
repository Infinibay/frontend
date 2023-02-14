import React, { useState, useRef } from "react"
import { Card, CardBody, Col, Button, Container, CardImg, CardText, Form, FormGroup, Input, Label, NavItem, NavLink, Row, TabContent, TabPane, CardTitle, Table } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import UpdateDetails from "./UpdateDetails"
import ChangePass from "./ChangePass"
import { useQuery } from "@apollo/client"
import { GET_USER_BY_ID } from "gqlOprations/Queries"

const UpdateUserProfile = () => {

    document.title = "Update User Profile";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="User Profile" breadcrumbItem="Update Profile" />
                    <Row>
                        <UpdateDetails />
                    </Row>
                    <Row>
                        <ChangePass />
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    )
}

export default UpdateUserProfile