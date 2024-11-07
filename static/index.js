const setHomeNavBar = () => {
  const home = document.querySelector("#navbar__menu__home");
  home.classList.add("navbar__menu_selected");
};

const init = () => {
  setNavBar = setHomeNavBar; // 재정의
};

init();
