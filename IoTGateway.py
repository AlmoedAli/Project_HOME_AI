import paho.mqtt.client as mqtt
import time
import sys
import random

class IoTGateway:
    def __init__(self):
        #Account
        self.AIO_USERNAME= "AI_PROJECT_2"
        self.AIO_KEY= "aio_PhcJ78rOlrElEeIZWdmoNsX3OHEY"
        
        #Feed_ID
        self.AIO_LED_BUTTON_FEED_ID= "AI_PROJECT_2/feeds/led-button-feed"
        self.AIO_PUMP_BUTTON_FEED_ID= "AI_PROJECT_2/feeds/pump-button-feed"
        self.AIO_CONTROL_SPEED_FAN_FEED_ID= "AI_PROJECT_2/feeds/control-speed-fan-feed"
        self.AIO_TEMPERATURE_FEED_ID= "AI_PROJECT_2/feeds/temperature-feed"
        self.AIO_HUMIDITY_FEED_ID= "AI_PROJECT_2/feeds/humidity-feed"
        self.AIO_LIGHT_FEED_ID= "AI_PROJECT_2/feeds/light-feed"
        
    def connected(self, client, userData, flags, rc):
        print("Connected to server!")
        # Several feeds receive data from dashboard
        client.subscribe(self.AIO_LED_BUTTON_FEED_ID)
        client.subscribe(self.AIO_PUMP_BUTTON_FEED_ID)
        client.subscribe(self.AIO_CONTROL_SPEED_FAN_FEED_ID)

        # Several feeds send data to dashboard
        client.subscribe(self.AIO_HUMIDITY_FEED_ID)
        client.subscribe(self.AIO_LIGHT_FEED_ID)
        client.subscribe(self.AIO_TEMPERATURE_FEED_ID)

    def subscribe(self, client, userData, mid, granted_qos):
        print("Subscribe feed has order " + str(mid)+  " is completely!")
    
    def disconnected(self, client, userData, rc):
        print("Interrupt connection")
        sys.exit(1)
        
    def message(self, client, userData, msg):
        if str(msg.topic)== self.AIO_LED_BUTTON_FEED_ID:
            if str(msg.payload)== "b'1'":
                print("LED was turned ON.")
            else:
                print("LED was turned OFF.")
        else:
            if str(msg.topic)== self.AIO_PUMP_BUTTON_FEED_ID:
                if str(msg.payload) == "b'1'":
                    print("PUMP was turned ON.")
                else:
                    print("PUMP was turned OFF.")
            else:
                if str(msg.topic)== self.AIO_CONTROL_SPEED_FAN_FEED_ID:
                    if str(msg.payload) == "b'0'":
                        print("FAN was turned OFF.")
                    else:
                        if str(msg.payload) != "b'100'":
                            print("FAN was turned ON with speed: "+ str(msg.payload)[2: 4]+ ".")
                        else:
                            print("FAN was turned on with speed: "+ str(msg.payload)[2: 5]+ ".")
           
    def InteractionServerGateway(self):
        client= mqtt.Client()
        client.username_pw_set(self.AIO_USERNAME, self.AIO_KEY)
        client.connect("io.adafruit.com", 1883, 60)
        client.on_connect= self.connected
        client.on_disconnect= self.disconnected
        client.on_message= self.message
        client.on_subscribe= self.subscribe
        client.loop_start()
        while True:
            # time.sleep(1)
            temperature= random.randint(0, 40)
            client.publish(self.AIO_TEMPERATURE_FEED_ID, temperature)
            humidity= random.randint(0, 100)
            client.publish(self.AIO_HUMIDITY_FEED_ID, humidity)
            light= random.randint(0, 600)
            client.publish(self.AIO_LIGHT_FEED_ID, light)
            time.sleep(10)
               
            
            
if __name__== "__main__":
    IoTGatewayObject= IoTGateway()
    IoTGatewayObject.InteractionServerGateway()
