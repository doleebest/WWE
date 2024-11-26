function toggleLike() {
  const likeBtn = document.querySelector("#heart");
  likeBtn.classList.toggle("clicked");
}

function showHeart() {
  $.ajax({
    type: "GET",
    url: "/show_heart/{{name}}/",
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
      alert("show heart!");
    },
  });
}

function like() {
  $.ajax({
    type: "POST",
    url: "/like/{{name}}/",
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
  $.ajax({
    type: "POST",
    url: "/unlike/{{name}}/",
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
