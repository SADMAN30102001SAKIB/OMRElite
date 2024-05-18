import cv2


def findSquares(contours):
    squares = []
    for cnt in contours:
        epsilon = 0.1 * cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, epsilon, True)

        if len(approx) == 4:
            area = cv2.contourArea(approx)
            if area > 500:
                squares.append(approx)
    return squares
