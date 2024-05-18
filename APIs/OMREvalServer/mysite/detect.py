import cv2


def detectSquares(outputpath, image, squares, x=0, y=0, w=0, h=0):
    if x == 0 and y == 0 and w == 0 and h == 0:
        for square in squares:
            for point in square:
                cv2.circle(image, tuple(point[0]), 12, (0, 0, 255), -1)
    else:
        cv2.circle(image, (x, y), 12, (0, 0, 255), -1)
        cv2.circle(image, (x + w, y), 12, (0, 0, 255), -1)
        cv2.circle(image, (x, y + h), 12, (0, 0, 255), -1)
        cv2.circle(image, (x + w, y + h), 12, (0, 0, 255), -1)

    cv2.imwrite(outputpath, image)
