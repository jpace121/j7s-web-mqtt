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
  Link
} from "react-router-dom";
import {
    Navbar,
    Container,
    Nav,
} from 'react-bootstrap';
import {
    ConnectionState,
    connectionStatusAtom,
} from './Atoms'

export function AppNavBar() {
    return (
        <Navbar bg="primary" variant="dark" expand="sm" className="py-0">
            <Container>
              <Navbar.Brand as={Link} to="/">J7S</Navbar.Brand>
              <Navbar.Toggle aria-controls="collapse-navbar-nav"/>
              <Navbar.Collapse id="collapse-navbar-nav">
              <Nav>
                <Link to="/pub" className="nav-link">Publish</Link>
                <Link to="/sub" className="nav-link">Subscribe</Link>
              </Nav>
              </Navbar.Collapse>
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text> Connection Status: </Navbar.Text>
                <ConnectedLight/>
              </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

function ConnectedLight(props: any) {
    const connectedState = useRecoilValue(connectionStatusAtom);

    var connectColor = 'red';
    if(connectedState === ConnectionState.True)
    {
        connectColor = 'green';
    }

    return (
        <svg width="20" height="20" className={props.className}>
            <circle cx="10" cy="10" r="10" stroke="black" strokeWidth="0" fill={connectColor} />
        </svg>
    );
}
