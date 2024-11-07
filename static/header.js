const isLogin = false; // 백엔드 연결
const userName = "김기연"; // 백엔드 연결

// 페이지별로 정의될 함수
let setNavBar = () => {};

const clickUserInfo = () => {
  window.location.href = "/mypage";
};

const setUserInfo = (user) => {
  const button = document.createElement("button");
  button.addEventListener("click", clickUserInfo);
  button.textContent = userName;
  user.appendChild(button);
};

const clickLogout = () => {
  console.log("로그아웃"); // 백엔드 연결
};

const clickSignup = () => {
  window.location.href = "/signup";
};

const setLogin = (user) => {
  const button = document.createElement("button");
  if (isLogin) {
    button.addEventListener("click", clickLogout);
    button.textContent = "로그아웃"; // 백엔드 연결
  } else {
    button.addEventListener("click", clickSignup);
    button.textContent = "회원가입";
  }
  user.appendChild(button);
};

const clickLogin = () => {
  window.location.href = "/login";
};

const setUser = () => {
  const user = document.querySelector(".user");

  // 왼쪽
  if (isLogin) {
    setUserInfo(user);
  } else {
    const button = document.createElement("button");
    button.addEventListener("click", clickLogin);
    button.textContent = "로그인";
    user.appendChild(button);
  }

  // 가운데 라인
  const span = document.createElement("span");
  span.textContent = "|";
  span.style.fontSize = "15px";
  span.style.lineHeight = "2";
  user.appendChild(span);

  // 오른쪽
  setLogin(user);
};

const initHeader = () => {
  setNavBar();
  setUser();
};

document.addEventListener("DOMContentLoaded", initHeader);
