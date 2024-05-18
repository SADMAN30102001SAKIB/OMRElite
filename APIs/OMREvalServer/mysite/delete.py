import os


def deleteFiles(
    pdf_output="",
    inputpath1="",
    outputpath1="",
    inputpath2="",
    outputpath2="",
):
    try:
        os.remove(pdf_output)
    except:
        pass
    try:
        os.remove(inputpath1)
    except:
        pass
    try:
        os.remove(inputpath2)
    except:
        pass
    try:
        os.remove(outputpath1)
    except:
        pass
    try:
        os.remove(outputpath2)
    except:
        pass
