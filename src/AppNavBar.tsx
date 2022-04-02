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
import {
  useRecoilValue,
} from 'recoil';
import {
    useContext,
} from 'react';
import {
    useAuth,
} from "react-oidc-context";
import {
    Link,
    useNavigate
} from "react-router-dom";
import {
    Navbar,
    NavDropdown,
    Container,
    Nav,
} from 'react-bootstrap';
import {
    ConnectionState,
    connectionStatusAtom,
} from './Atoms'
import {
    MQTTContext
} from './MQTTContext';

export function AppNavBar() {
    return (
        <Navbar bg="light" variant="light" expand="sm" className="py-0">
            <Container>
              <Navbar.Brand as={Link} to="/">j7s</Navbar.Brand>
              <Navbar.Toggle aria-controls="collapse-navbar-nav"/>
              <Navbar.Collapse id="collapse-navbar-nav">
              <Nav>
                <Link to="/pub" className="nav-link">Publish</Link>
                <Link to="/sub" className="nav-link">Subscribe</Link>
              </Nav>
              </Navbar.Collapse>
              <Navbar.Collapse className="justify-content-end">
                <Nav>
                    <Connected/>
                    <Login/>
                </Nav>
              </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

function Connected(props: any) {
    const connectedState = useRecoilValue(connectionStatusAtom);

    if(connectedState === ConnectionState.True)
    {
        return (
            <Nav.Item className="nav-link">Connected</Nav.Item>
        );
    }
    return (
        <Nav.Item className="nav-link" style={{ color: "red" }}>Disconnected</Nav.Item>
    );

}

function Login(props: any) {
    const auth = useAuth();
    const mqtt = useContext(MQTTContext);
    const navigate = useNavigate();

    let onLogout = () => {
        mqtt.disconnect();
        auth.removeUser();
        navigate("/");
    };


    if(auth.isAuthenticated) {
        return (
            <NavDropdown title={ (auth.user?.profile.upn as string) }>
                <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
        );
    }

    return (
        <Nav.Item className="nav-link" onClick={() => void auth.signinPopup()}>Login</Nav.Item>
    );
}
