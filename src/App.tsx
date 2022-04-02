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
  Routes,
  Route
} from "react-router-dom";
import { AuthProvider }  from "react-oidc-context";
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
import {
    getConfig,
    withAuth
} from './AppAuth'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
      <RecoilRoot>
          <AuthProvider {...getConfig()}>
            <MQTTWrapper>
                <AppRoutes/>
            </MQTTWrapper>
          </AuthProvider>
      </RecoilRoot>
  );
}

function AppRoutes() {

    return (
        <HashRouter>
            <Routes>
                <Route path="/pub" element={ withAuth(<Pub/>) } />
                <Route path="/sub" element={ withAuth(<Sub/>) } />
                <Route path="/" element={ withAuth(<Home/>) } />
            </Routes>
        </HashRouter>
    );
}

export default App;
