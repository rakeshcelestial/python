import time
from multiprocessing import Pool


# CPU-bound function
def compute_squares(n):
    total = 0
    for i in range(1, n + 1):
        total += i * i
    return total


# Sequential Execution
def run_sequential(values):
    start = time.time()
    results = []

    for v in values:
        res = compute_squares(v)
        results.append(res)
        print(f"Result for {v}: {res}")

    end = time.time()
    print(f"\nSequential time: {round(end - start, 2)}s\n")


#  Multiprocessing Execution
def run_multiprocessing(values):
    start = time.time()

    with Pool() as pool:
        results = pool.map(compute_squares, values)

    for v, res in zip(values, results):
        print(f"Result for {v}: {res}")

    end = time.time()
    print(f"\nMultiprocessing time: {round(end - start, 2)}s\n")


if __name__ == "__main__":
    values = [10_000_000, 20_000_000, 15_000_000, 25_000_000]

    print("---- Sequential ----")
    run_sequential(values)

    print("---- Multiprocessing ----")
    run_multiprocessing(values)