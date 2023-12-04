import json

path = '../data/original_data/dimension_score_all.json'
json_file_path_grounding = '../data/To_Release/dimension_score_all.json'
with open(path, 'r') as file:
    data = json.load(file)

# 将数据转换为所需格式
transformed_data = {}
for entry in data:
    model = entry["model"]
    if model not in transformed_data:
        transformed_data[model] = {"model": model, "dimensions": {}}
    transformed_data[model]["dimensions"][entry["category"]] = entry["score"]

# 将字典转换回列表
transformed_list = list(transformed_data.values())
with open(json_file_path_grounding, 'w') as file:
    json.dump(transformed_list, file, indent=4)