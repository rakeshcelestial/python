import threading

class Counter:
    def __init__(self):
        self.value = 0


def increment_with_lock(counter, lock):
    for _ in range(1000):
        with lock:   # critical section
            counter.value += 1


def run_with_lock():
    counter = Counter()
    lock = threading.Lock()
    threads = []

    for _ in range(10):
        t = threading.Thread(target=increment_with_lock, args=(counter, lock))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    print("With lock:", counter.value)


run_with_lock()