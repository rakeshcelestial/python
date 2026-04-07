export default class Modal {
  constructor() {
    this.el = document.createElement("div");
    this.el.textContent = "Hello from Modal!";
    this.el.style.background = "#eee";
    this.el.style.padding = "20px";
  }

  show() {
    document.body.appendChild(this.el);
  }
}