const idInput = document.getElementById("id");
const idAlert = document.getElementById("id_alert");
const duplicateCheckBtn = document.querySelector(".duplicate_check_btn");

const regExp = {
  id: /^[a-z](?=.*[0-9])[a-zA-Z0-9]{4,14}$/,
  pw: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  email: /^[A-Za-z-0-9\-\.]+@[A-Ja-z-0-9\-\.]+\.[A-Ja-z-0-9]+$/,
  phone: /^\d{3}-\d{3,4}-\d{4}$/,
};

const validationFlag = {
  id: false,
  pw: false,
  pwRe: false,
  email: false,
  phone: true,
  region: true,
};

const checkIdValidation = () => {
  idAlert.classList.remove("none");
  if (regExp.id.test(idInput.value)) {
    duplicateCheckBtn.classList.remove("btn_deactivate");
    duplicateCheckBtn.classList.add("btn_activate");
    idAlert.classList.add("none");
  } else {
    duplicateCheckBtn.classList.remove("btn_activate");
    duplicateCheckBtn.classList.add("btn_deactivate");
    idAlert.classList.add("alert_bad");
    idAlert.textContent =
      "아이디는 영어와 숫자로 구성된 5~15자로, 영어 소문자로 시작하고 숫자를 1개 이상 포함해야 합니다.";
  }
};

idInput.addEventListener("input", checkIdValidation);

/* TODO
0. 아이디 중복 체크 API 연결
   - 프론트에서도 중복 체크 여부 저장하는 변수 생성 필요
   - 중복 체크를 했더라도 id input란에 변경이 생기면 다시 중복 체크 여부 저장하는 변수 false
1. validationFlag가 모두 true가 되었을 때만 회원가입 하기 버튼 활성화
   - 중복 체크 여부와 상관없이 우선 id input이 validate 한지만 판단
   - 휴대전화와 관심 지역은 값을 입력했을 경우에만 flag를 false로 바꾸고 validation 체크
2. 회원가입 하기 버튼 활성화 클릭 시 post 하기 전 체크해야 할 것
   - 아이디 중복 체크 여부 확인
   - 관심 지역 선택 안했을 경우 null 등으로 값 변경해서 백엔드에 넘기기 
   - post 실패 원인으로 input focus해주기, input 아래에는 메세지 띄워줌
*/
