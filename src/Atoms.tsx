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
    atom,
    atomFamily
} from 'recoil';

export enum ConnectionState {
    False = 'Not Connected',
    True = 'Connected!',
    Errored = 'Connection Failed'
};

export const connectionStatusAtom = atom(
    {
        key: 'connectionStatus',
        default: ConnectionState.False,
    });

export const subscriptionIndexAtom = atom(
    {
        key: 'subscriptionIndexAtom',
        default: '0'
    });

export const subscribedColorAtomFamily = atomFamily(
    {
        key: 'subscribedColorAtom',
        default: 'None'
    });

export const subscribedBrightnessAtomFamily = atomFamily(
    {
        key: 'subscribedBrightnessAtom',
        default: 'None'
    });


