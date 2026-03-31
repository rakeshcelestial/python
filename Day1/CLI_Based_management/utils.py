from storage import load_users, save_users
from logger import log_message


def register_user():
    username = input("Enter username: ").strip()
    password = input("Enter password: ").strip()

    if not username or not password:
        print("Fields cannot be empty")
        return

    data = load_users()

    for user in data["users"]:
        if user["username"] == username:
            print("Username already exists")
            log_message("WARNING", f"Duplicate registration attempt: {username}")
            return

    data["users"].append({"username": username, "password": password})
    save_users(data)

    print("User registered successfully")
    log_message("INFO", f"User '{username}' registered successfully")


def login_user():
    data = load_users()
    attempts = 3

    while attempts > 0:
        username = input("Enter username: ")
        password = input("Enter password: ")

        for user in data["users"]:
            if user["username"] == username and user["password"] == password:
                print("Login successful")
                log_message("INFO", f"User '{username}' logged in")
                return

        attempts -= 1
        print(f"Invalid credentials. Attempts left: {attempts}")
        log_message("ERROR", f"Failed login attempt for '{username}'")

    log_message("WARNING", f"Account locked for '{username}' after 3 attempts")


def view_users():
    data = load_users()

    if not data["users"]:
        print("No users found")
        return

    print("Users:")
    for user in data["users"]:
        print("-", user["username"])

    log_message("INFO", "User list viewed")


def delete_user():
    username = input("Enter username to delete: ").strip()
    data = load_users()

    for user in data["users"]:
        if user["username"] == username:
            data["users"].remove(user)
            save_users(data)
            print("User deleted successfully")
            log_message("INFO", f"User '{username}' deleted")
            return

    print("User not found")
    log_message("ERROR", f"Delete failed, user '{username}' not found")