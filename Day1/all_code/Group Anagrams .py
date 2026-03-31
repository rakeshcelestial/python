from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    
    for word in words:
        key = ''.join(sorted(word))   # O(k log k)
        groups[key].append(word)
    
    return list(groups.values())


# Example
words = ["eat","tea","tan","ate","nat","bat"]
print(group_anagrams(words))