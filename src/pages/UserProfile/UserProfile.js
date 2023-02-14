import React, { useState, useRef, useEffect } from "react"
import { Card, CardBody, Col, Button, Container, CardImg, CardText, Form, FormGroup, Input, Label, NavItem, NavLink, Row, TabContent, TabPane, CardTitle, Table } from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Link, useParams } from "react-router-dom"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { GET_USER_BY_ID } from "gqlOprations/Queries"
import alt from "assets/images/userAlt.jpg"


const UserProfile = () => {

    document.title = "Profile";

    const getCookies = (cname) => {
        const e = document.cookie.split("; ")
        let result = null
        e.forEach(element => {
            if (element.indexOf(cname) == 0) {
                result = element.substring(cname.length + 1)
            }
        })
        return result;
    }
    const mvid = getCookies("MvUserId");
    const mvtoken = getCookies("MvUserToken");
    // console.log(mvid)
    // console.log(mvtoken)


    const [getUserD, { data, loading, error }] = useLazyQuery(GET_USER_BY_ID, {
        variables: {
            input: {
                id: mvid,
                token: mvtoken
            }
        },
        onCompleted: data => {
            console.log("ddd")
        },
        fetchPolicy: "cache-and-network"
    })

    useEffect(() => { getUserD() }, [])


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Profile" breadcrumbItem="User Profile" />
                    <Row>
                        <Col lg="12">
                            <Card>
                                <Row>
                                    <Col lg="4">
                                        <Card >
                                            <CardBody>
                                                <h4 className="card-title mb-4">User Image</h4>
                                                <CardImg className="img-fluid rounded-circle"
                                                    // src={data && data ? ("http://167.99.36.48:3003/" + data.getUserByID.User_Image.split("app/")[1]) : null}
                                                    src={data && data ? (
                                                        data.getUserByID.User_Image.length < 2 && data.getUserByID.User_Image.length < 2 ? (
                                                            alt) : ("http://167.99.36.48:3003/" + data.getUserByID.User_Image.split("app/")[1]
                                                        )
                                                    ) :
                                                        alt || alt}
                                                    style={{ height: "330px", width: "330px", marginLeft: "20px" }} />
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col lg="8">
                                        <Card>
                                            <CardBody>
                                                <h4 className="card-title mb-4">User Details</h4>
                                                <Row>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                <CardTitle>First Name:</CardTitle>
                                                                <CardText>
                                                                    {loading && loading ? (<i className="bx bx-loader-alt bx-spin bx-sx"></i>) :
                                                                        data && data ? (
                                                                            data.getUserByID.First_Name
                                                                        ) : null
                                                                    }
                                                                </CardText>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                <CardTitle>Last Name:</CardTitle>
                                                                <CardText>
                                                                    {loading && loading ? (<i className="bx bx-loader-alt bx-spin bx-sx"></i>) :
                                                                        data && data ? (
                                                                            data.getUserByID.Last_Name
                                                                        ) : null
                                                                    }
                                                                </CardText>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Card>
                                                            <CardBody>
                                                                <CardTitle>Email:</CardTitle>
                                                                <CardText>
                                                                    {loading && loading ? (<i className="bx bx-loader-alt bx-spin bx-sx"></i>) :
                                                                        data && data ? (
                                                                            data.getUserByID.Email
                                                                        ) : null
                                                                    }
                                                                </CardText>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col style={{ marginTop: "67px" }}>
                                                        <Link to={`/updateprofile/${mvid}/${mvtoken}`} >
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary  btn-label">
                                                                <i className="bx bx-sync label-icon"></i> Update Profile
                                                            </button>
                                                        </Link>
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

export default UserProfile