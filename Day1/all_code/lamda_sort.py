data = [
    {'name': 'A', 'age': 30},
    {'name': 'B', 'age': 20}
]

result = sorted(data, key=lambda x: x['age'])

print(result)