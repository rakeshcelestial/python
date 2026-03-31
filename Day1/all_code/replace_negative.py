nums = [1, -2, 3, -4, 5]

result = [0 if num < 0 else num for num in nums]

print(result)

# for num in nums:
#     if num < 0:
#          result.append(0)
#     else:
#        result.append(num)