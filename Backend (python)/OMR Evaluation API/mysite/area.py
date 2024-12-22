import cv2


def findArea(squares):
    areaList = []
    areaListSort = []
    for i in range(0, len(squares)):
        _, _, w, h = cv2.boundingRect(squares[i])
        areaList.append(w * h)
        areaListSort.append(w * h)
    areaListSort.sort()

    return areaList, areaListSort
