import time
import threading


# Simulated API call
def fetch_data(source, delay):
    print(f"Start fetching {source}...")
    time.sleep(delay)   # simulate IO delay
    print(f"Finished fetching {source}")


#  Sequential Execution
def run_sequential(sources):
    start = time.time()

    for source, delay in sources:
        fetch_data(source, delay)

    end = time.time()
    print(f"\nSequential time: {round(end - start, 2)}s\n")


#  Threaded Execution
def run_threaded(sources):
    start = time.time()
    threads = []

    for source, delay in sources:
        t = threading.Thread(target=fetch_data, args=(source, delay))
        threads.append(t)
        t.start()

    # Wait for all threads
    for t in threads:
        t.join()

    end = time.time()
    print(f"\nThreaded time: {round(end - start, 2)}s\n")


# Input
sources = [
    ("users", 2),
    ("orders", 3),
    ("products", 1),
    ("reviews", 2),
    ("inventory", 1)
]


# Run both
run_sequential(sources)
run_threaded(sources)