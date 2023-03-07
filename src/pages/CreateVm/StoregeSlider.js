import React, { useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Container } from "reactstrap"

import Slider from "react-rangeslider"
import "react-rangeslider/lib/index.css"

const StoregeSlider = (props) => {

  const formatkg = value => " " + value;
  const [prefix, setprefix] = useState(0);
  const [con, setCon] = useState("MB")
  const [valueToShow, setValueToShow] = useState(0)
  const [sliderVal, setSliderVal] = useState(0)


  const ManageValue = (value) => {
    let currantValue = value;
    if (currantValue >= 1000) {
      currantValue /= 1000;
      let ToFix = currantValue.toFixed(2);
      let Float = parseFloat(ToFix);
      // console.log(Float)
      setSliderVal(Float)
      setCon("GB")
      props.sValue(Float)
    }
    else {
      setSliderVal(currantValue)
      setCon("MB")
      props.sValue(currantValue)
    }
    return currantValue
  }



  return (
    <>
      <div className="mb-3">
        <h5 className="font-size-14 mb-3 mt-0">Storage :</h5>
        <Slider
          min={0}
          max={100000}
          value={prefix}
          onChange={value => {
            setprefix(value);
            ManageValue(value);
          }}
        />
        <span className="float-right mt-4">{sliderVal} {con}</span>
      </div>
    </>
  )
}

export default StoregeSlider

