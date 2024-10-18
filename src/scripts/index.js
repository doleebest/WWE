import createComponent from "../core/component.js";
import App from "../App.js";

const $app = document.getElementById("app");

const appComponent = createComponent(App);

$app.innerHTML += appComponent.common.header;
$app.innerHTML += appComponent.index.main;
