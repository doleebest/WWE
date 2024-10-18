import createComponent from "../core/component.js";
import Navbar from "./navbar.js";
import UserInfoBtn from "./userInfoBtn.js";
import LoginBtn from "./loginBtn.js";

export default function Header() {
  const state = {
    userName: "김기연 props",
  };

  const navbarComponent = createComponent(Navbar);
  const userInfoBtnComponent = createComponent(UserInfoBtn, {
    userName: state.userName,
  }); //임시로 props 전달
  const loginBtnComponent = createComponent(LoginBtn);

  return {
    element: `
    <header id="header">
      <div class="logo">
        <a href="/"><img src="../../static/image/logo.png" alt="WWE 로고" /></a>
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
