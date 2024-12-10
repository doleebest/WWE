const setSoldOutBtnUI = (btn, isSoldOut) => {
  if (isSoldOut) {
    btn.textContent = "판매 재개하기";
    btn.classList.remove("completed");
    btn.classList.add("soldout");
  } else {
    btn.textContent = "판매 완료하기";
    btn.classList.remove("soldout");
    btn.classList.add("completed");
  }
};

const initSalesData = async () => {
  const buttons = document.querySelectorAll(".toggle-sale-status");
  for (const button of buttons) {
    const productName = button.getAttribute("data-product-name");
    try {
      const buyerId = await getBuyerId(productName);
      const isSoldOut = buyerId ? true : false;
      console.log(`${productName}의 구매자는 ${buyerId}`);
      setSoldOutBtnUI(button, isSoldOut);
    } catch (error) {
      console.error(`${productName}의 구매자 정보 로드 중 오류:`, error);
    }
  }
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

// deleteItem 함수 정의
function deleteItem(button) {
  // 상품 ID를 포함하고 있는 부모 요소 찾기
  const productItem = button.closest(".product-item");
  const productId = productItem.getAttribute("data-product-id");

  // 백엔드 DELETE 엔드포인트로 요청 보내기 (예: /delete/<product_id>)
  fetch(`/delete/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("삭제에 실패했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      // 성공 메시지 처리 (옵션)
      console.log(data.message);
      // DOM에서 해당 상품 요소 제거
      productItem.remove();
    })
    .catch((error) => {
      console.error("에러:", error);
      alert("상품 삭제 중 오류가 발생했습니다.");
    });
}


const getBuyerId = async (productName) => {
  try {
    const response = await fetch(`/returnId/${productName}`);
    if (!response.ok) {
      throw new Error("네트워크 에러");
    }
    const data = await response.json();
    if (data.buyerId) {
      return data.buyerId;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const clickSaleStatus = async (btn, productName) => {
  const buyerId = await getBuyerId(productName);
  const isSoldOut = buyerId ? true : false;

  if (!isSoldOut) {
    const buyer = prompt("구매자의 아이디를 입력해주세요.");
    if (!buyer || !buyer.trim()) {
      return;
    }

    try {
      const response = await fetch("/mark_as_sold", {
        method: "POST",
        body: JSON.stringify({ product_id: productName, buyer_id: buyer }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSoldOutBtnUI(btn, true);
        console.log("판매 완료 처리 성공");
      }
    } catch (error) {
      console.error("판매 완료 처리 중 에러:", error);
    }
  } else {
    try {
      const response = await fetch("/mark_as_unsold", {
        method: "POST",
        body: JSON.stringify({ product_id: productName }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSoldOutBtnUI(btn, false);
        console.log("판매 재개 처리 성공");
      }
    } catch (error) {
      console.error("판매 재개 처리 중 에러:", error);
    }
  }
};

function deleteItem(button) {
  // 버튼의 부모 요소 중 product-container를 찾음
  const productContainer = button.closest('.product-container');
  
  if (productContainer) {
    // 삭제 확인 메시지
    if (confirm('정말로 삭제하시겠습니까?')) {
      productContainer.remove(); // 해당 항목 삭제
      console.log('Product deleted');
    }
  } else {
    console.error('Product container not found');
  }
}

// 초기화 함수 정의
const init = () => {
  mypage();
};

// DOMContentLoaded 후 초기화
document.addEventListener("DOMContentLoaded", init);

const showTab = (tabId) => {
  console.log(`Showing tab: ${tabId}`);
};
