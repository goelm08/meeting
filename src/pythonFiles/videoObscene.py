from nsfw_detector import predict
import cv2
model = predict.load_model('nsfw.299x299.h5')

vidcap = cv2.VideoCapture(r"C:\Users\goelm\Downloads\closer.mp4")
success,image = vidcap.read()
count = 0
Profanity = False

def check_neut(result, fileName):
    if(result[fileName]['hentai']>0.3 or result[fileName]['porn']>0.4 or result[fileName]['sexy']>0.2):
        return True
    else:
        return False

while success:
    success,image = vidcap.read()
    count = (count+1)%30
    if(count != 0):
        continue
    cv2. imwrite("frame.jpg", image) # save frame as JPEG file.
    fileName = 'frame.jpg'
    if(check_neut(predict.classify(model, fileName, 299), fileName)):
        print('True')
        Profanity = True
        break
