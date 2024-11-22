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
      
      // 페이지 번호 클릭시 해당 페이지 데이터 로드
      loadPageData(this.textContent);
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
      
      // 탭 클릭시 해당 탭의 데이터 로드
      loadTabData(tabId);
    });
  });

  // 기본 데이터 로드
  loadTabData("wishlist");
};

// 페이지 데이터 로드 함수
const loadPageData = (pageNumber) => {
  $.ajax({
    type: 'GET',
    url: '/api/mypage/page',
    data: { page: pageNumber },
    success: function(response) {
      updatePageContent(response);
    },
    error: function(request, status, error) {
      console.error('페이지 로드 실패:', error);
    }
  });
};

// 탭 데이터 로드 함수
const loadTabData = (tabId) => {
  $.ajax({
    type: 'GET',
    url: '/api/mypage/tab',
    data: { tab: tabId },
    success: function(response) {
      updateTabContent(tabId, response);
    },
    error: function(request, status, error) {
      console.error('탭 데이터 로드 실패:', error);
    }
  });
};

// 판매 상태 변경 함수
const updateSaleStatus = (productId, status) => {
  $.ajax({
    type: 'POST',
    url: '/api/mypage/update-status',
    data: {
      productId: productId,
      status: status
    },
    success: function(response) {
      // 상태 업데이트 성공 시 UI 업데이트
      updateStatusUI(productId, status);
    },
    error: function(request, status, error) {
      console.error('상태 업데이트 실패:', error);
    }
  });
};

// 항목 삭제 함수
const deleteItem = (productId) => {
  $.ajax({
    type: 'POST',
    url: '/api/mypage/delete-item',
    data: { productId: productId },
    success: function(response) {
      // 삭제 성공 시 UI에서 항목 제거
      $(`#product-${productId}`).remove();
    },
    error: function(request, status, error) {
      console.error('항목 삭제 실패:', error);
    }
  });
};

// UI 업데이트 함수들
const updatePageContent = (data) => {
  // 페이지 컨텐츠 업데이트 로직
  const contentContainer = document.querySelector('.content-container');
  contentContainer.innerHTML = data.html;
  setupEventListeners();
};

const updateTabContent = (tabId, data) => {
  // 탭 컨텐츠 업데이트 로직
  const tabContent = document.getElementById(tabId);
  tabContent.innerHTML = data.html;
  setupEventListeners();
};

const updateStatusUI = (productId, status) => {
  const button = document.querySelector(`#product-${productId} .toggle-sale-status`);
  if (status === 'completed') {
    button.textContent = '판매 완료';
    button.classList.remove('soldout');
    button.classList.add('completed');
  } else {
    button.textContent = '판매 미완';
    button.classList.remove('completed');
    button.classList.add('soldout');
  }
};

// 이벤트 리스너 설정 함수
const setupEventListeners = () => {
  // 삭제 버튼 이벤트 리스너
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.closest('.product-item').getAttribute('data-product-id');
      deleteItem(productId);
    });
  });

  // 판매 상태 토글 버튼 이벤트 리스너
  document.querySelectorAll('.toggle-sale-status').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.closest('.product-item').getAttribute('data-product-id');
      const newStatus = this.textContent === '판매 미완' ? 'completed' : 'pending';
      updateSaleStatus(productId, newStatus);
    });
  });
};

// 초기화 함수 정의
const init = () => {
  mypage();
};

// DOMContentLoaded 후 초기화
document.addEventListener("DOMContentLoaded", init);
