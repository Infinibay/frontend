import React, { useState } from 'react'
// import "./Stbtn.css"
import { Card, CardBody, Col, Button, Container, CardImg, CardText, Form, FormGroup, Input, Label, NavItem, NavLink, Row, TabContent, TabPane, CardTitle, Table } from "reactstrap"


const StBtn = () => {

    const [state, setState] = useState(false);
    const toggle = () => {
        setState(!state);
        console.log(state)
    }

    return (
        <>
            <div className="d-grid gap-2">
                <Button onClick={toggle} color={state ? 'danger' : 'success'} type="button" className="btn btn-label" >
                <i className={state ? 'bx bx-pause label-icon':'bx bx-play label-icon'}></i> 
                {state ? 'STOP': 'START'}
                </Button>
            </div>
        </>
    )
}

export default StBtn