from fpdf import FPDF
from PIL import Image


def imgToPDF(images, pdf_output):
    pdf = FPDF()
    for image in images:
        cover = Image.open(image)
        width, height = cover.size
        width, height = width / 6, height / 6
        pdf.add_page(format=(width, height))
        pdf.image(image, 0, 0, width, height)
    pdf.output(pdf_output)
