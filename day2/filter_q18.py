users = [
  {"username": "alice", "email": "a@b.com", "age": 25, "active": True},
  {"username": "bob", "email": "b@b.com", "age": 17, "active": True},
  {"username": "carol", "email": "c@b.com", "age": 30, "active": False},
  {"username": "dave", "email": "d@b.com", "age": 22, "active": True},
]

result = {u["username"]: u["email"] for u in users if u["active"] and u["age"] >= 18}

print(result)