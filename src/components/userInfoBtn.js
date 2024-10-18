export default function UserInfoBtn({ userName }) {
  return {
    element: `
    <button class="user__info">
          <img
            class="user__info__profile"
            src="../../static/image/temp_user_profile.png"
          />
          <span>${userName}</span>
        </button>
        `,
  };
}
