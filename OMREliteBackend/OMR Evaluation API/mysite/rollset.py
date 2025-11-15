from mysite.area import findArea
from mysite.detect import detectSquares
from mysite.find import findSquares
from mysite.imgpre import imagePreprocess
from mysite.index import boxIndex
from mysite.rollbox import checkRoll
from mysite.setbox import checkSet


def getRollSet(
    image_path,
    totalQuestions,
    isRoll,
    digits,
    numSet,
    outputpath,
    realIdNo,
    realSetNo,
    regenerate,
):
    image, blur, contours = imagePreprocess(image_path)

    if totalQuestions > 35:
        totalQuestions = 35

    q2Index, q1Index, rollIndex, setIndex, markIndex, box = boxIndex(
        totalQuestions, isRoll, numSet
    )

    squares = findSquares(contours)
    areaList, areaListSort = findArea(squares)
    if len(squares) != box:
        detectSquares(outputpath, image, squares)
        return (
            "Page-1 Doesn't Match With The OMR Specification! Expected "
            + str(box)
            + " Box, Got "
            + str(len(squares))
            + " Box!||||(i) Please Ensure That This Is The Correct OMR Of This Exam.||(ii)Try Changing The Camera Angle, Keep The Camera Straight With The OMR.||(iii) Try Improving The Lighting/Quality Of The Picture.",
            -1,
            -1,
            image,
            blur,
            areaList,
            areaListSort,
            squares,
            q1Index,
            q2Index,
            markIndex,
        )

    idno = -1
    if isRoll:
        marked_index, x, y, w, h = checkRoll(
            digits,
            image,
            blur,
            areaList,
            areaListSort,
            squares,
            rollIndex,
            regenerate,
            realIdNo,
        )
        roll = ""
        for i in marked_index:
            if i == -1:
                break
            roll += str(i)
        if len(roll) == digits:
            idno = roll
        else:
            idno = -2

    setno = 1
    if numSet > 1:
        marked_circle_index, x, y, w, h = checkSet(
            image,
            blur,
            areaList,
            areaListSort,
            squares,
            setIndex,
            numSet,
            realSetNo,
            regenerate,
        )
        if len(marked_circle_index) > 1:
            return (
                "Multiple Set is Marked!",
                idno,
                0,
                image,
                blur,
                areaList,
                areaListSort,
                squares,
                q1Index,
                q2Index,
                markIndex,
            )
        elif len(marked_circle_index) == 0:
            return (
                "No Set is Marked!",
                idno,
                0,
                image,
                blur,
                areaList,
                areaListSort,
                squares,
                q1Index,
                q2Index,
                markIndex,
            )
        else:
            setno = marked_circle_index[0] + 1

    return (
        "OK",
        idno,
        setno,
        image,
        blur,
        areaList,
        areaListSort,
        squares,
        q1Index,
        q2Index,
        markIndex,
    )
