'''Find the second largest unique number in the list. 

Input: 
nums = [10, 20, 4, 45, 99, 99] 

Output: 
45 '''
def second_largest_unique(nums):
    unique = {}
    
    # Step 1: Remove duplicates
    for num in nums:
        unique[num] = True
    
    first = float('-inf')
    second = float('-inf')
    
    # Step 2: Find largest and second largest
    for num in unique:
        if num > first:
            second = first
            first = num
        elif num > second:
            second = num
    
    return second


# Example
nums = [10, 20, 4, 45, 99, 99]
print(second_largest_unique(nums))