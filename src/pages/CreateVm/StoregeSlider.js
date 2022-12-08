import React, { useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Container } from "reactstrap"

import Slider from "react-rangeslider"
import "react-rangeslider/lib/index.css"

const StoregeSlider = () => {

  const formatkg = value => " " + value;
  const [prefix, setprefix] = useState(50)


  return (
    <>
      <div className="mb-3">
        <h5 className="font-size-14 mb-3 mt-0">Storege:</h5>
        <Slider
          min={0}
          max={16384}
          format={formatkg}
          value={prefix}
          onChange={value => {
            setprefix(value)
          }}
        />
        <span className="float-right  mt-4">{prefix} MB </span>
      </div>
    </>
  )
}

export default StoregeSlider

