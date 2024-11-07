// 더미데이터. 백엔드 연결
const data = [
  {
    id: 1,
    image: "desk1.png",
    region: "미국",
    state: "새상품",
    how: "택배거래",
    title: "상태 좋은 책상 팝니다",
  },
  {
    id: 2,
    image: "desk2.png",
    region: "미국",
    state: "중고물품",
    how: "직거래",
    title: "책상 판매합니다",
  },
  {
    id: 3,
    image: "desk1.png",
    region: "중국",
    state: "중고물품",
    how: "택배거래",
    title: "테스트 제목입니다",
  },
  {
    id: 4,
    image: "desk1.png",
    region: "미국",
    state: "새상품",
    how: "택배거래",
    title: "제목입니다제목입니다제목입니다제목입니다제목입니다",
  },
  {
    id: 5,
    image: "desk1.png",
    region: "미국",
    state: "새상품",
    how: "택배거래",
    title: "상태 좋은 책상 팝니다",
  },
  {
    id: 6,
    image: "desk1.png",
    region: "미국",
    state: "새상품",
    how: "택배거래",
    title: "상태 좋은 책상 팝니다",
  },
  {
    id: 7,
    image: "desk1.png",
    region: "미국",
    state: "새상품",
    how: "택배거래",
    title: "상태 좋은 책상 팝니다",
  },
  {
    id: 8,
    image: "desk1.png",
    region: "미국",
    state: "새상품",
    how: "택배거래",
    title: "상태 좋은 책상 팝니다",
  },
  {
    id: 9,
    image: "desk1.png",
    region: "미국",
    state: "새상품",
    how: "택배거래",
    title: "상태 좋은 책상 팝니다",
  },
  {
    id: 10,
    image: "desk1.png",
    region: "미국",
    state: "새상품",
    how: "택배거래",
    title: "상태 좋은 책상 팝니다",
  },
  {
    id: 11,
    image: "desk1.png",
    region: "미국",
    state: "새상품",
    how: "택배거래",
    title: "상태 좋은 책상 팝니다",
  },
  {
    id: 12,
    image: "desk1.png",
    region: "미국",
    state: "새상품",
    how: "택배거래",
    title: "상태 좋은 책상 팝니다",
  },
];

const setHomeNavBar = () => {
  const home = document.querySelector("#navbar__menu__home");
  home.classList.add("navbar__menu_selected");
};

const setItemsList = () => {
  const wholeItems = document.querySelector(".whole_items");

  // 백엔드 연결
  data.forEach((element) => {
    const div = document.createElement("div");
    div.classList.add("item_container");

    // 이미지
    const img = document.createElement("img");
    img.src = `../static/images/${element.image}`;
    img.alt = element.title;
    div.appendChild(img);

    // 지역
    const region = document.createElement("div");
    region.classList.add("region_container");
    const pinIcon = document.createElement("img");
    pinIcon.src = `../static/images/pin.svg`;
    const regionName = document.createElement("span");
    regionName.textContent = element.region;
    region.append(pinIcon, regionName);
    div.appendChild(region);

    // 태그
    const tag = document.createElement("div");
    tag.classList.add("tag_container");
    const state = document.createElement("span");
    state.textContent = "# " + element.state;
    const how = document.createElement("span");
    how.textContent = "# " + element.how;
    tag.append(state, how);
    div.appendChild(tag);

    // 제목
    const title = document.createElement("span");
    title.classList.add("title");
    title.textContent = element.title;
    div.appendChild(title);

    wholeItems.appendChild(div);
  });
};

const init = () => {
  setNavBar = setHomeNavBar; // 재정의
  setItemsList();
};

init();
