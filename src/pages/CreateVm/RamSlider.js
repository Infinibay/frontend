import React, { useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Container } from "reactstrap"

import Slider from "react-rangeslider"
import "react-rangeslider/lib/index.css"

const RamSlider = () => {

  const formatkg = value => value;
  const [prefix, setprefix] = useState(50)


  return (
    <>
      <div className="mb-3">
        <h5 className="font-size-14 mb-3 mt-0">Ram:</h5>
        <Slider
          min={0}
          max={8192}
          format={formatkg}
          value={prefix}
          onChange={value => {
            setprefix(value)
          }}
        />
        <span className="float-right  mt-4">{prefix} MB</span>
        <br></br>
        <br></br>
        <div style={{ height: '7px', opacity: 0.3, borderRadius: '4px', backgroundImage: 'linear-gradient(to right, #00FF00, yellow 70%, red)' }} />
      </div>
    </>
  )
}

export default RamSlider

