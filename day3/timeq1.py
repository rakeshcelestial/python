import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()

        print(f"[timer] {func.__name__} executed in {end - start:.4f}s")
        return result
    return wrapper


@timer
def compute_squares(n):
    """Computes sum of squares from 1 to n."""
    return sum(i * i for i in range(1, n + 1))


result = compute_squares(1000000)

print(f"Result: {result}")
print(f"Function name: {compute_squares.__name__}")
print(f"Docstring: {compute_squares.__doc__}")