import React, { useState } from "react"

import { Container, Row,} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import DcVm from "pages/VmDashboard/DcVm"
import "react-rangeslider/lib/index.css"



const CreateVm = () => {

  document.title = "Create Vm";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="VM List" breadcrumbItem="Create VM" />
          <Row>
            <DcVm />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CreateVm;
