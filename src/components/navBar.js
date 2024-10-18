export default function NavBar() {
  return {
    element: `<nav class="navbar">
    <div class="navbar__logo">
      <a href="/"><img src="../static/image/logo.png" alt="WWE 로고" /></a>
    </div>
    <ul class="navbar__menu">
      <li><a href="/">홈</a></li>
      <li><a href="/reg_items">상품 등록</a></li>
      <li><a href="/mypage">마이페이지</a></li>
    </ul>
  </nav>`,
  };
}
