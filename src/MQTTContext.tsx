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
  useSetRecoilState
} from 'recoil';
import {
    ConnectionState,
    connectionStatusAtom,
    subscribedColorAtomFamily,
    subscribedBrightnessAtomFamily
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
    // Having to build these arrays here is suboptimal.
    const setBrightness = [
        useSetRecoilState(subscribedBrightnessAtomFamily(0)),
        useSetRecoilState(subscribedBrightnessAtomFamily(1)),
        useSetRecoilState(subscribedBrightnessAtomFamily(2)),
        useSetRecoilState(subscribedBrightnessAtomFamily(3)),
        useSetRecoilState(subscribedBrightnessAtomFamily(4)),
        useSetRecoilState(subscribedBrightnessAtomFamily(5)),
        useSetRecoilState(subscribedBrightnessAtomFamily(6)),
        useSetRecoilState(subscribedBrightnessAtomFamily(7))
    ];
    const setColor = [
        useSetRecoilState(subscribedColorAtomFamily(0)),
        useSetRecoilState(subscribedColorAtomFamily(1)),
        useSetRecoilState(subscribedColorAtomFamily(2)),
        useSetRecoilState(subscribedColorAtomFamily(3)),
        useSetRecoilState(subscribedColorAtomFamily(4)),
        useSetRecoilState(subscribedColorAtomFamily(5)),
        useSetRecoilState(subscribedColorAtomFamily(6)),
        useSetRecoilState(subscribedColorAtomFamily(7))
    ];

    let client: any = null; // eeww

    let setLed = (index: number, color: string, brightness: number) => {
        if(!client) {
            return false;
        }

        const topic_name = `/led_state/${index}`;
        let payload = {
            color: color,
            brightness: brightness
        };
        client.publish(topic_name, JSON.stringify(payload), 1, true);
        return true;
    }

    let onConnected = (context : any) => {
        setConnectionStatus(ConnectionState.True);
        client.subscribe("/led_state/+")
    }
    let onConnectionLost = (context : any) => {
        setConnectionStatus(ConnectionState.False);
    }
    let onFailure = (context : any) => {
        setConnectionStatus(ConnectionState.Errored);
    }
    let onMessageArrived = (pahoMessage : any) => {
        const topic = pahoMessage.destinationName;
        const topicLevels = topic.split('/').filter( (element : any) => element);

        if(topicLevels.length !== 2)
        {
            // This is not in the format I was expecting.
            console.log(`Not enough elements in topic name. ${topicLevels}`);
            return;
        }
        if(topicLevels[0] !== "led_state")
        {
            // Not the right topic.
            console.log("Not the right highest topic level.");
            return;
        }

        const payload = JSON.parse(pahoMessage.payloadString);

        const index = parseInt(topicLevels[1]);
        console.log(`Index: ${index}`);

        setBrightness[index](payload.brightness);
        setColor[index](payload.color);
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
        if(client && client.isConnected()) {
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
