import csv
import io
import smtplib
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from flask import Flask, make_response, request
from flask_cors import CORS
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

app = Flask(__name__)
CORS(app)


def generate_exam_report(
    students,
    institute_name,
    paper_name,
    right_additional_data=None,
    left_additional_data=None,
    selected_columns=None,
):
    buffer = io.BytesIO()
    pdf = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=50,
        rightMargin=50,
        topMargin=60,
        bottomMargin=72,
    )
    elements = []
    styles = getSampleStyleSheet()

    title_style = styles["Title"]
    title_style.fontSize = 12

    heading2_style = styles["Heading2"]
    heading2_style.fontSize = 10

    elements.append(Paragraph(institute_name, title_style))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph(paper_name, heading2_style))
    elements.append(Spacer(1, 12))

    if left_additional_data or right_additional_data:
        left_data = (
            [
                Paragraph(f"{key}: {value}", styles["Normal"])
                for key, value in left_additional_data.items()
            ]
            if left_additional_data
            else []
        )
        right_data = (
            [
                Paragraph(f"{key}: {value}", styles["Normal"])
                for key, value in right_additional_data.items()
            ]
            if right_additional_data
            else []
        )

        max_length = max(len(left_data), len(right_data))
        left_data += ["" for _ in range(max_length - len(left_data))]
        right_data += ["" for _ in range(max_length - len(right_data))]

        data_for_table = [[left, right] for left, right in zip(left_data, right_data)]

        additional_data_table = Table(data_for_table, colWidths=[pdf.width / 2])
        additional_data_table.setStyle(
            TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")])
        )
        elements.append(additional_data_table)
        elements.append(Spacer(1, 24))

    if selected_columns is None:
        selected_columns = ["Serial", "ID", "Student Name", "Set", "Score"]

    if "Score" not in selected_columns:
        selected_columns.append("Score")

    predefined_widths = {
        "Serial": 0.50 * 72,
        "ID": 1 * 72,
        "Student Name": 3 * 72,
        "Set": 0.30 * 72,
        "Score": 0.75 * 72,
    }

    column_widths = [
        predefined_widths[col] for col in selected_columns if col in predefined_widths
    ]

    header = selected_columns
    data = [header]

    for i, student in enumerate(students, start=1):
        row = []
        for col in selected_columns:
            if col == "Serial":
                row.append(i)
            elif col == "ID":
                row.append(student["roll_number"])
            elif col == "Student Name":
                row.append(student["name"])
            elif col == "Set":
                row.append(student["set"])
            elif col == "Score":
                row.append(student["marks"])
        data.append(row)

    table = Table(data, colWidths=column_widths)
    table.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
            ]
        )
    )

    elements.append(table)
    pdf.build(elements)
    buffer.seek(0)
    return buffer


@app.route("/generate_report", methods=["POST"])
def generate_report():
    data = request.json

    institute_name = data.get("institute_name")
    paper_name = data.get("paper_name")
    isSerial = data.get("isSerial")
    isID = data.get("isID")
    isName = data.get("isName")
    isSet = data.get("isSet")
    sortBy = data.get("sortBy")
    totalSet = data.get("totalSet")
    isLeftAddionalData = data.get("isLeftAddionalData")

    setStudents = []
    if totalSet != "none":
        for i in range(1, len(totalSet) + 1):
            setStudents.append(data.get("setStudent" + str(i)))
    else:
        setStudents.append(data.get("setStudent1"))

    roll_numbers = []
    names = []
    sets = []
    marks = []
    for i in range(1, sum(setStudents) + 1):
        roll_numbers.append(data.get("roll_number" + str(i)))
        names.append(data.get("name" + str(i)))
        sets.append(data.get("set" + str(i)))
        marks.append(data.get("mark" + str(i)))

    right_additional_data = {}
    if isLeftAddionalData:
        above80 = data.get("above80")
        sixtyTo79 = data.get("sixtyTo79")
        fortyTo59 = data.get("fortyTo59")
        below40 = data.get("below40")
        if totalSet != "none":
            right_additional_data[
                "Student's Performance Of "
                + "SET "
                + ", ".join("".join(sorted(totalSet)))
            ] = ""
        else:
            right_additional_data["Performance Of All Student"] = ""
        right_additional_data["Above 80%"] = above80
        right_additional_data["60% - 79%"] = sixtyTo79
        right_additional_data["40% - 59%"] = fortyTo59
        right_additional_data["Below 40%"] = below40

    left_additional_data = {}
    if totalSet != "none":
        if len(totalSet) > 1:
            index = 0
            left_additional_data[
                "SET (" + ", ".join("".join(sorted(totalSet))) + ") | Total Examinee"
            ] = sum(setStudents)
            if "A" in totalSet:
                left_additional_data["SET-A | Total Examinee"] = setStudents[index]
                index += 1
            if "B" in totalSet:
                left_additional_data["SET-B | Total Examinee"] = setStudents[index]
                index += 1
            if "C" in totalSet:
                left_additional_data["SET-C | Total Examinee"] = setStudents[index]
                index += 1
            if "D" in totalSet:
                left_additional_data["SET-D | Total Examinee"] = setStudents[index]
                index += 1
        else:
            left_additional_data["SET-" + totalSet + " | Total Examinee"] = setStudents[
                0
            ]
    else:
        left_additional_data["Total Students"] = setStudents[0]

    selected_columns = []
    if isSerial:
        selected_columns.append("Serial")
    if isID:
        selected_columns.append("ID")
    if isName:
        selected_columns.append("Student Name")
    if isSet:
        selected_columns.append("Set")
    selected_columns.append("Score")

    students = [
        {"roll_number": roll, "name": name, "set": set_, "marks": mark}
        for roll, name, set_, mark in zip(roll_numbers, names, sets, marks)
    ]
    if sortBy == "marks":
        students = sorted(students, key=lambda x: x[sortBy], reverse=True)
    else:
        students = sorted(students, key=lambda x: x[sortBy], reverse=False)

    pdf_stream = generate_exam_report(
        students,
        institute_name,
        paper_name,
        right_additional_data,
        left_additional_data,
        selected_columns=selected_columns,
    )

    response = make_response(pdf_stream.read())
    response.headers["Content-Type"] = "application/pdf"
    response.headers["Content-Disposition"] = "attachment; filename=report.pdf"
    return response


