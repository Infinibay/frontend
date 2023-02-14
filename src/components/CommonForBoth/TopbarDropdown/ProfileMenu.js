import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { withRouter, Link, useHistory } from "react-router-dom";
import { GET_USER_BY_ID } from "gqlOprations/Queries";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import alt from "assets/images/userAlt.jpg"

const ProfileMenu = props => {

  const [menu, setMenu] = useState(false);

  const [username, setusername] = useState("Admin");

  const history = useHistory();

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

  const [getprofileImage, { loading, data, error }] = useLazyQuery(GET_USER_BY_ID, {
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
  });

  useEffect(() => { getprofileImage() }, [])

  const handleLogOut = () => {
    document.cookie = "MvUserType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "MvUserToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "MvUserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    history.push("/login")
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={data && data ? (
              data.getUserByID.User_Image.length < 2 && data.getUserByID.User_Image.length < 2 ? (
                alt) : ("http://167.99.36.48:3003/" + data.getUserByID.User_Image.split("app/")[1]
              )
            ) :
              alt || alt}
            alt="U"
          />

        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/userprofile">
            {" "}
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("Profile")}{" "}
          </DropdownItem>


          <DropdownItem tag="a" href="auth-lock-screen">
            <i className="bx bx-question-mark font-size-16 align-middle me-1" />
            {props.t("Need Help ?")}
          </DropdownItem>

          <div className="dropdown-divider" />
          <Button style={{ display: "inline", border: "0px", backgroundColor: "transparent", marginLeft: "15px" }} onClick={handleLogOut} >
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span style={{ color: "white" }}> Sign out </span>
          </Button>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
};

const mapStatetoProps = state => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
