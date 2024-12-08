const setSoldOutBtnUI = (btn, isSoldOut) => {
  if (isSoldOut) {
    btn.textContent = "판매 재개";
    btn.classList.remove("completed");
    btn.classList.add("soldout");
  } else {
    btn.textContent = "판매 완료";
    btn.classList.remove("soldout");
    btn.classList.add("completed");
  }
};

const initSalesData = () => {
  document.querySelectorAll(".toggle-sale-status").forEach((button) => {
    const isSoldOut = button.getAttribute("data-buyer-id") ? true : false;
    setSoldOutBtnUI(button, isSoldOut);
  });
};

// mypage 함수 정의
const mypage = () => {
  // 네비게이션 바 설정
  const mypageNavBar = document.querySelector("#navbar__menu__mypage");
  mypageNavBar.classList.add("navbar__menu_selected");

  // 페이지 번호 활성화 설정
  const pageNumbers = document.querySelectorAll(".page-number");
  pageNumbers.forEach((page) => {
    page.addEventListener("click", function () {
      pageNumbers.forEach((p) => p.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Tab 메뉴 설정
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((content) => (content.style.display = "none"));

      this.classList.add("active");
      const tabId = this.getAttribute("onclick").split("'")[1];
      document.getElementById(tabId).style.display = "block";

      if (tabId === "sales-history") initSalesData();
    });
  });
};

// 이벤트 리스너 설정 함수
const setupEventListeners = () => {
  // 삭제 버튼 이벤트 리스너
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productId =
        this.closest(".product-item").getAttribute("data-product-id");
      //deleteItem(productId);
    });
  });
};

const clickSaleStatus = (btn, productName, buyerId) => {
  const isSoldOut = buyerId ? true : false;
  if (!isSoldOut) {
    const buyer = prompt("구매자의 아이디를 입력해주세요.");
    if (!buyer || !buyer.trim()) {
      return;
    }

    fetch("/mark_as_sold", {
      method: "POST",
      body: JSON.stringify({ product_id: productName, buyer_id: buyer }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response.json());
    });

    setSoldOutBtnUI(btn, true);
  } else {
    fetch("/mark_as_unsold", {
      method: "POST",
      body: JSON.stringify({ product_id: productName }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.redirected) {
        window.location.href = response.url; // 리다이렉트
      }
    });

    setSoldOutBtnUI(btn, false);
  }
};

// 초기화 함수 정의
const init = () => {
  mypage();
};

// DOMContentLoaded 후 초기화
document.addEventListener("DOMContentLoaded", init);

// Define the showTab function if needed
const showTab = (tabId) => {
  // Logic to show the specified tab
  console.log(`Showing tab: ${tabId}`);
  // You can add your tab display logic here
};
