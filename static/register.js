const setRegNavBar = () => {
  const regItems = document.querySelector("#navbar__menu__reg_items");
  regItems.classList.add("navbar__menu_selected");
};

const setContent = () => {
  const continentButtons = document.querySelectorAll(".continent-btn");
  const stateButtons = document.querySelectorAll(".state-btn");

  const continentInput = document.getElementById("continentInput");
  const stateInput = document.getElementById("stateInput");

  continentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 모든 버튼에서 selected 클래스 제거
      continentButtons.forEach((btn) => btn.classList.remove("selected"));

      // 클릭한 버튼에만 selected 클래스 추가
      button.classList.add("selected");

      // 선택한 대륙 값을 숨겨진 input에 넣기
      const selectedContinent = button.dataset.continent;
      continentInput.value = selectedContinent; // 숨겨진 input에 선택한 값 저장
      console.log("선택한 대륙:", selectedContinent);
    });
  });

  stateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 모든 버튼에서 selected 클래스 제거
      stateButtons.forEach((btn) => btn.classList.remove("selected"));

      // 클릭한 버튼에만 selected 클래스 추가
      button.classList.add("selected");

      // 선택한 상품 상태 값을 숨겨진 input에 넣기
      const selectedState = button.dataset.state;
      stateInput.value = selectedState; // 숨겨진 input에 선택한 값 저장
      console.log("선택한 상품 상태:", selectedState);
    });
  });
};

const init = () => {
  setNavBar = setRegNavBar; // 재정의
  setContent();
};

init();
