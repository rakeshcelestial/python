import json


#  Validation Class
class UserValidator:
    def validate(self, data):
        if "username" not in data or not data["username"]:
            raise ValueError("Username is required")

        if "email" not in data or "@" not in data["email"] or "." not in data["email"]:
            raise ValueError("Invalid email")

        print("Validation passed")


#  Storage Class
class UserStorage:
    def __init__(self, file_name="users.json"):
        self.file_name = file_name

    def save(self, data):
        try:
            with open(self.file_name, "r") as file:
                users = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            users = []

        users.append(data)

        with open(self.file_name, "w") as file:
            json.dump(users, file, indent=4)

        print("User saved to users.json")


#  Notification Class
class UserNotifier:
    def send_welcome(self, email):
        print(f"Welcome email sent to {email}")


#  Orchestrator Function
def register_user(data):
    validator = UserValidator()
    storage = UserStorage()
    notifier = UserNotifier()

    # Step 1: Validate
    validator.validate(data)

    # Step 2: Store
    storage.save(data)

    # Step 3: Notify
    notifier.send_welcome(data["email"])


# Input
data = {"username": "alice", "email": "alice@mail.com"}

register_user(data)