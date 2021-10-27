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
    Container,
    Row,
    Col,
    Card,
    Form,
    FloatingLabel
} from 'react-bootstrap';
import {
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import {
    subscribedBrightnessAtom,
    subscribedColorAtom,
    subscriptionIndexAtom
} from './Atoms'
import {
    AppNavBar
} from './AppNavBar'

export function Sub() {
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

