import cv2
import numpy as np

from mysite.xywh import infoSquare


def checkSet(image, blur, areaList, areaListSort, squares, num, n, realSetNo,
             regenerate):
    x, y, w, h = infoSquare(areaList, areaListSort, squares, num)

    circle_radius = round(h / 10)
    marked_circle_index = []
    min_intensity = 150
    for i in range(0, n):
        mask = np.zeros(blur.shape, np.uint8)
        cv2.circle(
            mask,
            (round((2 * x + w) / 2), round((2 * y + (2 * i + 1) * h / 4) / 2)),
            circle_radius,
            255,
            -1,
        )

        circle_intensity = cv2.mean(blur, mask=mask)[0]

        if circle_intensity < min_intensity and not regenerate:
            marked_circle_index.append(i)
            cv2.circle(
                image,
                (round(
                    (2 * x + w) / 2), round(
                        (2 * y + (2 * i + 1) * h / 4) / 2)),
                circle_radius,
                (200, 0, 255),
                -1,
            )
        if regenerate and i + 1 == realSetNo:
            cv2.circle(
                image,
                (round(
                    (2 * x + w) / 2), round(
                        (2 * y + (2 * i + 1) * h / 4) / 2)),
                circle_radius,
                (200, 0, 255),
                -1,
            )

    return marked_circle_index, x, y, w, h
