import os

from flask import Flask, make_response, request, send_file
from flask_cors import CORS
from mysite.delete import deleteFiles
from mysite.evaluatePage1 import evaluate1
from mysite.evaluatePage2 import evaluate2
from mysite.file import fileSetup
from mysite.pdf import imgToPDF
from mysite.rollset import getRollSet
from mysite.split import split_list

app = Flask(__name__)
CORS(
    app,
    expose_headers=["marks", "error", "idno", "setno", "marked_index"],
)


@app.route("/upload", methods=["POST"])
def upload_file():
    inputpath1 = inputpath2 = outputpath1 = outputpath2 = pdf_output = ""
    try:
        totalQuestions = int(request.form.get("questionsCount"))
        numSet = int(request.form.get("setCount"))
        ansList = []
        for j in range(1, numSet + 1):
            ans = []
            sizes = [15, 20, 25, 22, 18]
            for i in range(1, totalQuestions + 1):
                key = "set" + str(j) + "Q" + str(i)
                ans.append(request.form.get(key))
            ansList.append(split_list(ans, sizes))

        markPerQuestion = float(request.form.get("mpq"))
        isNegative = request.form.get("isNegative") == "true"
        negativeMark = float(request.form.get("negativeMark"))
        if negativeMark < 0:
            negativeMark *= -1
        if not isNegative:
            negativeMark = 0
        isRoll = request.form.get("isRoll") == "true"
        digits = int(request.form.get("rollDigit"))
        file1 = request.files.get("file1")
        file2 = request.files.get("file2")

        realAns = []
        realIdNo = -1
        realSetNo = ""
        realMarks = 0
        regenerate = request.form.get("regenerate") == "true"
        if regenerate:
            for i in range(1, totalQuestions + 1):
                key = "Q" + str(i)
                realAns.append(request.form.get(key))
            realIdNo = request.form.get("idno")
            realSetNo = int(request.form.get("setno"))
            realMarks = float(request.form.get("marks"))

        if totalQuestions > 35:
            files = [file1, file2]
        else:
            files = [file1]
        marked_index = []

        current_dir = os.path.dirname(__file__)
        (inputpath1, inputpath2, outputpath1, outputpath2, pdf_output) = fileSetup(
            files, current_dir
        )

        (
            msg,
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
        ) = getRollSet(
            inputpath1,
            totalQuestions,
            isRoll,
            digits,
            numSet,
            outputpath1,
            realIdNo,
            realSetNo,
            regenerate,
        )
        if regenerate and setno != -1:
            setno = realSetNo

        tempSet = 1
        if setno == 0:
            setno = 1
            tempSet = 0
            ansList = []
            for j in range(0, numSet):
                ans = []
                sizes = [15, 20, 25, 22, 18]
                for i in range(0, totalQuestions):
                    ans.append("-1")
                ansList.append(split_list(ans, sizes))
        if setno == -1:
            imgToPDF([outputpath1], pdf_output)
            response = make_response(send_file(pdf_output, as_attachment=True))
            response.headers["error"] = msg
        elif totalQuestions > 35:
            marks2, f, marked_index = evaluate2(
                inputpath2,
                totalQuestions,
                markPerQuestion,
                isNegative,
                negativeMark,
                ansList,
                outputpath2,
                setno,
                regenerate,
                realAns,
            )
            if f == -1:
                imgToPDF([outputpath2], pdf_output)
                response = make_response(send_file(pdf_output, as_attachment=True))
                response.headers["error"] = marks2
            else:
                marks1, temp_marked_index = evaluate1(
                    35,
                    markPerQuestion,
                    isNegative,
                    negativeMark,
                    ansList,
                    outputpath1,
                    marks2,
                    image,
                    blur,
                    areaList,
                    areaListSort,
                    squares,
                    q1Index,
                    q2Index,
                    markIndex,
                    setno,
                    regenerate,
                    realAns,
                    realMarks,
                )
                marked_index = temp_marked_index + marked_index
                imgToPDF([outputpath1, outputpath2], pdf_output)
                response = make_response(send_file(pdf_output, as_attachment=True))
                response.headers["marks"] = marks1 + marks2
                if tempSet == 0 and idno == -2:
                    response.headers["error"] = (
                        msg
                        + " & Can't Get The "
                        + str(digits)
                        + " Digit ID Number!||Please Manully Enter Student ID And Select Which Set Is Marked."
                    )
                elif tempSet == 0:
                    response.headers["error"] = (
                        msg + "||Please Manully Select Which Set Is Marked."
                    )
                    response.headers["idno"] = idno
                elif idno == -2:
                    response.headers["error"] = (
                        "Can't Get The "
                        + str(digits)
                        + " Digit ID Number!||Please Manully Enter Student ID"
                    )
                    response.headers["setno"] = setno
                else:
                    response.headers["idno"] = idno
                    response.headers["setno"] = setno
                response.headers["marked_index"] = marked_index
        else:
            marks, marked_index = evaluate1(
                totalQuestions,
                markPerQuestion,
                isNegative,
                negativeMark,
                ansList,
                outputpath1,
                0,
                image,
                blur,
                areaList,
                areaListSort,
                squares,
                q1Index,
                q2Index,
                markIndex,
                setno,
                regenerate,
                realAns,
                realMarks,
            )
            imgToPDF([outputpath1], pdf_output)
            response = make_response(send_file(pdf_output, as_attachment=True))
            response.headers["marks"] = marks
            if tempSet == 0 and idno == -2:
                response.headers["error"] = (
                    msg
                    + " & Can't Get The "
                    + str(digits)
                    + " Digit ID Number!||Please Manully Enter Student ID And Select Which Set Is Marked."
                )
            elif tempSet == 0:
                response.headers["error"] = (
                    msg + "||Please Manully Select Which Set Is Marked."
                )
                response.headers["idno"] = idno
            elif idno == -2:
                response.headers["error"] = (
                    "Can't Get The "
                    + str(digits)
                    + " Digit ID Number!||Please Manully Enter Student ID"
                )
                response.headers["setno"] = setno
            else:
                response.headers["idno"] = idno
                response.headers["setno"] = setno
            response.headers["marked_index"] = marked_index
        deleteFiles(pdf_output, inputpath1, outputpath1, inputpath2, outputpath2)

        if regenerate:
            print("realMarks: ", realMarks)
        else:
            print(response.headers)

        return response

    except Exception as e:
        print("Custom error msg: ", e)
        deleteFiles(pdf_output, inputpath1, outputpath1, inputpath2, outputpath2)
        return str(e)


@app.route("/")
def index():
    return "omrEval"