def send_email_with_attachment(
    csv_content, recipient_email, msgBody, filename="report.csv"
):
    sender_email = "evan30102001flair@gmail.com"
    sender_password = "duma iqcf domb qnry"

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient_email
    msg["Subject"] = "Student Report"

    body = str(msgBody)
    msg.attach(MIMEText(body, "plain"))

    part = MIMEApplication(csv_content, Name=filename)
    part["Content-Disposition"] = f'attachment; filename="{filename}"'
    msg.attach(part)

    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login(sender_email, sender_password)
    server.send_message(msg)
    server.quit()

    print("Email sent successfully!")


def generate_exam_report_csv(
    students, isSerial=True, isID=True, isName=True, isSet=True
):
    output = io.StringIO()
    writer = csv.writer(output)

    columns = []
    if isSerial:
        columns.append("Serial No.")
    if isID:
        columns.append("Roll Number")
    if isName:
        columns.append("Student Name")
    if isSet:
        columns.append("Set")
    columns.append("Score")

    writer.writerow(columns)
    for i, student in enumerate(students, start=1):
        row = []
        if isSerial:
            row.append(i)
        if isID:
            row.append(student.get("roll_number", ""))
        if isName:
            row.append(student.get("name", ""))
        if isSet:
            row.append(student.get("set", ""))
        row.append(student.get("marks", ""))
        writer.writerow(row)

    return output.getvalue()


@app.route("/generate_report_csv", methods=["POST"])
def generate_report_csv():
    data = request.json

    paper_name = data.get("paper_name")
    isSerial = data.get("isSerial")
    isID = data.get("isID")
    isName = data.get("isName")
    isSet = data.get("isSet")
    sortBy = data.get("sortBy")
    totalSet = data.get("totalSet")
    rEmail = data.get("rEmail")

    setStudents = []
    if totalSet != "none":
        for i in range(1, len(totalSet) + 1):
            setStudents.append(data.get("setStudent" + str(i)))
    else:
        setStudents.append(data.get("setStudent1"))

    roll_numbers = []
    names = []
    sets = []
    marks = []
    for i in range(1, sum(setStudents) + 1):
        roll_numbers.append(data.get("roll_number" + str(i)))
        names.append(data.get("name" + str(i)))
        sets.append(data.get("set" + str(i)))
        marks.append(data.get("mark" + str(i)))

    students = [
        {"roll_number": roll, "name": name, "set": set_, "marks": mark}
        for roll, name, set_, mark in zip(roll_numbers, names, sets, marks)
    ]
    if sortBy == "marks":
        students = sorted(students, key=lambda x: x[sortBy], reverse=True)
    else:
        students = sorted(students, key=lambda x: x[sortBy], reverse=False)

    csv_content = generate_exam_report_csv(students, isSerial, isID, isName, isSet)
    try:
        send_email_with_attachment(csv_content, rEmail, paper_name)
    except Exception as e:
        print(f"Error sending email: {e}")
        return "Failed to send email!"

    return "Email sent successfully!"


@app.route("/")
def hello():
    return "reportGen"
