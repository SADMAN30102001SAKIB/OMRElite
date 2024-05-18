import cv2


def adjust(x, y, w, h):
    x += 7
    y += 10
    w -= 17
    h -= 18
    return x, y, w, h


def infoSquare(areaList, areaListSort, squares, n):
    x = y = w = h = 0
    for i, num in enumerate(areaList):
        if n:
            if num == areaListSort[len(areaListSort) - n]:
                x, y, w, h = cv2.boundingRect(squares[i])
                break
        else:
            if num == areaListSort[0]:
                x, y, w, h = cv2.boundingRect(squares[i])
                break
    x, y, w, h = adjust(x, y, w, h)

    return x, y, w, h
