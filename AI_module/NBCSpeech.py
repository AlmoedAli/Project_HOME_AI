import pandas as pd

from sklearn.feature_extraction.text import CountVectorizer

from sklearn.model_selection import train_test_split

from sklearn.naive_bayes import MultinomialNB

import numpy as np

import joblib

textFile= pd.read_csv("text.csv")
textFile['label']= textFile['label'].map({'LED_OFF': 0, 'LED_ON': 1, "DOOR_OPEN": 2, "DOOR_CLOSE": 3, "FAN_OFF": 4, 
                                          "FAN_20": 5, "FAN_40": 6, "FAN_60": 7, "FAN_80": 8, "FAN_100": 9})

y= textFile['label'].values
X= textFile['description'].values
# X= X[0:]
# X= X.astype(str)
cv= CountVectorizer()

X= cv.fit_transform(X)


XTrain, xTest, YTrain, yTest= train_test_split(X, y, test_size= 0.1, random_state= 42)

model= MultinomialNB()

modelFit= model.fit(XTrain, YTrain)

joblib.dump(modelFit, "modelSpeech.joblib")
joblib.dump(cv, "CountVectorizer.joblib")

# statement= "hello you, help me to turn on then turn off then turn on the led"

# data= [statement]

# vector= cv.transform(data)

# # print(vector)
# result= modelFit.predict(vector)

# print(result)

