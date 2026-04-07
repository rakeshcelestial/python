export default class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    const res = await fetch(this.baseURL + endpoint);
    if (!res.ok) throw new Error("API Error");
    return res.json();
  }
}