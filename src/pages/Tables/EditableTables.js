import React from "react";
import { useMemo } from "react";

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";

import TableContainer from "components/Common/TableContainer";

import { ID, Age, Qty, Cost } from "./EditableCol";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const products = [
  { id: 1, age: 25, qty: 1500, cost: 1000 },
  { id: 2, age: 34, qty: 1900, cost: 1300 },
  { id: 3, age: 67, qty: 1300, cost: 1300 },
  { id: 4, age: 23, qty: 1100, cost: 6400 },
  { id: 5, age: 48, qty: 1400, cost: 4000 },
  { id: 6, age: 57, qty: 1300, cost: 1000 },
  { id: 7, age: 51, qty: 1200, cost: 1300 },
  { id: 8, age: 85, qty: 1700, cost: 1300 },
  { id: 9, age: 37, qty: 1400, cost: 6400 },
  { id: 10, age: 14, qty: 1600, cost: 4000 },
];

const EditableTables = () => {

  //meta title
  document.title="Editable Table | Skote - React Admin & Dashboard Template";

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        filterable: true,
        disableFilters: true,
        Cell: cellProps => {
          return <ID {...cellProps} />;
        },
      },
      {
        Header: "Age",
        accessor: "age",
        filterable: true,
        disableFilters: true,
        Cell: cellProps => {
          return <Age {...cellProps} />;
        },
      },
      {
        Header: "Qty",
        accessor: "qty",
        filterable: true,
        disableFilters: true,
        Cell: cellProps => {
          return <Qty {...cellProps} />;
        },
      },
      {
        Header: "Cost",
        accessor: "cost",
        filterable: true,
        disableFilters: true,
        Cell: cellProps => {
          return <Cost {...cellProps} />;
        },
      },
    ],
    []
  );
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Tables" breadcrumbItem="Editable Table" />

          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-3">Datatable Editable </CardTitle>

                  <div>
                    <TableContainer
                      columns={columns}
                      data={products}
                      isGlobalFilter={false}
                      isAddOptions={false}
                      customPageSize={5}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EditableTables;
