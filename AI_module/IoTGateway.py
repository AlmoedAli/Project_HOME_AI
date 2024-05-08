import paho.mqtt.client as mqtt
import paho.mqtt.publish as publish
import time
import sys
import requests
import joblib
import speech_recognition as sr
import pyaudio

typeOfCommand= {0: "LED_OFF", 1: "LED_ON", 2: "DOOR_OPEN", 3: "DOOR_CLOSE", 4: "FAN_OFF", 
                5: "FAN_20", 6: "FAN_40", 7: "FAN_60", 8: "FAN_80", 9: "FAN_100"}

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
        
        self.recognize= sr.Recognizer()
        
        # Label for AI Speech
        self.Label= {0: self.AIO_LED_BUTTON_FEED_ID, 1: self.AIO_LED_BUTTON_FEED_ID}
        self.is_AI_On= False


        
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
                                    self.jsonSpeech= {"SPEECH": {"State": "ON"}} if response['value']== '1' else {"SPEECH": {"State": "OFF"}}
    
    # Responsible for yoloBit updating several FEEDS, such as led, door, fan
    def publishFirstTime(self, string):
        
        if string == self.AIO_LED_BUTTON_FEED_ID:
            data=  1 if self.jsonLED["LED"]["State"]== "ON" else 0
            publish.single(string, data, hostname= "io.adafruit.com", auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
        elif string == self.AIO_DOOR_BUTTON_FEED_ID:
            data = 1 if self.jsonDOOR["DOOR"]["State"]== "ON" else 0
            publish.single(string, data, hostname= "io.adafruit.com", auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
        elif string == self.AIO_CONTROL_SPEED_FAN_FEED_ID:
            data= self.jsonFAN["FAN"]["Speed"]
            publish.single(string, data, hostname= "io.adafruit.com", auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
        
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
        
        client.subscribe(self.AIO_SPEECH_FEED_ID)
        publish.single(self.AIO_SPEECH_FEED_ID, 0, hostname= "io.adafruit.com", auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
        self.getStateFromDashboard(self.AIO_SPEECH_FEED_ID)
        
        # Several feeds send data to dashboard
        client.subscribe(self.AIO_HUMIDITY_FEED_ID)
        # self.getStateFromDashboard(self.AIO_HUMIDITY_FEED_ID)
        
        client.subscribe(self.AIO_LIGHT_FEED_ID)
        # self.getStateFromDashboard((self.AIO_LIGHT_FEED_ID))
        
        client.subscribe(self.AIO_TEMPERATURE_FEED_ID)
        # self.getStateFromDashboard(self.AIO_TEMPERATURE_FEED_ID)
        
        
    def subscribe(self, client, userData, mid, granted_qos): 
        print("Subscribe feed has order " + str(mid)+  " is completely!")
        
    def disconnected(self, client, userData, rc):
        print("Interrupt connection")
        sys.exit(1)
            
    def AIPart(self):
        # audioData= None
        print ("Listening...")
        try:
            with sr.Microphone() as source:
                audioData= self.recognize.listen(source, timeout= 5, phrase_time_limit= 5)
        except sr.WaitTimeoutError:
            print("Time out")
            return
        
        try:
            text= self.recognize.recognize_google(audioData)
        except sr.UnknownValueError:
            print("Could not understand the audio")
            return
        except sr.RequestError as e:
            print("Could not request results; {0}".format(e))
            return
        
        

        print("You said: " + text)
        commandText= [text]
        # data= [commandText]
        vector= self.cv.transform(commandText)
        probClass= self.model.predict_proba(vector)[0]
        typeOfClass= self.model.predict(vector)
        index= None
        for iterator in probClass:
            if iterator > 0.5:
                index= iterator
                break
        if index== None:
            return
        else:
            if typeOfCommand[typeOfClass[0]]== "LED_ON":
                publish.single(self.AIO_LED_BUTTON_FEED_ID, 1, hostname= "io.adafruit.com", 
                                auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
            else:
                if typeOfCommand[typeOfClass[0]]== "LED_OFF":
                    publish.single(self.AIO_LED_BUTTON_FEED_ID, 0, hostname= "io.adafruit.com", 
                                    auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
                else:
                    if typeOfCommand[typeOfClass[0]]== "DOOR_OPEN":
                        publish.single(self.AIO_DOOR_BUTTON_FEED_ID, 1, hostname= "io.adafruit.com", 
                                    auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
                    else:
                        if typeOfCommand[typeOfClass[0]]== "DOOR_CLOSE":
                            publish.single(self.AIO_DOOR_BUTTON_FEED_ID, 0, hostname= "io.adafruit.com", 
                                    auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
                        else:
                            if typeOfCommand[typeOfClass[0]]== "FAN_OFF":
                                publish.single(self.AIO_CONTROL_SPEED_FAN_FEED_ID, 0, hostname= "io.adafruit.com", 
                                    auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
                            else:
                                if typeOfCommand[typeOfClass[0]]== "FAN_20":
                                    publish.single(self.AIO_CONTROL_SPEED_FAN_FEED_ID, 20, hostname= "io.adafruit.com", 
                                                    auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
                                else:
                                    if typeOfCommand[typeOfClass[0]]== "FAN_40":
                                        publish.single(self.AIO_CONTROL_SPEED_FAN_FEED_ID, 40, hostname= "io.adafruit.com", 
                                                    auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
                                    else:
                                        if typeOfCommand[typeOfClass[0]]== "FAN_60":
                                            publish.single(self.AIO_CONTROL_SPEED_FAN_FEED_ID, 60, hostname= "io.adafruit.com", 
                                                        auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
                                        else:
                                            if typeOfCommand[typeOfClass[0]]== "FAN_80":
                                                    publish.single(self.AIO_CONTROL_SPEED_FAN_FEED_ID, 80, hostname= "io.adafruit.com", 
                                                                    auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
                                            else:
                                                if typeOfCommand[typeOfClass[0]]== "FAN_100":
                                                    publish.single(self.AIO_CONTROL_SPEED_FAN_FEED_ID, 100, hostname= "io.adafruit.com", 
                                                                    auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
        # publish.single(self.AIO_SPEECH_FEED_ID, 0, hostname= "io.adafruit.com", auth= {'username': self.AIO_USERNAME, 'password': self.AIO_KEY})
        
    def on_message(self, client, userData, msg):
        if str(msg.topic)== self.AIO_LED_BUTTON_FEED_ID:
            self.getStateFromDashboard(self.AIO_LED_BUTTON_FEED_ID)
            if self.jsonLED["LED"]["State"]== "ON":
                print("LED is ON")
            else:
                print("LED is OFF")
        elif str(msg.topic)== self.AIO_DOOR_BUTTON_FEED_ID:
            self.getStateFromDashboard(self.AIO_DOOR_BUTTON_FEED_ID)
            if self.jsonDOOR["DOOR"]["State"]== "ON":
                print("DOOR is OPENED")
            else:
                print("DOOR is CLOSED")
        elif str(msg.topic)== self.AIO_CONTROL_SPEED_FAN_FEED_ID:
            self.getStateFromDashboard(self.AIO_CONTROL_SPEED_FAN_FEED_ID)
            if self.jsonFAN["FAN"]["Speed"]== "0":
                print("FAN is CLOSED")
            else:
                print("FAN is OPEN with " + str(self.jsonFAN["FAN"]["Speed"]))
        elif str(msg.topic)== self.AIO_TEMPERATURE_FEED_ID:
            self.getStateFromDashboard(self.AIO_TEMPERATURE_FEED_ID)
        elif str(msg.topic)== self.AIO_HUMIDITY_FEED_ID:
            self.getStateFromDashboard(self.AIO_HUMIDITY_FEED_ID)
        elif str(msg.topic)== self.AIO_LIGHT_FEED_ID:
            self.getStateFromDashboard(self.AIO_LIGHT_FEED_ID)
        elif str(msg.topic)== self.AIO_SPEECH_FEED_ID:
            self.getStateFromDashboard(self.AIO_SPEECH_FEED_ID)
            if self.jsonSpeech["SPEECH"]["State"]== "ON":
                print("VOICE is OPENED")  
                self.is_AI_On= True
            else:
                print("VOICE is CLOSED")
                self.is_AI_On= False
                                
        

    def InteractionServerGateway(self):
        self.client= mqtt.Client()
        self.client.username_pw_set(self.AIO_USERNAME, self.AIO_KEY)
        self.client.connect("io.adafruit.com", 1883, 60)
        self.client.on_connect= self.connected
        self.client.on_disconnect= self.disconnected
        self.client.on_message= self.on_message
        self.client.on_subscribe= self.subscribe
        self.client.loop_start()
        time.sleep(15)
        while True:
            # time.sleep(1)
            # temperature= random.randint(0, 40)
            # self.client.publish(self.AIO_TEMPERATURE_FEED_ID, temperature)
            # humidity= random.randint(0, 100)
            # self.client.publish(self.AIO_HUMIDITY_FEED_ID, humidity)
            # light= random.randint(0, 600)
            # self.client.publish(self.AIO_LIGHT_FEED_ID, light)


            # AI Speech
            if self.is_AI_On:
                self.AIPart()
            time.sleep(1)
                       
            
if __name__== "__main__":
    IoTGatewayObject= IoTGateway()
    IoTGatewayObject.InteractionServerGateway()
