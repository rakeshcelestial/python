// Import only what we need (tree-shaking)
import { validateEmail } from "./utils/index.js";

import ApiService from "./services/api.js";
import StorageService from "./services/storage.js";

const api = new ApiService("https://jsonplaceholder.typicode.com");
const storage = new StorageService();

// Example usage
console.log("Valid Email:", validateEmail("test@mail.com"));

// Button for dynamic modal
const btn = document.createElement("button");
btn.textContent = "Open Modal";
document.body.appendChild(btn);

btn.addEventListener("click", async () => {
  const module = await import("./components/modal.js");
  const Modal = module.default;

  const modal = new Modal();
  modal.show();
});

// API call example
api.get("/posts/1").then(data => console.log("Post:", data));

// Storage example
storage.set("user", { name: "Rakesh" });
console.log(storage.get("user"));