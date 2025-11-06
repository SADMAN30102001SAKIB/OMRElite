import cv2
import numpy as np

from mysite.xywh import infoSquare


def checkRoll(digits, image, blur, areaList, areaListSort, squares, num,
              regenerate, realIdNo):
    x, y, w, h = infoSquare(areaList, areaListSort, squares, num)
    circle_radius = round(w / 22)
    marked_index = []
    for i in range(0, digits):
        marked_circle_index = []
        min_intensity = 100
        # print(f"P{i+1} = ", end="")
        for j in range(0, 10):
            mask = np.zeros(blur.shape, np.uint8)
            cv2.circle(
                mask,
                (
                    round((2 * x + (2 * i + 1) * w / 11) / 2),
                    round((2 * y + (2 * j + 1) * h / 10) / 2),
                ),
                circle_radius,
                255,
                -1,
            )
            circle_intensity = cv2.mean(blur, mask=mask)[0]
            # if circle_intensity < min_intensity:
            #     print(f"{j}: {int(circle_intensity)}, ", end="")
            if circle_intensity < min_intensity and not regenerate:
                marked_circle_index.append(j)
                cv2.circle(
                    image,
                    (
                        round((2 * x + (2 * i + 1) * w / 11) / 2),
                        round((2 * y + (2 * j + 1) * h / 10) / 2),
                    ),
                    circle_radius,
                    (200, 0, 255),
                    -1,
                )
            if regenerate and str(j) == realIdNo[i]:
                cv2.circle(
                    image,
                    (
                        round((2 * x + (2 * i + 1) * w / 11) / 2),
                        round((2 * y + (2 * j + 1) * h / 10) / 2),
                    ),
                    circle_radius,
                    (200, 0, 255),
                    -1,
                )
        if len(marked_circle_index) != 1:
            marked_index.append(-1)
            if not regenerate: break
        else:
            marked_index.append(marked_circle_index[0])
        # print(end="\n")

    return marked_index, x, y, w, h
