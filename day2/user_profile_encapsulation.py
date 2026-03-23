class User:
    def __init__(self, username, email, age):
        self._username = username   # private variable
        self.set_email(email)       # use setter for validation
        self.set_age(age)           # use setter for validation

    # Getter for email
    def get_email(self):
        return self._email

    # Setter for email with validation
    def set_email(self, email):
        if '@' not in email or '.' not in email:
            raise ValueError("Invalid email format")
        self._email = email

    # Getter for age
    def get_age(self):
        return self._age

    # Setter for age with validation
    def set_age(self, age):
        if age < 18 or age > 120:
            raise ValueError("Age must be between 18 and 120")
        self._age = age


# Testing
try:
    user = User("alice", "alice@mail.com", 25)

    user.set_email("invalid")   # invalid email
except ValueError as e:
    print(e)

try:
    user.set_age(150)           # invalid age
except ValueError as e:
    print(e)

print(user.get_email())
print(user.get_age())