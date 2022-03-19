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
import React, {createContext} from 'react';
import {
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
    ConnectionState,
    connectionStatusAtom,
    subscribedColorAtom,
    subscribedBrightnessAtom,
    subscriptionIndexAtom
} from './Atoms'

declare global {
    interface Window {
        Paho:any;
    }
}
let mqttDefault = {
    connect: (url: string, username: string, password: string) => {},
    setLed: (index: number, color: string, brightness: number): boolean => {return true;},
    disconnect: () => {},
};

export const MQTTContext = createContext(mqttDefault);
export function MQTTWrapper(props: any)
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
        setConnectionStatus(ConnectionState.True);
        client.subscribe("led_state")
    }
    let onConnectionLost = (context : any) => {
        setConnectionStatus(ConnectionState.False);
    }
    let onFailure = (context : any) => {
        setConnectionStatus(ConnectionState.Errored);
    }
    let onMessageArrived = (pahoMessage : any) => {
        if(pahoMessage.destinationName === "led_state")
        {
            const payload = JSON.parse(pahoMessage.payloadString);
            if(payload.index === parseInt(subscriptionIndex)) {
                setBrightness(payload.brightness);
                setColor(payload.color);
            }
        }
    }

    let connect = (ipAddress: string, username: string, password: string) =>
    {
        client = new window.Paho.MQTT.Client(ipAddress, "website");
        client.onMessageArrived = onMessageArrived;
        client.onConnectionLost = onConnectionLost;
        client.onConnected = onConnected;
        client.connect({onFailure:onFailure, userName:username, password:password});
    };

    let disconnect = () =>
    {
        if(client) {
            client.disconnect();
            client = null;
        }
    };



    let contextData = {
        connect: connect,
        setLed: setLed,
        disconnect: disconnect
    };
    return (
        <MQTTContext.Provider value={contextData}>
            {props.children}
        </MQTTContext.Provider>
    );
}

