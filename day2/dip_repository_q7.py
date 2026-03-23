from abc import ABC, abstractmethod
import json


#  Abstraction (Repository Interface)
class UserRepository(ABC):

    @abstractmethod
    def save(self, user):
        pass

    @abstractmethod
    def find(self, username):
        pass


#  In-Memory Implementation
class InMemoryUserRepository(UserRepository):
    def __init__(self):
        self.users = {}

    def save(self, user):
        self.users[user["username"]] = user

    def find(self, username):
        return self.users.get(username)


#  JSON File Implementation
class JSONUserRepository(UserRepository):
    def __init__(self, file_name="users.json"):
        self.file_name = file_name

    def save(self, user):
        try:
            with open(self.file_name, "r") as f:
                data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            data = {}

        data[user["username"]] = user

        with open(self.file_name, "w") as f:
            json.dump(data, f, indent=4)

    def find(self, username):
        try:
            with open(self.file_name, "r") as f:
                data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None

        return data.get(username)


#  Service (Depends on Abstraction)
class UserService:
    def __init__(self, repository: UserRepository):  # Dependency Injection
        self.repository = repository

    def register(self, user):
        self.repository.save(user)

    def get_user(self, username):
        return self.repository.find(username)


# Testing (Injection happens here)
repo = InMemoryUserRepository()
service = UserService(repo)

service.register({"username": "alice", "email": "a@b.com"})
print(service.get_user("alice"))