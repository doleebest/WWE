import createComponent from "../core/component.js";
import Navbar from "./navbar.js";

export default function Header() {
  const navbarComponent = createComponent(Navbar);

  return {
    element: `<header id="header">
      <div class="logo">
        <a href="/"><img src="../../static/image/logo.png" alt="WWE 로고" /></a>
      </div>
      ${navbarComponent.element}
      <div class="user">
        <div class="user__info">
          <!-- 유저 프로필 및 아이디 컴포넌트 -->
        </div>
        <button class="login">
          <!-- 로그인/로그아웃 버튼 -->
        </button>
      </div>
    </header>
  `,
  };
}
