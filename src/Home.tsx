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
  useRecoilValue,
} from 'recoil';
import { useAuth  } from "react-oidc-context";
import {
    Container,
    Row,
    Col,
    Card,
    InputGroup,
    Button,
    FormControl,
    Form,
} from 'react-bootstrap';
import {
    MQTTContext
} from './MQTTContext';
import {
    connectionStatusAtom
} from './Atoms'
import {
    AppNavBar
} from './AppNavBar'

export function Home() {
    return (
        <div>
            <AppNavBar/>
            <Container className="py-5">
               <Row>
                 <Col>
                    <ConnectButton/>
                 </Col>
               </Row>
               <Row className="py-3">
                 <Col>
                  <StatusIndicatorCard/>
                 </Col>
               </Row>
            </Container>
        </div>
    );
}

function StatusIndicatorCard() {
    const connectionStatus = useRecoilValue(connectionStatusAtom);

    return (
        <Card className="padded-card">
            <p> Connection Status: {connectionStatus.toString()} </p>
        </Card>
    );
}

function ConnectButton() {
    const [inputText, setInputText] = useState('ws://localhost:8082/');
    const mqtt = useContext(MQTTContext);
    const auth = useAuth();

    let onSubmit = (e : any) =>
        {
            e.preventDefault();

            if(auth.isAuthenticated) {
                // The as thing is disgusting hack. Worse than using any.
                mqtt.connect(inputText, auth.user?.profile.upn as string, auth.user?.access_token as string);
            }

        };
    let onChange = (e: any) =>
        {
            setInputText(e.target.value);
        };
    return(
    <Form onSubmit={onSubmit}>
        <InputGroup>
            <FormControl placeholder={inputText} onChange={onChange}/>
            <Button type="submit" variant="outline-secondary">Connect</Button>
        </InputGroup>
    </Form>
    );
}
