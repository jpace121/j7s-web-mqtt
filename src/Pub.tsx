// Copyright 2021 James Pace
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

import React, {useState, useContext} from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    FloatingLabel
} from 'react-bootstrap';
import {
    MQTTContext
} from './MQTTContext';
import {
    AppNavBar
} from './AppNavBar'

export function Pub() {
    return (
        <div>
            <AppNavBar/>
            <Container className="py-5">
               <PublishCard/>
            </Container>
        </div>
    );
}

function PublishCard() {
    const mqtt = useContext(MQTTContext);

    const [brightnessState, changeBrightnessState] = useState("1.0");
    const [indexState, changeIndexState] = useState("0");
    const [colorState, changeColorState] = useState("off");

    let onIndexChange = (e: any) => { changeIndexState(e.target.value) };
    let onColorChange = (e: any) => { changeColorState(e.target.value) };
    let onBrightnessChange = (e: any) => { changeBrightnessState(e.target.value) };

    let onSubmit = (e : any) =>
        {
            e.preventDefault();
            let error = mqtt.setLed(Number(indexState), colorState, Number(brightnessState));
            if(!error) {
                // TODO: Handle better.
                console.log("Failed to publish!");
            }
        };

    return (
        <Card className="padded-card">
            <Form onSubmit={onSubmit}>
                <Row>
                    <Col>
                        <IndexList value={indexState} onChange={onIndexChange}/>
                    </Col>
                    <Col>
                       <ColorList value={colorState} onChange={onColorChange}/>
                    </Col>
                    <Col>
                        <BrightnessSelect value={brightnessState} onChange={onBrightnessChange}/>
                    </Col>
                </Row>
                <Row className="py-3">
                   <Col className="col-4"/>
                   <Col className="col-4 d-grid">
                      <Button type="submit">Set!</Button>
                   </Col>
                   <Col className="col-4"/>
                </Row>
            </Form>
        </Card>
    );
}

function ColorList(props: any) {
    return (
        <FloatingLabel controlId="floatingSelect" label="Color">
            <Form.Select value={props.value} onChange={props.onChange}>
                <option value="off">off</option>
                <option value="red">red</option>
                <option value="lime">lime</option>
                <option value="green">green</option>
                <option value="blue">blue</option>
                <option value="white">white</option>
                <option value="aqua">aqua</option>
            </Form.Select>
        </FloatingLabel>
    );
}

function IndexList(props: any) {
    return (
        <FloatingLabel controlId="floatingSelect" label="LED Index">
            <Form.Select value={props.value} onChange={props.onChange}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
            </Form.Select>
        </FloatingLabel>
    );
}

function BrightnessSelect(props: any) {
    return (
        <FloatingLabel controlId="floatinglabel" label="Brightness">
            <Form.Control
                type="number"
                max="1.0"
                min="0.0"
                step="0.1"
                value={props.value}
                onChange={props.onChange}
            />
        </FloatingLabel>
    );
}

