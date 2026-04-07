// -------- BASE URL --------
const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

// -------- FETCH WITH TIMEOUT --------
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    console.log(
      `${options.method || "GET"} ${url} → Status: ${response.status}`
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, data: null, error: error.message };
  } finally {
    clearTimeout(id);
  }
}

// -------- GET ALL POSTS --------
async function getAllPosts(limit) {
  const url = limit ? `${BASE_URL}?_limit=${limit}` : BASE_URL;
  return await fetchWithTimeout(url);
}

// -------- GET SINGLE POST --------
async function getPost(id) {
  return await fetchWithTimeout(`${BASE_URL}/${id}`);
}

// -------- CREATE POST --------
async function createPost(data) {
  return await fetchWithTimeout(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// -------- UPDATE POST --------
async function updatePost(id, data) {
  return await fetchWithTimeout(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// -------- DELETE POST --------
async function deletePost(id) {
  return await fetchWithTimeout(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}

// -------- TEST CALLS --------
(async () => {
  console.log("GET ALL:", await getAllPosts(5));
  console.log("GET ONE:", await getPost(1));

  console.log(
    "CREATE:",
    await createPost({
      title: "New Post",
      body: "This is a test",
      userId: 1,
    })
  );

  console.log(
    "UPDATE:",
    await updatePost(1, {
      title: "Updated Title",
      body: "Updated body",
    })
  );

  console.log("DELETE:", await deletePost(1));
})();