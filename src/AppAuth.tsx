// Copyright 2022 James Pace
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

import React from 'react';
import {
    Container,
    Row,
    Col,
    Card,
} from 'react-bootstrap';
import { useAuth  } from "react-oidc-context";
import {
    AppNavBar
} from './AppNavBar'

export function getConfig() {
    let oidcConfig = {
        authority: "https://auth.jpace121.net/realms/jpace121-main",
        client_id: "jpace-mqtt",
        redirect_uri: "http://localhost:3000/"
    };

    return oidcConfig;
}

export function withAuth(val : any) {
    return ( <WithAuthElement> {val} </WithAuthElement> );
};

function WithAuthElement(props: any) {
    const auth = useAuth();

    if(auth.isAuthenticated) {
        return (<div> {props.children} </div>);
    }
    else {
        return <LoginRequest/>;
    }
}


function LoginRequest() {
    return (
        <div>
            <AppNavBar/>
            <Container className="py-5">
               <LoginCard/>
            </Container>
        </div>
    );
}

function LoginCard() {
    return (
        <div>
            <Container className="py-1">
                <Card className="padded-card">
                    <Row>
                        <Col>
                            <h1>Welcome!</h1>
                        </Col>
                    </Row>
                </Card>
            </Container>
            <Container className="py-1">
                <Card className="padded-card">
                    <Row>
                        <Col>
                            <p>Please login to access this page.</p>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </div>
    );
}
