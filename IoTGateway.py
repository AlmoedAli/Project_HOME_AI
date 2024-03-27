import paho.mqtt.client as mqtt
import time
import sys
import random
import json
import requests
import joblib
class IoTGateway:
    def __init__(self):
        
        # Load model
        self.model= joblib.load("modelSpeech.joblib")
        self.cv= joblib.load("CountVectorizer.joblib")
        
        #Account
        self.AIO_USERNAME= "AI_PROJECT_2"
        self.AIO_KEY= "aio_PhcJ78rOlrElEeIZWdmoNsX3OHEY"
        
        #Feed_ID
        self.AIO_LED_BUTTON_FEED_ID= "AI_PROJECT_2/feeds/led-button-feed"
        self.AIO_DOOR_BUTTON_FEED_ID= "AI_PROJECT_2/feeds/pump-button-feed"
        self.AIO_CONTROL_SPEED_FAN_FEED_ID= "AI_PROJECT_2/feeds/control-speed-fan-feed"
        self.AIO_TEMPERATURE_FEED_ID= "AI_PROJECT_2/feeds/temperature-feed"
        self.AIO_HUMIDITY_FEED_ID= "AI_PROJECT_2/feeds/humidity-feed"
        self.AIO_LIGHT_FEED_ID= "AI_PROJECT_2/feeds/light-feed"
        self.AIO_SPEECH_FEED_ID= "AI_PROJECT_2/feeds/annoucement"
        
        # header
        self.headers = { 'X-AIO-Key': self.AIO_KEY}
        
        # Declare json variable
        self.jsonFAN= None
        self.jsonLED= None
        self.jsonDOOR= None
        self.jsonTEMPERATURE= None
        self.jsonHUMIDITY= None
        self.jsonLIGHT= None
        self.jsonSpeech= None
        
        # Label for AI Speech
        self.Label= {0: self.AIO_LED_BUTTON_FEED_ID, 1: self.AIO_LED_BUTTON_FEED_ID}
        
    def getStateFromDashboard(self, string):
        url= "https://io.adafruit.com/api/v2/" + string + "/data/last"
        response= requests.get(url= url, headers= self.headers).json()
        if string== self.AIO_LED_BUTTON_FEED_ID:
            self.jsonLED= {"LED": {"State": "ON"}} if response['value']== '1' else {"LED": {"State": "OFF"}}
        else:
            if string== self.AIO_DOOR_BUTTON_FEED_ID:
                self.jsonDOOR= {"DOOR": {"State": "ON"}} if response['value']== '1' else {"DOOR": {"State": "OFF"}}
            else:
                if string== self.AIO_CONTROL_SPEED_FAN_FEED_ID:
                    self.jsonFAN= {"FAN": {"State": "ON", "Speed": int(response['value'])}} if response['value'] != '0' else {"FAN": {"State": "OFF", "Speed": 0}}
                else:
                    if string== self.AIO_TEMPERATURE_FEED_ID:
                        self.jsonTEMPERATURE= {"TEMPERATURE": float(response['value'])}
                    else:   
                        if string== self.AIO_HUMIDITY_FEED_ID:
                            self.jsonHUMIDITY= {"HUMIDITY": float(response['value'])}
                        else:
                            if string== self.AIO_LIGHT_FEED_ID:
                                self.jsonLIGHT= {"LIGHT": float(response['value'])}
                            else:
                                if string== self.AIO_SPEECH_FEED_ID:
                                    self.jsonSpeech= {"SPEECH": "ON"} if response['value']== '1' else {"SPEECH": 'OFF'}
            
    def publishFirstTime(self, string):
        url= "https://io.adafruit.com/api/v2/" + string + "/data/last"
        response= requests.get(url= url, headers= self.headers).json()
        self.client.publish(string, int(response['value']))
        
        
    def connected(self, client, userData, flags, rc):
        print("Connected to server!")
        
        # Several feeds receive data from dashboard
        client.subscribe(self.AIO_LED_BUTTON_FEED_ID)
        self.getStateFromDashboard(self.AIO_LED_BUTTON_FEED_ID)
        self.publishFirstTime(self.AIO_LED_BUTTON_FEED_ID)
        
        client.subscribe(self.AIO_DOOR_BUTTON_FEED_ID)
        self.getStateFromDashboard(self.AIO_DOOR_BUTTON_FEED_ID)
        self.publishFirstTime(self.AIO_DOOR_BUTTON_FEED_ID)
        
        client.subscribe(self.AIO_CONTROL_SPEED_FAN_FEED_ID)
        self.getStateFromDashboard(self.AIO_CONTROL_SPEED_FAN_FEED_ID)
        self.publishFirstTime(self.AIO_CONTROL_SPEED_FAN_FEED_ID)

        # Several feeds send data to dashboard
        client.subscribe(self.AIO_HUMIDITY_FEED_ID)
        self.getStateFromDashboard(self.AIO_HUMIDITY_FEED_ID)
        
        client.subscribe(self.AIO_LIGHT_FEED_ID)
        self.getStateFromDashboard((self.AIO_LIGHT_FEED_ID))
        
        client.subscribe(self.AIO_TEMPERATURE_FEED_ID)
        self.getStateFromDashboard(self.AIO_TEMPERATURE_FEED_ID)
        
        client.subscribe(self.AIO_SPEECH_FEED_ID)
        self.getStateFromDashboard(self.AIO_SPEECH_FEED_ID)
        self.publishFirstTime(self.AIO_SPEECH_FEED_ID)
        
        with open('data.json', 'w') as file:
            data= {**self.jsonLED, **self.jsonDOOR, **self.jsonFAN, **self.jsonSpeech, **self.jsonTEMPERATURE, **self.jsonHUMIDITY, **self.jsonLIGHT}
            json.dump(data, file)
        
    def subscribe(self, client, userData, mid, granted_qos): 
        print("Subscribe feed has order " + str(mid)+  " is completely!")
        
    def disconnected(self, client, userData, rc):
        print("Interrupt connection")
        sys.exit(1)
        
    def message(self, client, userData, msg):
        if str(msg.topic)== self.AIO_LED_BUTTON_FEED_ID:
            self.getStateFromDashboard(self.AIO_LED_BUTTON_FEED_ID)
            if str(msg.payload)== "b'1'":
                print("LED was turned ON.")
            else:
                print("LED was turned OFF.")
        else:
            if str(msg.topic)== self.AIO_DOOR_BUTTON_FEED_ID:
                self.getStateFromDashboard(self.AIO_DOOR_BUTTON_FEED_ID)
                if str(msg.payload) == "b'1'":
                    print("PUMP was turned ON.")
                else:
                    print("PUMP was turned OFF.")
            else:
                if str(msg.topic)== self.AIO_CONTROL_SPEED_FAN_FEED_ID:
                    self.getStateFromDashboard(self.AIO_CONTROL_SPEED_FAN_FEED_ID)
                    if str(msg.payload) == "b'0'":
                        print("FAN was turned OFF.")
                    else:
                        if str(msg.payload) != "b'100'":
                            print("FAN was turned ON with speed: "+ str(msg.payload)[2: 4]+ ".")
                        else:
                            print("FAN was turned on with speed: "+ str(msg.payload)[2: 5]+ ".")
                else:
                    if str(msg.topic)== self.AIO_TEMPERATURE_FEED_ID:
                        self.getStateFromDashboard(self.AIO_TEMPERATURE_FEED_ID)
                    else:
                        if str(msg.topic)== self.AIO_HUMIDITY_FEED_ID:
                            self.getStateFromDashboard(self.AIO_HUMIDITY_FEED_ID)
                        else:
                            if str(msg.topic)== self.AIO_LIGHT_FEED_ID:
                                self.getStateFromDashboard(self.AIO_LIGHT_FEED_ID)
                            else:
                                self.getStateFromDashboard(self.AIO_SPEECH_FEED_ID)
                                url= "https://io.adafruit.com/api/v2/" + self.AIO_SPEECH_FEED_ID + "/data/last"
                                response= requests.get(url= url, headers= self.headers).json()
                                if int(response['value']) == 1:
                                    statement= "hello you, help me to turn on the led"
                                    data= [statement]
                                    vector= self.cv.transform(data)
                                    result= self.model.predict(vector)
                                    self.client.publish(str(self.AIO_LED_BUTTON_FEED_ID), int(result[0]))
                                
        with open('data.json', 'w') as file:
            data= {**self.jsonLED, **self.jsonDOOR, **self.jsonFAN, **self.jsonSpeech, **self.jsonTEMPERATURE, **self.jsonHUMIDITY, **self.jsonLIGHT}
            json.dump(data, file)
    
    def InteractionServerGateway(self):
        self.client= mqtt.Client()
        self.client.username_pw_set(self.AIO_USERNAME, self.AIO_KEY)
        self.client.connect("io.adafruit.com", 1883, 60)
        self.client.on_connect= self.connected
        self.client.on_disconnect= self.disconnected
        self.client.on_message= self.message
        self.client.on_subscribe= self.subscribe
        self.client.loop_start()
        while True:
            # time.sleep(1)
            # temperature= random.randint(0, 40)
            # self.client.publish(self.AIO_TEMPERATURE_FEED_ID, temperature)
            # humidity= random.randint(0, 100)
            # self.client.publish(self.AIO_HUMIDITY_FEED_ID, humidity)
            # light= random.randint(0, 600)
            # self.client.publish(self.AIO_LIGHT_FEED_ID, light)
            time.sleep(10)
                       
            
if __name__== "__main__":
    IoTGatewayObject= IoTGateway()
    IoTGatewayObject.InteractionServerGateway()
