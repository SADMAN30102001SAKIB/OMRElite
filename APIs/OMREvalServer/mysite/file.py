import os


def fileSetup(files, current_dir):
    inputpath1 = inputpath2 = outputpath1 = outputpath2 = ""
    if len(files) == 1 and files[0] and files[0].filename != "":
        inputpath1 = os.path.join(current_dir, files[0].filename)
        files[0].save(inputpath1)
        outputpath1 = os.path.join(current_dir, "output.jpg")
    elif (len(files) == 2 and files[0] and files[1] and files[0].filename != ""
          and files[1].filename != ""):
        inputpath1 = os.path.join(current_dir, files[0].filename)
        files[0].save(inputpath1)
        inputpath2 = os.path.join(current_dir, files[1].filename)
        files[1].save(inputpath2)
        outputpath1 = os.path.join(current_dir, "output1.jpg")
        outputpath2 = os.path.join(current_dir, "output2.jpg")
    pdf_output = os.path.join(current_dir, "output.pdf")

    return (
        inputpath1,
        inputpath2,
        outputpath1,
        outputpath2,
        pdf_output,
    )
