import io
import os

from flask import Flask, make_response, request
from flask_cors import CORS
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas

app = Flask(__name__)
CORS(app)


def add_rectangles_to_pdf(
    input_pdf_path,
    rects_details_1,
    rects_details_2,
    permission,
    text_details_1,
    text_details_2,
):
    def create_pdf_with_rects(rects_details, text_details):
        packet = io.BytesIO()
        can = canvas.Canvas(packet)
        for text_detail in text_details:
            x, y, text, font_size, font_family, color, is_underlined = text_detail
            can.setFont(font_family, font_size)
            can.setFillColor(color)
            can.drawString(x, y, text)

            if is_underlined:
                text_width = can.stringWidth(text, font_family, font_size)
                can.line(x, y - 2, x + text_width, y - 2)
        for rect_details in rects_details:
            x, y, width, height, color = rect_details
            can.setFillColor(color)
            can.rect(x, y, width, height, fill=1, stroke=0)
        can.save()
        packet.seek(0)
        return PdfReader(packet)

    new_pdf_1 = create_pdf_with_rects(rects_details_1, text_details_1)
    new_pdf_2 = create_pdf_with_rects(rects_details_2, text_details_2)

    existing_pdf = PdfReader(open(input_pdf_path, "rb"))
    output_pdf_stream = io.BytesIO()
    output = PdfWriter(output_pdf_stream)

    for i, page in enumerate(existing_pdf.pages):
        if i == 0 and len(new_pdf_1.pages) > 0:
            page.merge_page(new_pdf_1.pages[0])
            output.add_page(page)
        elif i == 1 and len(new_pdf_2.pages) > 0 and permission:
            page.merge_page(new_pdf_2.pages[0])
            output.add_page(page)

    output.write(output_pdf_stream)
    output_pdf_stream.seek(0)
    return output_pdf_stream


@app.route("/generate-pdf", methods=["POST"])
def generate_pdf():
    data = request.json

    iName = data.get("iName")
    isIUnderline = data.get("isIUnderline")
    iSize = int(data.get("iSize"))
    iColor = data.get("iColor")
    iFont = data.get("iFont")
    pName = data.get("pName")
    isPUnderline = data.get("isPUnderline")
    pSize = int(data.get("pSize"))
    pColor = data.get("pColor")
    pFont = data.get("pFont")
    isName = data.get("isName")
    isRoll = data.get("isRoll")
    rollDigit = int(data.get("rollDigit"))
    setCount = int(data.get("setCount"))
    questionsCount = int(data.get("questionsCount"))

    text_details_1 = [
        (
            80,
            720,
            iName,
            iSize,
            iFont,
            iColor,
            isIUnderline,
        ),
        (
            80,
            700,
            pName,
            pSize,
            pFont,
            pColor,
            isPUnderline,
        ),
    ]
    text_details_2 = [
        (
            70,
            720,
            iName,
            iSize,
            iFont,
            iColor,
            isIUnderline,
        ),
        (
            70,
            700,
            pName,
            pSize,
            pFont,
            pColor,
            isPUnderline,
        ),
    ]

    input_pdf_path = os.path.join(os.path.dirname(__file__), "input.pdf")

    color = "white"
    rects_details_1 = [
        (
            0,
            0,
            0,
            0,
            "white",
        )
    ]
    rects_details_2 = [
        (
            0,
            0,
            0,
            0,
            "white",
        )
    ]

    if not isName:
        rects_details_1.append(
            (
                320,
                625,
                250,
                45,
                color,
            )
        )
        rects_details_2.append(
            (
                65,
                640,
                255,
                50,
                color,
            )
        )

    eraseRollDigit = 11 - rollDigit
    if not isRoll:
        rects_details_1.append(
            (
                70,
                450,
                225,
                200,
                color,
            )
        )
        rects_details_2.append(
            (
                370,
                640,
                220,
                50,
                color,
            )
        )
    elif eraseRollDigit > 0:
        rects_details_1.append(
            (
                278.60 - (eraseRollDigit * 15.205),
                625,
                eraseRollDigit * 15.24,
                25,
                color,
            )
        )

    eraseSetCount = 4 - setCount
    if eraseSetCount > 2:
        rects_details_1.append((290, 250, 65, 170, color))
    elif eraseSetCount > 0:
        rects_details_1.append((305, 305, 20, eraseSetCount * 20, color))
        rects_details_1.append((338, 305, 15, eraseSetCount * 20, color))

    permission = True
    eraseQuestionCount = 100 - questionsCount
    if eraseQuestionCount >= 65:
        permission = False
        eraseQuestionCount -= 65
        if eraseQuestionCount >= 20:
            box1Height = eraseQuestionCount - 20
            if box1Height > 0:
                rects_details_1.append((110, 76, 115, box1Height * 20.6, color))
                rects_details_1.append((60, 76, 35, box1Height * 20.6, color))
            rects_details_1.append((380, 65, 240, 22 * 22, color))
        elif eraseQuestionCount > 0:
            rects_details_1.append((425, 76, 115, eraseQuestionCount * 20.6, color))
            rects_details_1.append((375, 76, 35, eraseQuestionCount * 20.6, color))
    else:
        if eraseQuestionCount >= 40:
            box1Height = eraseQuestionCount - 40
            if box1Height > 0:
                rects_details_2.append((75, 85.5, 120, box1Height * 18.6, color))
                rects_details_2.append((25, 85.5, 35, box1Height * 18.6, color))
            rects_details_2.append((215, 120, 205, 22 * 23, color))
            rects_details_2.append((405, 190, 240, 22 * 18.5, color))
        elif eraseQuestionCount >= 18:
            box2Height = eraseQuestionCount - 18
            if box2Height > 0:
                rects_details_2.append((265, 141.5, 125, box2Height * 18.6, color))
                rects_details_2.append((215, 141.5, 35, box2Height * 18.6, color))
            rects_details_2.append((405, 190, 240, 22 * 18.5, color))
        elif eraseQuestionCount > 0:
            rects_details_2.append((455, 216, 120, eraseQuestionCount * 18.5, color))
            rects_details_2.append((405, 216, 35, eraseQuestionCount * 18.5, color))

    pdf_stream = add_rectangles_to_pdf(
        input_pdf_path,
        rects_details_1,
        rects_details_2,
        permission,
        text_details_1,
        text_details_2,
    )

    response = make_response(pdf_stream.getvalue())
    response.headers["Content-Type"] = "application/pdf"
    response.headers["Content-Disposition"] = "attachment; filename=output.pdf"
    return response


@app.route("/")
def hello():
    return "omrGen"
