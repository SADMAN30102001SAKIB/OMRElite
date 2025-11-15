import cv2
import numpy as np
from mysite.xywh import infoSquare


def compareStrings(A, B):
    for char in B:
        if char not in A:
            return False
    return True


def checkQuestions(
    questions,
    ans,
    isNegative,
    image,
    blur,
    areaList,
    areaListSort,
    squares,
    num,
    n,
    markPerQuestion,
    negativeMark,
    regenerate,
    realAns,
    prev,
):
    x, y, w, h = infoSquare(areaList, areaListSort, squares, num)
    circle_radius = round(w / 14)
    marked_index = []
    marks = 0

    for i in range(0, questions):
        marked_circle_index = []
        min_intensity = 150
        # print(f"Q{i+1} = ", end='')
        for j in range(0, 4):
            mask = np.zeros(blur.shape, np.uint8)
            cv2.circle(
                mask,
                (
                    round((2 * x + (2 * j + 1) * w / 4) / 2),
                    round((2 * y + (2 * i + 1) * h / n) / 2),
                ),
                circle_radius,
                255,
                -1,
            )
            if str(j + 1) in ans[i] and "-" not in ans[i]:
                cv2.circle(
                    image,
                    (
                        round((2 * x + (2 * j + 1) * w / 4) / 2),
                        round((2 * y + (2 * i + 1) * h / n) / 2),
                    ),
                    circle_radius,
                    (50, 220, 50),
                    -1,
                )

            circle_intensity = cv2.mean(blur, mask=mask)[0]
            # if circle_intensity < min_intensity:
            #     print(f"{j+1}: {int(circle_intensity)}, ", end='')

            if circle_intensity < min_intensity and not regenerate:
                marked_circle_index.append(j)
                if str(j + 1) not in ans[i] or "-" in ans[i]:
                    cv2.circle(
                        image,
                        (
                            round((2 * x + (2 * j + 1) * w / 4) / 2),
                            round((2 * y + (2 * i + 1) * h / n) / 2),
                        ),
                        circle_radius,
                        (0, 0, 255),
                        -1,
                    )
                else:
                    cv2.circle(
                        image,
                        (
                            round((2 * x + (2 * j + 1) * w / 4) / 2),
                            round((2 * y + (2 * i + 1) * h / n) / 2),
                        ),
                        circle_radius,
                        (255, 0, 0),
                        -1,
                    )
            if regenerate and str(j + 1) in realAns[i + prev]:
                if str(j + 1) not in ans[i] or "-" in ans[i]:
                    cv2.circle(
                        image,
                        (
                            round((2 * x + (2 * j + 1) * w / 4) / 2),
                            round((2 * y + (2 * i + 1) * h / n) / 2),
                        ),
                        circle_radius,
                        (0, 0, 255),
                        -1,
                    )
                else:
                    cv2.circle(
                        image,
                        (
                            round((2 * x + (2 * j + 1) * w / 4) / 2),
                            round((2 * y + (2 * i + 1) * h / n) / 2),
                        ),
                        circle_radius,
                        (255, 0, 0),
                        -1,
                    )

        if int(ans[i]) > 0:
            if not len(marked_circle_index):
                marked_index.append(0)
            else:
                incremented_list = [x + 1 for x in marked_circle_index]
                number_str = "".join(str(x) for x in incremented_list)
                marked_index.append(int(number_str))
                if not compareStrings(ans[i], number_str):
                    if isNegative:
                        marks -= negativeMark
                else:
                    marks += markPerQuestion
        else:
            if len(marked_circle_index):
                incremented_list = [x + 1 for x in marked_circle_index]
                number_str = "".join(str(x) for x in incremented_list)
                marked_index.append(int(number_str))
                if int(ans[i]) == -2:
                    marks += markPerQuestion
                if int(ans[i]) == -4 or int(ans[i]) == -5:
                    marks -= negativeMark
            else:
                marked_index.append(0)
                if int(ans[i]) == -2 or int(ans[i]) == -3 or int(ans[i]) == -5:
                    marks += markPerQuestion
        # print(end='\n')
    # print(f"For {n}'s Box: ", marked_index)

    return marks, marked_index
