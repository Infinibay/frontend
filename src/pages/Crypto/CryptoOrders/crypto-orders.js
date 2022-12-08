import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Pdate, Type, Value, ValueinUSD, Status, Coin } from "./CryptoCol";

import TableContainer from "../../../components/Common/TableContainer";

//Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "assets/scss/datatables.scss";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getCryptoOrders } from "store/crypto/actions";

const CryptoOrders = props => {
  
  //meta title
  document.title="Orders | Skote - React Admin & Dashboard Template";

  const { orders, onGetOrders } = props;
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    onGetOrders();
  }, [onGetOrders]);

  const handleChange = date => {
    // setStartDate(date)
  };

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  // Table Data
  const productData = [
    {
      id: 1,
      pdate: "03 Mar, 2020",
      type: "Buy",
      coin: "Litecoin",
      value: "0.00224 LTC",
      valueInUsd: "$ 1773.01",
      status: "completed",
    },
    {
      id: 2,
      pdate: "01 Apr, 2020",
      type: "Sell",
      coin: "Bitcoin",
      value: "0.01224 LTC",
      valueInUsd: "$ 2773.01",
      status: "Pending",
    },
    {
      id: 3,
      pdate: "03 Mar, 2020",
      type: "Buy",
      coin: "Litecoin",
      value: "1.00224 LTC",
      valueInUsd: "$ 3773.01",
      status: "completed",
    },
    {
      id: 4,
      pdate: "13 May, 2020",
      type: "Buy",
      coin: "Litecoin",
      value: "2.00224 LTC",
      valueInUsd: "$ 4773.01",
      status: "completed",
    },
    {
      id: 5,
      pdate: "16 Jun, 2020",
      type: "Sell",
      coin: "Bitcoin",
      value: "0.02224 LTC",
      valueInUsd: "$ 5773.01",
      status: "Pending",
    },
    {
      id: 6,
      pdate: "03 Mar, 2020",
      type: "Sell",
      coin: "Litecoin",
      value: "0.10224 LTC",
      valueInUsd: "$ 6773.01",
      status: "completed",
    },
    {
      id: 7,
      pdate: "23 Mar, 2020",
      type: "Buy",
      coin: "Bitcoin",
      value: "5.00224 LTC",
      valueInUsd: "$ 1773.01",
      status: "completed",
    },
    {
      id: 8,
      pdate: "13 Mar, 2020",
      type: "Sell",
      coin: "Litecoin",
      value: "0.00224 LTC",
      valueInUsd: "$ 1773.01",
      status: "Pending",
    },
    {
      id: 9,
      pdate: "4 Jan, 2020",
      type: "Buy",
      coin: "Litecoin",
      value: "0.00224 LTC",
      valueInUsd: "$ 2773.01",
      status: "completed",
    },
    {
      id: 10,
      pdate: "03 Mar, 2020",
      type: "Buy",
      coin: "Litecoin",
      value: "0.12224 LTC",
      valueInUsd: "$ 1773.01",
      status: "completed",
    },
    {
      id: 11,
      pdate: "03 Mar, 2020",
      type: "Sell",
      coin: "Bitcoin",
      value: "0.330224 LTC",
      valueInUsd: "$ 1773.01",
      status: "Pending",
    },
    {
      id: 12,
      pdate: "23 Oct, 2020",
      type: "Buy",
      coin: "Litecoin",
      value: "0.12224 LTC",
      valueInUsd: "$ 1273.01",
      status: "completed",
    },
    {
      id: 13,
      pdate: "13 Feb, 2020",
      type: "Sell",
      coin: "Litecoin",
      value: "0.50224 LTC",
      valueInUsd: "$ 1773.01",
      status: "completed",
    },
    {
      id: 14,
      pdate: "03 Mar, 2020",
      type: "Buy",
      coin: "Bitcoin",
      value: "0.70224 LTC",
      valueInUsd: "$ 1773.01",
      status: "Pending",
    },
    {
      id: 15,
      pdate: "22 Mar, 2020",
      type: "Sell",
      coin: "Bitcoin",
      value: "0.00224 LTC",
      valueInUsd: "$ 1773.01",
      status: "Pending",
    },
    {
      id: 16,
      pdate: "03 Mar, 2020",
      type: "Buy",
      coin: "Litecoin",
      value: "0.00224 LTC",
      valueInUsd: "$ 1773.01",
      status: "completed",
    },
    {
      id: 17,
      pdate: "13 Mar, 2020",
      type: "Sell",
      coin: "Litecoin",
      value: "0.00224 LTC",
      valueInUsd: "$ 1773.01",
      status: "Pending",
    },
    {
      id: 18,
      pdate: "4 Jan, 2020",
      type: "Buy",
      coin: "Litecoin",
      value: "0.00224 LTC",
      valueInUsd: "$ 2773.01",
      status: "completed",
    },
    {
      id: 19,
      pdate: "03 Mar, 2020",
      type: "Buy",
      coin: "Litecoin",
      value: "0.12224 LTC",
      valueInUsd: "$ 1773.01",
      status: "completed",
    },
    {
      id: 20,
      pdate: "03 Mar, 2020",
      type: "Sell",
      coin: "Bitcoin",
      value: "0.330224 LTC",
      valueInUsd: "$ 1773.01",
      status: "Pending",
    },
    {
      id: 21,
      pdate: "23 Oct, 2020",
      type: "Buy",
      coin: "Litecoin",
      value: "0.12224 LTC",
      valueInUsd: "$ 1273.01",
      status: "completed",
    },
    {
      id: 22,
      pdate: "13 Feb, 2020",
      type: "Sell",
      coin: "Litecoin",
      value: "0.50224 LTC",
      valueInUsd: "$ 1773.01",
      status: "completed",
    },
    {
      id: 23,
      pdate: "03 Mar, 2020",
      type: "Buy",
      coin: "Bitcoin",
      value: "0.70224 LTC",
      valueInUsd: "$ 1773.01",
      status: "Pending",
    },
    {
      id: 24,
      pdate: "22 Mar, 2020",
      type: "Sell",
      coin: "Bitcoin",
      value: "0.00224 LTC",
      valueInUsd: "$ 1773.01",
      status: "Pending",
    },
    {
      id: 25,
      pdate: "03 Mar, 2020",
      type: "Buy",
      coin: "Litecoin",
      value: "0.00224 LTC",
      valueInUsd: "$ 1773.01",
      status: "completed",
    },
  ];

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "pdate",
        filterable: true,
        Cell: cellProps => {
          return <Pdate {...cellProps} />;
        },
      },
      {
        Header: "Type",
        accessor: "type",
        filterable: true,
        Cell: cellProps => {
          return <Type {...cellProps} />;
        },
      },
      {
        Header: "Coin",
        accessor: "coin",
        filterable: true,
        Cell: cellProps => {
          return <Coin {...cellProps} />;
        },
      },
      {
        Header: "Value",
        accessor: "value",
        filterable: true,
        Cell: cellProps => {
          return <Value {...cellProps} />;
        },
      },
      {
        Header: "Value in USD",
        accessor: "valueInUsd",
        filterable: true,
        Cell: cellProps => {
          return <ValueinUSD {...cellProps} />;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: cellProps => {
          return <Status {...cellProps} />;
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Crypto" breadcrumbItem="Orders" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-3">Orders</h4>

                  <ul className="nav nav-tabs nav-tabs-custom" role="tablist">
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: activeTab === "1",
                        })}
                        onClick={() => {
                          toggleTab("1");
                        }}
                      >
                        All Orders
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({
                          active: activeTab === "2",
                        })}
                        onClick={() => {
                          toggleTab("2");
                        }}
                      >
                        Processing
                      </NavLink>
                    </NavItem>
                  </ul>

                  <TabContent activeTab={activeTab} className="p-3">
                    <TabPane tabId="1" id="all-order">
                      <Form>
                        <Row className="mb-4">
                          <div className="col-xl col-sm-6">
                            <FormGroup className="mt-3 mb-0">
                              <Label>Date :</Label>
                              <DatePicker
                                onChange={handleChange}
                                className="form-control"
                                placeholderText="Select date"
                              />
                            </FormGroup>
                          </div>

                          <div className="col-xl col-sm-6">
                            <FormGroup className="mt-3 mb-0">
                              <Label>Coin</Label>
                              <select className="form-control select2-search-disable">
                                <option value="BTC" defaultValue>
                                  Bitcoin
                                </option>
                                <option value="ETH">Ethereum</option>
                                <option value="LTC">litecoin</option>
                              </select>
                            </FormGroup>
                          </div>

                          <div className="col-xl col-sm-6">
                            <FormGroup className="mt-3 mb-0">
                              <Label>Type</Label>
                              <select className="form-control select2-search-disable">
                                <option value="BU" defaultValue>
                                  Buy
                                </option>
                                <option value="SE">Sell</option>
                              </select>
                            </FormGroup>
                          </div>

                          <div className="col-xl col-sm-6">
                            <FormGroup className="mt-3 mb-0">
                              <Label>Status</Label>
                              <select className="form-control select2-search-disable">
                                <option value="CO" defaultValue>
                                  Completed
                                </option>
                                <option value="PE">Pending</option>
                              </select>
                            </FormGroup>
                          </div>

                          <div className="col-xl col-sm-6 align-self-end">
                            <div className="mt-3">
                              <Button
                                type="button"
                                color="primary"
                                className="w-md"
                              >
                                Add Order
                              </Button>
                            </div>
                          </div>
                        </Row>
                      </Form>

                      <TableContainer
                        columns={columns}
                        data={productData}
                        isGlobalFilter={false}
                        isAddOptions={false}
                        customPageSize={10}
                      />
                    </TabPane>
                    <TabPane tabId="2" id="processing">
                      <div>
                        <TableContainer
                          columns={columns}
                          data={productData}
                          isGlobalFilter={false}
                          isAddOptions={false}
                          customPageSize={10}
                        />
                      </div>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

CryptoOrders.propTypes = {
  orders: PropTypes.array,
  onGetOrders: PropTypes.func,
};

const mapStateToProps = ({ crypto }) => ({
  orders: crypto.orders,
});

const mapDispatchToProps = dispatch => ({
  onGetOrders: () => dispatch(getCryptoOrders()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CryptoOrders));
