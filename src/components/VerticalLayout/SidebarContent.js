import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import { AdminBarData, UserBarData } from "./SideBarData";


const SidebarContent = props => {
  const ref = useRef();
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname]);

  useEffect(() => {
    ref.current.recalculate();
  });

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }

  const getCookies = (cname) => {
    const cArray = document.cookie.split("; ")
    let result = null
    cArray.forEach(element => {
      if (element.indexOf(cname) == 0) {
        result = element.substring(cname.length + 1)
      }
    })
    return result;
  }

  const mvUserType = getCookies("MvUserType");


  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            {
              mvUserType == "user" ? (
                UserBarData.map((value, index) => {
                  return (
                    <li key={index}>
                      <Link to={value.link} >
                        {value.icon}
                        <span>{props.t(value.title)}</span>
                      </Link>
                    </li>
                  )
                })
              ) : (
                AdminBarData.map((value, index) => {
                  return (
                    <li key={index}>
                      <Link to={value.link} >
                        {value.icon}
                        <span>{props.t(value.title)}</span>
                      </Link>
                    </li>
                  )
                })
              )
            }
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment >
  );
};

// SidebarContent.propTypes = {
//   location: PropTypes.object,
//   t: PropTypes.any,
// };

export default withRouter(withTranslation()(SidebarContent));
