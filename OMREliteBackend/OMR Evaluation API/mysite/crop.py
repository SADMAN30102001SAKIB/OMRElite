import cv2


def cropIfNeeded(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, blackNwhite = cv2.threshold(gray, 125, 255, cv2.THRESH_BINARY)
    blur = cv2.GaussianBlur(blackNwhite, (5, 5), 0)

    edged = cv2.Canny(blur, 50, 150)

    contours, _ = cv2.findContours(
        edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(largest_contour)

        image_area = image.shape[0] * image.shape[1]
        contour_area = w * h
        coverage_ratio = contour_area / image_area

        if coverage_ratio > 0.3:
            cropped_image = image[y + 5 : y + h - 5, x + 5 : x + w - 5]
            return cropped_image

    return image
