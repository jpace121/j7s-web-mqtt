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

const subscribedColorAtom = atom(
    {
        key: 'subscribedColorAtom',
        default: 'None'
    });

const subscribedBrightnessAtom = atom(
    {
        key: 'subscribedBrightnessAtom',
        default: 'None'
    });

const subscriptionIndexAtom = atom(
    {
        key: 'subscriptionIndexAtom',
        default: '0'
    });


declare global {
    interface Window {
        Paho:any;
    }
}
let mqttDefault = {
    connect: (arg : string) => {},
    setLed: (index: number, color: string, brightness: number): boolean => {return true;}
};
const MQTTContext = createContext(mqttDefault);
function MQTTWrapper(props: any)
{
    const setConnectionStatus = useSetRecoilState(connectionStatusAtom);
    const subscriptionIndex = useRecoilValue(subscriptionIndexAtom);
    const setBrightness = useSetRecoilState(subscribedBrightnessAtom);
    const setColor = useSetRecoilState(subscribedColorAtom);

    let client: any = null; // eeww.

    let setLed = (index: number, color: string, brightness: number) => {
        if(!client) {
            return false;
        }

        let payload = {
            index: index,
            color: color,
            brightness: brightness
        };
        client.publish("led_state", JSON.stringify(payload));
        return true;
    }

    let onConnected = (context : any) => {
        setConnectionStatus("Connected!");
        client.subscribe("led_state")
    }
    let onConnectionLost = (context : any) => {
        setConnectionStatus("Disconnected");
    }
    let onFailure = (context : any) => {
        setConnectionStatus("Failed");
    }
    let onMessageArrived = (pahoMessage : any) => {
        if(pahoMessage.destinationName === "led_state")
        {
            const payload = JSON.parse(pahoMessage.payloadString);
            if(payload.index == subscriptionIndex) {
                setBrightness(payload.brightness);
                setColor(payload.color);
            }
        }
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
        <div>
            <AppNavBar/>
            <Container className="py-5">
               <SubscriptionCard/>
            </Container>
        </div>
    );
}

function SubscriptionCard() {
    const brightnessState = useRecoilValue(subscribedBrightnessAtom);
    const colorState = useRecoilValue(subscribedColorAtom);
    const [subscriptionIndexState, setSubscriptionIndex] = useRecoilState(subscriptionIndexAtom);

    let onIndexChange = (event: any) =>
    {
        setSubscriptionIndex(event.target.value);
    };

    return (
        <Card className="padded-card">
            <Row>
                <Col>
                  <IndexList value={subscriptionIndexState} onChange={onIndexChange}/>
                </Col>
                <Col>
                  <Card>
                   <Container className="card-body">
                        <Row> <Col> <p> Brightness: {brightnessState} </p> </Col> </Row>
                        <Row> <Col> <p> Color: {colorState} </p> </Col>  </Row>
                   </Container>
                  </Card>
                </Col>
            </Row>
        </Card>
    );
}

function StatusIndicatorCard() {
    const connectionStatus = useRecoilValue(connectionStatusAtom);

    return (
        <Card className="padded-card">
            <p> Connection Status: {connectionStatus} </p>
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
