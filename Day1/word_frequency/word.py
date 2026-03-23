import string
import os

def word_frequency(filename):
    freq = {}
    
    with open(filename, "r") as file:
        for line in file:
            line = line.lower()
            line = line.translate(str.maketrans('', '', string.punctuation))
            words = line.split()
            
            for word in words:
                freq[word] = freq.get(word, 0) + 1
    
    return freq


#  Best way
file_path = r"C:\Users\rakesh.p\Desktop\Py files\word_frequency\word.txt"

print(word_frequency(file_path))