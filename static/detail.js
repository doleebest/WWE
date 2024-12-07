<<<<<<< HEAD
function getNameFromPath() {
  const path = window.location.pathname; // "/detail/그립톡"
  const parts = path.split("/"); // ["", "detail", "그립톡"]
  return parts[2]; // "그립톡"
}

function showHeart() {
  const name = getNameFromPath();
  $.ajax({
    type: "GET",
    url: `/show_heart/${name}/`,
    data: {},
    success: function (response) {
      let my_heart = response["my_heart"];
      if (my_heart["interested"] == "Y") {
        const likeBtn = document.querySelector("#heart");
        likeBtn.classList.add("clicked");
        $("#heart").attr("onclick", "unlike()");
      } else {
        const likeBtn = document.querySelector("#heart");
        likeBtn.classList.remove("clicked");
        $("#heart").attr("onclick", "like()");
      }
    },
  });
}

function like() {
  const name = getNameFromPath();
  $.ajax({
    type: "POST",
    url: `/like/${name}/`,
    data: {
      interested: "Y",
    },
    success: function (response) {
      alert(response["msg"]);
      window.location.reload();
    },
  });
}

function unlike() {
  const name = getNameFromPath();
  $.ajax({
    type: "POST",
    url: `/unlike/${name}/`,
    data: {
      interested: "N",
    },
    success: function (response) {
      alert(response["msg"]);
      window.location.reload();
    },
  });
}

$(document).ready(function () {
  showHeart();
});

function showContact(contact) {
  alert(`판매자의 연락처: ${contact}`);
=======
function toggleLike() {
  const likeBtn = document.querySelector(".like-btn");
  likeBtn.classList.toggle("clicked");
>>>>>>> d97eb73 (상품 상세 페이지 화면 구현)
}
