import json

def is_valid_json(data):
    try:
        json.loads(data)   # Try converting JSON
        return True
    except json.JSONDecodeError:
        return False


# Test cases
print(is_valid_json('{"name": "John", "age": 30}'))   # True
print(is_valid_json('{"name": "John", "age": }'))     # False