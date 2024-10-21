export default function Navbar() {
  const currentPath = window.location.pathname;
  const formattedPath = currentPath.replace(/\/src\/pages/, "");

  // 필요하면 이후 수정
  const menuItems = [
    { text: "홈", href: "/src/pages/index.html" },
    { text: "상품 등록", href: "/src/pages/register.html" },
    { text: "마이페이지", href: "/src/pages/mypage.html" },
  ];

  const menuHtml = menuItems
    .map(
      (item) => `
        <li>
          <a href="${item.href}" style="color: ${
        item.href === formattedPath ? "#00462a" : "black"
      }; text-decoration: ${
        item.href === formattedPath ? "underline" : "none"
      }">${item.text}</a>
        </li>`
    )
    .join("");

  return {
    element: `<nav class="navbar">
        <ul class="navbar__menu">
          ${menuHtml}
        </ul>
      </nav>`,
  };
}
