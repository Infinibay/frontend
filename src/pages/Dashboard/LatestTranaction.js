import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { isEmpty } from "lodash";

import {
  Button,
  Card,
  CardBody,
} from "reactstrap";
import { getOrders as onGetOrders } from "store/actions";

import EcommerceOrdersModal from "../Ecommerce/EcommerceOrders/EcommerceOrdersModal";

import {
  OrderId,
  BillingName,
  Date,
  Total,
  PaymentStatus,
  PaymentMethod,
} from "./LatestTranactionCol";

import TableContainer from "../../components/Common/TableContainer";

//redux
import { useSelector, useDispatch } from "react-redux";

const LatestTranaction = props => {
  const dispatch = useDispatch();

  const { orders } = useSelector(state => ({
    orders: state.ecommerce.orders,
  }));

  useEffect(() => {
    dispatch(onGetOrders());
  }, [dispatch]);

  const [modal1, setModal1] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const toggleViewModal = () => setModal1(!modal1);

  const columns = useMemo(
    () => [
      {
        Header: "#",
        filterable: true,
        disableFilters: true,
        Cell: cellProps => {
          return <input type="checkbox" />;
        },
      },
      {
        Header: "Order ID",
        accessor: "orderId",
        filterable: true,
        disableFilters: true,
        Cell: cellProps => {
          return <OrderId {...cellProps} />;
        },
      },
      {
        Header: "Billing Name",
        accessor: "billingName",
        disableFilters: true,
        filterable: true,
        Cell: cellProps => {
          return <BillingName {...cellProps} />;
        },
      },
      {
        Header: "Date",
        accessor: "orderdate",
        disableFilters: true,
        filterable: true,
        Cell: cellProps => {
          return <Date {...cellProps} />;
        },
      },
      {
        Header: "Total",
        accessor: "total",
        disableFilters: true,
        filterable: true,
        Cell: cellProps => {
          return <Total {...cellProps} />;
        },
      },
      {
        Header: "Payment Status",
        accessor: "paymentStatus",
        disableFilters: true,
        filterable: true,
        Cell: cellProps => {
          return <PaymentStatus {...cellProps} />;
        },
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        disableFilters: true,
        Cell: cellProps => {
          return <PaymentMethod {...cellProps} />;
        },
      },
      {
        Header: "View Details",
        disableFilters: true,
        accessor: "view",
        Cell: cellProps => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm btn-rounded"
              onClick={toggleViewModal}
            >
              View Details
            </Button>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (orders && !orders.length) {
      onGetOrders();
    }
  }, [onGetOrders, orders]);

  useEffect(() => {
    setOrderList(orders);
  }, [orders]);

  useEffect(() => {
    if (!isEmpty(orders) && !!isEdit) {
      setOrderList(orders);
      setIsEdit(false);
    }
  }, [orders]);

  return (
    <React.Fragment>
      <EcommerceOrdersModal isOpen={modal1} toggle={toggleViewModal} />
      <Card>
        <CardBody>
          <div className="mb-4 h4 card-title">Latest Transaction</div>
          <TableContainer
            columns={columns}
            data={orders}
            isGlobalFilter={true}
            isAddOptions={false}
            customPageSize={6}
          />
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

LatestTranaction.propTypes = {
  orders: PropTypes.array,
  onGetOrders: PropTypes.func,
};

export default withRouter(LatestTranaction);
