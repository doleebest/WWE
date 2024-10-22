import useState from "../core/hooks/useState.js";

export default function UserInfoBtn() {
  const [userName, setUserName] = useState("김기연");

  const clickUserInfo = () => {
    setUserName("렌더링 테스트"); // 임시 코드. 실제로는 마이페이지 이동
  };

  const bindEvents = () => {
    const userInfo = document.querySelector(".user__info");

    userInfo.addEventListener("click", clickUserInfo);
  };

  return {
    element: `
    <button class="user__info">
          <img
            class="user__info__profile"
            src="src/image/temp_user_profile.png"
          />
          <span>${userName}</span>
        </button>
        `,
    bindEvents,
  };
}
