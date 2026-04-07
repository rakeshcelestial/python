import axios from "axios";

class ApiService {
  constructor(baseURL) {
    this.token = null;

    // Create axios instance
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // -------- REQUEST INTERCEPTOR --------
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        console.log(`${config.method.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // -------- RESPONSE INTERCEPTOR --------
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { config, response } = error;

        // Retry logic for 5xx errors
        if (response && response.status >= 500) {
          config.__retryCount = config.__retryCount || 0;

          if (config.__retryCount < 2) {
            config.__retryCount++;
            console.warn(`Retrying request (${config.__retryCount})...`);
            return this.api(config);
          }
        }

        // Handle specific errors
        if (response) {
          const status = response.status;

          if (status === 401) {
            console.warn("Unauthorized — redirect to login");
          } else if (status === 404) {
            console.warn("Resource not found");
          } else if (status >= 500) {
            console.warn("Server error — please try again later");
          }

          // Throw enriched error
          return Promise.reject({
            message: response.data?.message || "Request failed",
            status,
            originalError: error,
          });
        }

        // Network or unknown error
        return Promise.reject({
          message: error.message,
          status: null,
          originalError: error,
        });
      }
    );
  }

  // -------- SET TOKEN --------
  setAuthToken(token) {
    this.token = token;
  }

  // -------- METHODS --------
  async get(url, params = {}) {
    const res = await this.api.get(url, { params });
    return { data: res.data, status: res.status };
  }

  async post(url, data) {
    const res = await this.api.post(url, data);
    return { data: res.data, status: res.status };
  }

  async put(url, data) {
    const res = await this.api.put(url, data);
    return { data: res.data, status: res.status };
  }

  async delete(url) {
    const res = await this.api.delete(url);
    return { data: res.data, status: res.status };
  }
}

// -------- USAGE --------
(async () => {
  const api = new ApiService("https://jsonplaceholder.typicode.com");

  api.setAuthToken("my-jwt-token-123");

  try {
    const posts = await api.get("/posts", { _limit: 5 });
    console.log("GET:", posts);

    const newPost = await api.post("/posts", {
      title: "Hello",
      body: "World",
      userId: 1,
    });
    console.log("POST:", newPost);

    const updated = await api.put("/posts/1", {
      title: "Updated",
    });
    console.log("PUT:", updated);

    const deleted = await api.delete("/posts/1");
    console.log("DELETE:", deleted);

  } catch (err) {
    console.error("Error:", err);
  }
})();