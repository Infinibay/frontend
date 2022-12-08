import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom"
import { Col, Container, Row } from "reactstrap"
import { map } from "lodash"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

//Import Card
import CardContact from "./card-contact"

//redux
import { useSelector, useDispatch } from "react-redux";

import { getUsers as onGetUsers } from "../../store/contacts/actions"

const ContactsGrid = () => {

  //meta title
  document.title="User Grid | Skote - React Admin & Dashboard Template";

  const dispatch = useDispatch()

  const { users } = useSelector(state => ({
    users: state.contacts.users,
  }))

  useEffect(() => {
    if (users && !users.length) {
      dispatch(onGetUsers())
    }
  }, [dispatch, users])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="User Grid" />

          <Row>
            {map(users, (user, key) => (
              <CardContact user={user} key={"_user_" + key} />
            ))}
          </Row>

          <Row>
            <Col xs="12">
              <div className="text-center my-3">
                <Link to="#" className="text-success">
                  <i className="bx bx-hourglass bx-spin me-2" />
                  Load more
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(ContactsGrid)
