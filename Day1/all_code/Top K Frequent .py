def top_k_frequent(nums, k):
    # Step 1: Count frequencies
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1
    
    # Step 2: Create buckets
    buckets = [[] for _ in range(len(nums) + 1)]

    for num, count in freq.items():
        buckets[count].append(num)
        print(buckets)
    
    # Step 3: Collect top k elements
    result = []
    for i in range(len(buckets) - 1, 0, -1):
        for num in buckets[i]:
            result.append(num)
            if len(result) == k:
                return result


#  INPUT SECTION
nums = [1,1,1,2,2,3]
k = 2

#  FUNCTION CALL
print(top_k_frequent(nums, k))