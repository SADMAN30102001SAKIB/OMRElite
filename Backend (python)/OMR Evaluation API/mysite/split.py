def split_list(original_list, sizes):
    parts = []
    start_index = 0

    for size in sizes:
        end_index = start_index + size
        part = original_list[start_index:end_index]
        parts.append(part)
        start_index = end_index

        if end_index >= len(original_list):
            break

    while len(parts) < 5:
        parts.append([])

    return parts
