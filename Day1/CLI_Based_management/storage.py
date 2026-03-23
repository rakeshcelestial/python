import json
from logger import log_message

FILE_NAME = "users.json"

def load_users():
    try:
        with open(FILE_NAME, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        log_message("ERROR", "users.json file not found")
        return {"users": []}
    except json.JSONDecodeError:
        log_message("ERROR", "JSON file corrupted")
        return {"users": []}
    except:
        log_message("ERROR", "SOME ERROR OCCURED")
        return {"users": []}


def save_users(data):
    try:
        with open(FILE_NAME, "w") as file:
            json.dump(data, file, indent=4)
    except Exception as e:
        log_message("ERROR", f"Error saving users: {e}")