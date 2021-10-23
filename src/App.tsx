import React, {useState, useContext, createContext} from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
  HashRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {
    Navbar,
    Container,
    Row,
    Col,
    Nav,
    Card,
    InputGroup,
    Button,
    FormControl,
    Form
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const connectionStatusAtom = atom(
    {
        key: 'connectionStatus',
        default: '',
    });


declare global {
    interface Window {
        Paho:any;
    }
}
let mqttDefault = {
    connect: (arg : string) => {}
};
const MQTTContext = createContext(mqttDefault);
function MQTTWrapper(props: any)
{
    const setConnectionStatus = useSetRecoilState(connectionStatusAtom);

    let onConnect = (context : any) => {
        setConnectionStatus("Connected!");
    }
    let onFailure = (context : any) => {
        setConnectionStatus("Failed");
    }
    let onMessageArrived = (pahoMessage : any) => {
        console.log(pahoMessage.payloadString);
    }

    // TODO: Is there an on disconnect.
    // TODO: Set connection status based on client.

    let client = null;
    let connect = (ipAddress: string) =>
    {
        client = new window.Paho.MQTT.Client(ipAddress, "website");
        client.onMessageArrived = onMessageArrived;
        client.connect({onSuccess:onConnect, onFailure:onFailure});
    };


    let contextData = {
        connect: connect
    };
    return (
        <MQTTContext.Provider value={contextData}>
            {props.children}
        </MQTTContext.Provider>
    );
}

function Home() {
    return (
        <div>
            <AppNavBar/>
            <Container className="py-5">
               <Row>
                  <ConnectButton/>
               </Row>
               <Row className="py-3">
                  <StatusIndicatorCard/>
               </Row>
            </Container>
        </div>
    );
}

function StatusIndicatorCard(props: any) {
    const connectionStatus = useRecoilValue(connectionStatusAtom);

    return (
        <Card>
            <p> Connection Status: {connectionStatus} </p>
        </Card>
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
    const [inputText, setInputText] = useState('ws://localhost:8082/');
    const mqtt = useContext(MQTTContext);

    let onSubmit = (e : any) =>
        {
            e.preventDefault();
            mqtt.connect(inputText);
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
              <Navbar.Brand as={Link} to="/">J7S</Navbar.Brand>
              <Nav className="me-auto">
                 <Link to="/pub" className="nav-link">Publish</Link>
                 <Link to="/sub" className="nav-link">Subscribe</Link>
              </Nav>
            </Container>
        </Navbar>
    );
}

function AppRoutes() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/pub"> <Pub/> </Route>
                <Route path="/sub"> <Sub/> </Route>
                <Route path="/"> <Home/> </Route>
            </Switch>
        </HashRouter>
    );
}

function App() {
  return (
      <RecoilRoot>
          <MQTTWrapper>
            <AppRoutes/>
          </MQTTWrapper>
      </RecoilRoot>
  );
}

export default App;
