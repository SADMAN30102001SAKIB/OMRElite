def putIndex(a, b, c, d, e):
    rollIndex = c
    setIndex = d
    q1Index = b
    q2Index = a
    markIndex = e
    return q2Index, q1Index, rollIndex, setIndex, markIndex


def boxIndex(totalQuestions, isRoll, numSet):
    box = 2
    if isRoll and numSet > 1 and totalQuestions > 15:
        box += 3
        q2Index, q1Index, rollIndex, setIndex, markIndex = putIndex(1, 2, 3, 4, 0)
    elif not isRoll and not (numSet > 1) and not (totalQuestions > 15):
        box += 0
        q2Index, q1Index, rollIndex, setIndex, markIndex = putIndex(0, 1, 0, 0, 0)
    elif isRoll and not (numSet > 1) and not (totalQuestions > 15):
        box += 1
        q2Index, q1Index, rollIndex, setIndex, markIndex = putIndex(0, 1, 2, 0, 0)
    elif not isRoll and numSet > 1 and not (totalQuestions > 15):
        box += 1
        q2Index, q1Index, rollIndex, setIndex, markIndex = putIndex(0, 1, 0, 2, 0)
    elif not isRoll and not (numSet > 1) and totalQuestions > 15:
        box += 1
        q2Index, q1Index, rollIndex, setIndex, markIndex = putIndex(1, 2, 0, 0, 0)
    elif isRoll and numSet > 1 and not (totalQuestions > 15):
        box += 2
        q2Index, q1Index, rollIndex, setIndex, markIndex = putIndex(0, 1, 2, 3, 0)
    elif isRoll and not (numSet > 1) and totalQuestions > 15:
        box += 2
        q2Index, q1Index, rollIndex, setIndex, markIndex = putIndex(1, 2, 3, 0, 0)
    elif not isRoll and numSet > 1 and totalQuestions > 15:
        box += 2
        q2Index, q1Index, rollIndex, setIndex, markIndex = putIndex(1, 2, 0, 3, 0)

    return q2Index, q1Index, rollIndex, setIndex, markIndex, box
