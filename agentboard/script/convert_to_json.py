import pandas as pd
import json

def create_nested_json_new(data_frame):
    nested_json = []

    for _, row in data_frame.iloc[1:].iterrows():
        model_data = {"model": row['Models']}
        tasks_data = {}

        for i in range(1, len(data_frame.columns), 2):
            main_task = data_frame.columns[i].split(' ')[0]
            sub_task_score = data_frame.columns[i]
            sub_task_accuracy = data_frame.columns[i+1]

            task_data = {
                "score": row[sub_task_score],
                "accuracy": row[sub_task_accuracy]
            }
            tasks_data[main_task] = task_data

        model_data["tasks"] = tasks_data
        nested_json.append(model_data)

    return nested_json

file_path_main_new = '../data/original_data/Evaluation - Main Results（new）.csv'
data_main_new = pd.read_csv(file_path_main_new)

nested_json_data_new = create_nested_json_new(data_main_new)

def create_nested_json_grounding(data_frame):
    grounding_data = {}

    for _, row in data_frame.iterrows():
        model = row.iloc[0]
        grounding_data[model] = {task: row[task] for task in data_frame.columns[1:]}

    return grounding_data

def percentage_to_float(percent_str):
    return str(round(float(percent_str.strip('%')) / 100, 3))

file_path_grounding = '../data/original_data/Evaluation - grounding.csv'
data_grounding = pd.read_csv(file_path_grounding)

grounding_data = create_nested_json_grounding(data_grounding)

# Integrate grounding data into nested_json_data_new, converting percentage to float
for model_data in nested_json_data_new:
    model_name = model_data["model"]
    if model_name in grounding_data:
        for task in model_data["tasks"]:
            if task in grounding_data[model_name]:
                grounding_percentage = grounding_data[model_name][task]
                model_data["tasks"][task]["grounding"] = percentage_to_float(grounding_percentage)

json_file_path_main_new = '../data/To_Release/main_data_new.json'

with open(json_file_path_main_new, 'w') as file:
    json.dump(nested_json_data_new, file, indent=4)
