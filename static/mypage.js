const setMypageNavBar = () => {
  const regItems = document.querySelector("#navbar__menu__mypage");
  regItems.classList.add("navbar__menu_selected");
};

const init = () => {
  setNavBar = setMypageNavBar; // 재정의
};

init();
