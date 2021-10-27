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
  RecoilRoot
} from 'recoil';
import {
  HashRouter,
  Switch,
  Route
} from "react-router-dom";
import {
    MQTTWrapper
} from './MQTTContext';
import {
    Home
} from './Home'
import {
    Pub
} from './Pub'
import {
    Sub
} from './Sub'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
      <RecoilRoot>
          <MQTTWrapper>
            <AppRoutes/>
          </MQTTWrapper>
      </RecoilRoot>
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

export default App;
