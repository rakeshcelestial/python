import time
import asyncio


#  Synchronous version
def fetch_sync(url, delay):
    print(f"[START] {url} at {time.strftime('%X')}")
    time.sleep(delay)
    print(f"[END]   {url} at {time.strftime('%X')}")


def run_sync(urls):
    start = time.time()

    for url, delay in urls:
        fetch_sync(url, delay)

    end = time.time()
    print(f"\nSync time: {round(end - start, 2)}s\n")


#  Async version
async def fetch(url, delay):
    print(f"[START] {url} at {time.strftime('%X')}")
    await asyncio.sleep(delay)   # non-blocking wait
    print(f"[END]   {url} at {time.strftime('%X')}")


async def run_async(urls):
    start = time.time()

    tasks = [fetch(url, delay) for url, delay in urls]
    await asyncio.gather(*tasks)   # run concurrently

    end = time.time()
    print(f"\nAsync time: {round(end - start, 2)}s\n")


# Input
urls = [
    ("api/users", 2),
    ("api/orders", 3),
    ("api/products", 1),
    ("api/reviews", 2)
]


# Run both
run_sync(urls)

asyncio.run(run_async(urls))