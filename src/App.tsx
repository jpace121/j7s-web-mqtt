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
    Form,
    FloatingLabel
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
    connect: (arg : string) => {},
    setLed: (index: number, color: string, brightness: number) => {}
};
const MQTTContext = createContext(mqttDefault);
function MQTTWrapper(props: any)
{
    const setConnectionStatus = useSetRecoilState(connectionStatusAtom);
    let client: any = null; // eeww.

    let setLed = (index: number, color: string, brightness: number) => {
        if(!client) {
            // TODO: handle errors.
            console.log("Client not connected.");
            return;
        }

        let payload = {
            index: index,
            color: color,
            brightness: brightness
        };
        console.log("Publishing...");

        client.publish("led_state", JSON.stringify(payload));
    }

    let onConnected = (context : any) => {
        setConnectionStatus("Connected!");
    }
    let onConnectionLost = (context : any) => {
        setConnectionStatus("Disconnected");
    }
    let onFailure = (context : any) => {
        setConnectionStatus("Failed");
    }
    let onMessageArrived = (pahoMessage : any) => {
        console.log(pahoMessage.payloadString);
    }

    let connect = (ipAddress: string) =>
    {
        client = new window.Paho.MQTT.Client(ipAddress, "website");
        client.onMessageArrived = onMessageArrived;
        client.onConnectionLost = onConnectionLost;
        client.onConnected = onConnected;
        client.connect({onFailure:onFailure});
    };


    let contextData = {
        connect: connect,
        setLed: setLed
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

function Pub() {
    return (
        <div>
            <AppNavBar/>
            <Container className="py-5">
               <PublishCard/>
            </Container>
        </div>
    );
}

function Sub() {
    return (
        <AppNavBar/>
    );
}

function StatusIndicatorCard() {
    const connectionStatus = useRecoilValue(connectionStatusAtom);

    return (
        <Card>
            <p> Connection Status: {connectionStatus} </p>
        </Card>
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
            mqtt.setLed(Number(indexState), colorState, Number(brightnessState));
        };

    return (
        <Card className="padded-card">
            <Form onSubmit={onSubmit}>
                <Row>
                    <Col>
                        <FloatingLabel controlId="floatingSelect" label="LED Index">
                            <Form.Select value={indexState} onChange={onIndexChange}>
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
                    </Col>
                    <Col>
                        <FloatingLabel controlId="floatingSelect" label="Color">
                            <Form.Select value={colorState} onChange={onColorChange}>
                               <option value="off">off</option>
                               <option value="red">red</option>
                               <option value="lime">lime</option>
                               <option value="green">green</option>
                               <option value="blue">blue</option>
                               <option value="white">white</option>
                               <option value="aqua">aqua</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col>
                       <FloatingLabel controlId="floatinglabel" label="Brightness">
                           <Form.Control
                                type="number"
                                max="1.0"
                                min="0.0"
                                step="0.1"
                                value={brightnessState}
                                onChange={onBrightnessChange}
                            />
                       </FloatingLabel>
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
