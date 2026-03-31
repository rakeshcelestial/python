#Given a list of integers, remove duplicate elements while preserving the original order of first occurrence. 
def remove_duplicates(nums):
    seen = {}        # dictionary to track seen elements
    result = []      # list to store result
    
    for num in nums:
        if num not in seen:
            seen[num] = True
            result.append(num)
    
    return result

# Example
nums = [1, 2, 2, 3, 4, 4, 5]
print(remove_duplicates(nums))