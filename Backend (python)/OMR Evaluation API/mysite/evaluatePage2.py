import cv2

from mysite.area import findArea
from mysite.detect import detectSquares
from mysite.find import findSquares
from mysite.imgpre import imagePreprocess
from mysite.questionbox import checkQuestions


def evaluate2(image_path, totalQuestions, markPerQuestion, isNegative,
              negativeMark, ansList, outputpath, setno, regenerate, realAns):
    image, blur, contours = imagePreprocess(image_path)

    totalQuestions -= 35
    box = 1
    if totalQuestions - 25 > 0:
        box += 1
        if totalQuestions - 47 > 0:
            box += 1

    squares = findSquares(contours)
    if len(squares) != box:
        detectSquares(outputpath, image, squares)
        return (
            "Page-2 Doesn't Match With The OMR Specification! Expected " +
            str(box) + " Box, Got " + str(len(squares)) +
            " Box!||||(i) Please Ensure That This Is The Correct OMR Of This Exam.||(ii)Try Changing The Camera Angle, Keep The Camera Straight With The OMR.||(iii) Try Improving The Lighting/Quality Of The Picture.",
            -1, [])

    areaList, areaListSort = findArea(squares)

    marks = 0
    marked_index = []
    if totalQuestions - 25 < 0:
        questions = totalQuestions
        totalQuestions = 0
    else:
        questions = 25
        totalQuestions -= 25
    tempMarks, temp_marked_index = checkQuestions(
        questions, ansList[setno - 1][2], isNegative, image, blur, areaList,
        areaListSort, squares, 1, 25, markPerQuestion, negativeMark,
        regenerate, realAns, 35)
    marks += tempMarks
    marked_index = marked_index + temp_marked_index

    if totalQuestions - 22 < 0:
        questions = totalQuestions
        totalQuestions = 0
    else:
        questions = 22
        totalQuestions -= 22
    if questions > 0:
        tempMarks, temp_marked_index = checkQuestions(
            questions, ansList[setno - 1][3], isNegative, image, blur,
            areaList, areaListSort, squares, 2, 22, markPerQuestion,
            negativeMark, regenerate, realAns, 60)
        marks += tempMarks
        marked_index = marked_index + temp_marked_index

    if totalQuestions - 18 < 0:
        questions = totalQuestions
        totalQuestions = 0
    else:
        questions = 18
        totalQuestions -= 18
    if questions > 0:
        tempMarks, temp_marked_index = checkQuestions(
            questions, ansList[setno - 1][4], isNegative, image, blur,
            areaList, areaListSort, squares, 3, 18, markPerQuestion,
            negativeMark, regenerate, realAns, 82)
        marks += tempMarks
        marked_index = marked_index + temp_marked_index

    cv2.imwrite(outputpath, image)
    return marks, 1, marked_index
