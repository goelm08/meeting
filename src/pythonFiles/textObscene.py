#ffmpeg.exe -i .\Recording.m4a .\Recording.flac

import speech_recognition as sr
r = sr.Recognizer()
with sr.AudioFile(r"C:\Users\goelm\Documents\Sound Recordings\Recording2.flac") as source:
    # listen for the data (load audio to memory)
    audio_data = r.record(source)
    # recognize (convert from speech to text)
    text = r.recognize_google(audio_data)
    print(text)

with open('offensive.txt') as file:
    profanity_words = file.read()

profanity_words = profanity_words.split('\n')
print(profanity_words[-1])
text = "This is an offensive umbrella"
profanity = False
for word in text.split(' '):
    if word.lower() in profanity_words or '*' in word:
        print (word)
        profanity = True
        break

if(profanity):
    print('true')
else:
    print('false')