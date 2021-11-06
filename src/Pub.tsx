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

    const [indexState, changeIndexState] = useState<{[key: string]: boolean}>(
        {
            "index-0": false,
            "index-1": false,
            "index-2": false,
            "index-3": false,
            "index-4": false,
            "index-5": false,
            "index-6": false,
            "index-7": false
        }
    );
    const [colorState, changeColorState] = useState("off");
    const [brightnessState, changeBrightnessState] = useState("1.0");

    let onColorChange = (e: any) => { changeColorState(e.target.value) };
    let onBrightnessChange = (e: any) => { changeBrightnessState(e.target.value) };
    let onIndexChange = (e: any) =>
        {
            changeIndexState( prevState => ({
                ...prevState,
                [e.target.id]: !prevState[e.target.id]
            }) );
        };

    let onSubmit = (e : any) =>
        {
            e.preventDefault();

            let nameToNumber = new Map([
                ["index-0", 0],
                ["index-1", 1],
                ["index-2", 2],
                ["index-3", 3],
                ["index-4", 4],
                ["index-5", 5],
                ["index-6", 6],
                ["index-7", 7]
            ]);

            for(const [indexName, shouldSet] of Object.entries(indexState))
            {
                if(shouldSet) {
                    let indexVal = nameToNumber.get(indexName);
                    let error = mqtt.setLed(Number(indexVal), colorState, Number(brightnessState));
                    if(!error) {
                        // TODO: Handle better.
                        console.log("Failed to publish!");
                    }
                }
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
        <Card className="padded-card">
            <p className="text-secondary">Index</p>
            <Form.Check label={"0"} onChange={props.onChange} checked={props.value["index-0"]} id="index-0"/>
            <Form.Check label={"1"} onChange={props.onChange} checked={props.value["index-1"]} id="index-1"/>
            <Form.Check label={"2"} onChange={props.onChange} checked={props.value["index-2"]} id="index-2"/>
            <Form.Check label={"3"} onChange={props.onChange} checked={props.value["index-3"]} id="index-3"/>
            <Form.Check label={"4"} onChange={props.onChange} checked={props.value["index-4"]} id="index-4"/>
            <Form.Check label={"5"} onChange={props.onChange} checked={props.value["index-5"]} id="index-5"/>
            <Form.Check label={"6"} onChange={props.onChange} checked={props.value["index-6"]} id="index-6"/>
            <Form.Check label={"7"} onChange={props.onChange} checked={props.value["index-7"]} id="index-7"/>
        </Card>
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

