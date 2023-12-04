import csv
import json

def read_csv_and_convert_to_json(csv_file_path):
    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        data = list(csv_reader)

    # Predefined task names
    task_names = ['Alfworld', 'Scienceworld', 'Babyai', 'Embodied', 'pddl', 'Jericho', 'Game', 'webshop', 'webarena', 'web', 'Tool-Query', 'Tool-Operation', 'tools', 'Avg']

    models_data = {}  # Use a dictionary to store data keyed by model name
    current_section = ""

    for row in data:
        if not row or '#DIV/0!' in row or all(element == '' for element in row) or "Alfworld" in row or "score" in row:  # Skip invalid rows
            continue

        if row[0].lower() in ["easy", "hard", "gap"]:  # Section headers
            current_section = row[0].lower()
            continue

        if current_section and row[0]:  # Model rows (assuming non-empty first cell)
            model_name = row[0]
            if model_name not in models_data:
                models_data[model_name] = {"model": model_name, "tasks": {}}

            # Process scores and accuracies
            for i, task_name in enumerate(task_names):
                score_index = 1 + i * 2  # Adjust index as per your CSV format
                accuracy_index = 2 + i * 2  # Adjust index as per your CSV format
                score = row[score_index] if score_index < len(row) else None
                accuracy = row[accuracy_index] if accuracy_index < len(row) else None

                if task_name not in models_data[model_name]["tasks"]:
                    models_data[model_name]["tasks"][task_name] = {}
                models_data[model_name]["tasks"][task_name][current_section] = {
                    "score": score,
                    "accuracy": accuracy
                }

    # Convert the models dictionary to a list
    json_data = list(models_data.values())

    return json_data

# Define file paths
csv_file_path = '../data/original_data/Evaluation - easy_hard results.csv'
json_file_path = '../data/To_Release/difficulty.json'

# Convert CSV to JSON
json_output = read_csv_and_convert_to_json(csv_file_path)

# Write JSON to file
with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(json_output, json_file, indent=4)
