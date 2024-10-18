import createComponent from "../core/component.js";
import App from "../App.js";

const render = () => {
  const $app = document.getElementById("app");

  const appComponent = createComponent(App);

  $app.innerHTML += appComponent.common.header;
  $app.innerHTML += appComponent.mypage.main;
};

render();
