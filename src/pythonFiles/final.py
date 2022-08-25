from flask import Flask, request
from nsfw_detector import predict
import cv2, os, json
import speech_recognition as sr
import moviepy.editor as mp

model = predict.load_model('nsfw.299x299.h5')

# Setup flask server
app = Flask(__name__)
parent = r"C:\Users\goelm\Desktop\E-meeting\src"

with open('offensive.txt') as file:
    profanity_words = file.read()

profanity_words = profanity_words.split('\n')

# Setup url route which will calculate
# total sum of array.
def check_neut(result, fileName):
    if (result[fileName]['hentai'] > 0.3 or result[fileName]['porn'] > 0.4 or result[fileName]['sexy'] > 0.2):
        return True
    else:
        return False

def checkVideo(fileName, id):
    print(fileName)
    vidcap = cv2.VideoCapture(fileName)
    success, image = vidcap.read()
    count = 0
    Profanity = False
    fileNameJpeg = str(parent+'\\frames\\'+id + '.jpg')
    while success:
        success, image = vidcap.read()
        count = (count + 1) % 30
        if (count != 0):
            continue
        cv2.imwrite(fileNameJpeg, image)  # save frame as JPEG file.
        if (check_neut(predict.classify(model, fileNameJpeg, 299), fileNameJpeg)):
            print('True')
            Profanity = True
            break

    # if Profanity == False:
    #     os.remove(fileNameJpeg)
    #
    return Profanity

def checkAudio(fileName, id):
    profanity = False
    try:
        clip = mp.VideoFileClip(fileName)

        fileName = str(parent+'\\audio\\'+id + '.flac')

        clip.audio.write_audiofile(fileName, codec='flac')
        r = sr.Recognizer()
        with sr.AudioFile(fileName) as source:
            # listen for the data (load audio to memory)
            audio_data = r.record(source)
            # recognize (convert from speech to text)
            text = r.recognize_google(audio_data)
            print(text)

        profWords = []
        for word in text.split(' '):
            if word.lower() in profanity_words or '*' in word:
                profWords.append(word)
                profanity = True
                break
    except:
        print("error")

    #
    # if(profanity == False):
    #     os.remove(fileName)

    return profanity

@app.route('/arraysum', methods = ['POST'])
def obscene_cehck():
    data = request.get_json()
    videoProf = checkVideo(data['fileName'], data['id']+str(data['parallel']))
    audioProf = checkAudio(data['fileName'], data['id']+str(data['parallel']))

    print('*****', id)
    return json.dumps({"audio":audioProf, "video":videoProf})

if __name__ == "__main__":
    app.run(port=5010)