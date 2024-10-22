import createComponent from "../core/component.js";
import Navbar from "./navbar.js";
import UserInfoBtn from "./userInfoBtn.js";
import LoginBtn from "./loginBtn.js";

export default function Header() {
  const navbarComponent = createComponent(Navbar);
  const userInfoBtnComponent = createComponent(UserInfoBtn);
  const loginBtnComponent = createComponent(LoginBtn);

  return {
    element: `
    <header id="header">
      <div class="logo">
        <a href="/"><img src="src/image/logo.png" alt="WWE 로고" /></a>
      </div>
      ${navbarComponent.element}
      <div class="user">
      ${userInfoBtnComponent.element}
      ${loginBtnComponent.element}
      </div>
    </header>
  `,
  };
}
