import cv2

from mysite.crop import cropIfNeeded


def imagePreprocess(path):
    image = cv2.imread(path)
    image = cv2.resize(image, (960, 1280))
    image = cropIfNeeded(image)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, blackNwhite = cv2.threshold(gray, 125, 255, cv2.THRESH_BINARY)
    blur = cv2.GaussianBlur(blackNwhite, (5, 5), 0)
    edged = cv2.Canny(blur, 50, 150)
    contours, _ = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL,
                                   cv2.CHAIN_APPROX_SIMPLE)

    return image, blur, contours
