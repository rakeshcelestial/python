keys = ['a', 'b', 'c']
values = [1, 2, 3]

result = {k: v for k, v in zip(keys, values)}

print(result)


a = [1,1,2,2,3,3,4]
uni = []
for i in a:
    if i not in uni:
        uni.append(i)
print(uni)

