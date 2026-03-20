from datetime import datetime
import json
import os

# Create logs folder
LOG_DIR = os.path.join(os.path.dirname(__file__), "logs")
os.makedirs(LOG_DIR, exist_ok=True)


def log(message, level="ERROR", log_type="txt"):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    if log_type == "txt":
        file_path = os.path.join(LOG_DIR, "app.log")
        with open(file_path, "a") as file:
            file.write(f"{timestamp} {level} {message}\n")
    
    elif log_type == "json":
        file_path = os.path.join(LOG_DIR, "app.json")
        log_entry = {
            "timestamp": timestamp,
            "level": level,
            "message": message
        }
        with open(file_path, "a") as file:
            file.write(json.dumps(log_entry) + "\n")


# 🔹 Example usage
log("Something failed", "ERROR", "txt")
log("Something failed", "ERROR", "json")