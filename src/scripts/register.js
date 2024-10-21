import createComponent from "../core/component.js";
import App from "../App.js";

const render = () => {
  document.addEventListener(
    "DOMContentLoaded",
    function () {
      const $app = document.getElementById("app");

      const appComponent = createComponent(App);

      $app.innerHTML += appComponent.common.header;
      // $app.innerHTML += appComponent.regItems.main;

      const continentButtons = document.querySelectorAll(".continent-btn");
      const stateButtons = document.querySelectorAll(".state-btn");

      console.log(continentButtons);
      continentButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // 모든 버튼에서 selected 클래스 제거
          continentButtons.forEach((btn) => btn.classList.remove("selected"));

          // 클릭한 버튼에만 selected 클래스 추가
          button.classList.add("selected");

          // 선택한 대륙 값 가져오기
          const selectedContinent = button.dataset.continent;
          console.log("선택한 대륙:", selectedContinent);
        });
      });

      stateButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // 모든 버튼에서 selected 클래스 제거
          stateButtons.forEach((btn) => btn.classList.remove("selected"));

          // 클릭한 버튼에만 selected 클래스 추가
          button.classList.add("selected");

          // 선택한 상품 상태 값 가져오기
          const selectedState = button.dataset.state;
          console.log("선택한 상품 상태:", selectedState);
        });
      });

      document
        .getElementById("productForm")
        .addEventListener("submit", function (event) {
          //event.preventDefault(); // 기본 form 제출을 막음

          const sellerId = document.getElementById("sellerId").value;
          const contact = document.getElementById("contact").value;
          const productName = document.getElementById("productName").value;
          const price = document.getElementById("price").value;
          const nation = document.getElementById("nation").value;
          const address = document.getElementById("address").value;
          const description = document.getElementById("description").value;
          const stateButton = document.querySelector(".state-btn.selected");
          const continentButton = document.querySelector(
            ".continent-btn.selected"
          );

          // 입력값을 확인하고, 서버로 전송하는 코드가 여기에 추가될 수 있음
          console.log("=== 입력값 확인 ===");
          console.log("판매자 ID:", sellerId);
          console.log("판매자 연락처:", contact);
          console.log("제품명:", productName);
          console.log("가격:", price);
          console.log("국가:", nation);
          console.log("상세주소:", address);
          console.log("설명:", description);
          console.log("상품 상태:", stateButton.dataset.state);
          console.log("대륙:", continentButton.dataset.continent);

          // 폼 초기화
          document.getElementById("productForm").reset();
          stateButton.classList.remove("selected");
          continentButton.classList.remove("selected");

          // 알림 메시지
          alert("상품이 성공적으로 등록되었습니다!");
        });
    },
    false
  );
};

render();
