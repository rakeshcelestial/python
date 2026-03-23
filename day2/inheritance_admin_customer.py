class User:
    def __init__(self, username, role):
        self.username = username
        self.role = role

    def display_profile(self):
        print(f"User: {self.username} | Role: {self.role}")


# Admin subclass
class AdminUser(User):
    def __init__(self, username, permissions):
        super().__init__(username, "Admin")  # calling parent constructor
        
        # validation: permissions must be list of strings
        if not isinstance(permissions, list) or not all(isinstance(p, str) for p in permissions):
            raise ValueError("Permissions must be a list of strings")
        
        self.permissions = permissions

    def display_profile(self):   # method overriding (polymorphism)
        perms = ", ".join(self.permissions)
        print(f"Admin: {self.username} | Permissions: {perms}")


# Customer subclass
class CustomerUser(User):
    def __init__(self, username, orders):
        super().__init__(username, "Customer")  # calling parent constructor
        
        self.orders = orders

    def display_profile(self):   # method overriding (polymorphism)
        print(f"Customer: {self.username} | Orders: {self.orders}")


# Testing
admin = AdminUser("admin1", ["manage_users", "view_logs"])
customer = CustomerUser("cust1", 5)

admin.display_profile()
customer.display_profile()