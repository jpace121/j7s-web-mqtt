import React, {useState} from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {LinkContainer} from 'react-router-bootstrap';
import {
    Navbar,
    Container,
    Nav,
    Card,
    InputGroup,
    Button,
    FormControl,
    Form
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function Home() {
    return (
        <div>
            <AppNavBar/>
            <Container className="py-5">
               <ConnectButton/>
            </Container>
        </div>
    );
}


function Pub() {
    return (
        <AppNavBar/>
    );
}

function Sub() {
    return (
        <AppNavBar/>
    );
}

function ConnectButton() {
    const [inputText, setInputText] = useState('websocket ip');

    let onSubmit = (e : any) =>
        {
            e.preventDefault();
            console.log(inputText);
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

function AppNavBar() {
    return (
        <Navbar bg="primary" variant="dark" expand="sm" className="py-0">
            <Container>
                <Navbar.Brand href="/">J7S</Navbar.Brand>
                <Nav className="me-auto">
                   <LinkContainer to="/pub"><Nav.Link>Publish</Nav.Link></LinkContainer>
                   <LinkContainer to="/sub"><Nav.Link>Subscribe</Nav.Link></LinkContainer>
                </Nav>
            </Container>
        </Navbar>
    );
}

function AppRoutes() {
    return (
        <Router>
            <Switch>
                <Route path="/pub"> <Pub/> </Route>
                <Route path="/sub"> <Sub/> </Route>
                <Route path="/"> <Home/> </Route>
            </Switch>
        </Router>
    );
}

function App() {
  return (
      <RecoilRoot>
          <AppRoutes/>
      </RecoilRoot>
  );
}

export default App;
