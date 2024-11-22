// ID 관련 element
const idInput = document.getElementById("id");
const idAlert = document.getElementById("id_alert");
const duplicateCheckBtn = document.querySelector(".duplicate_check_btn");
// PW 관련 element
const pwInput = document.getElementById("pw");
const pwAlert = document.getElementById("pw_alert");
// PW 재확인 관련 element
const pwReInput = document.getElementById("pw_check");
const pwReAlert = document.getElementById("pw_check_alert");
// 이메일 관련 element
const emailInput = document.getElementById("email");
const emailAlert = document.getElementById("email_alert");
// 휴대전화 관련 element
const phoneInput = document.getElementById("phone");
const phoneAlert = document.getElementById("phone_alert");

// 정규식
const regExp = {
  id: /^[a-z](?=.*[0-9])[a-zA-Z0-9]{4,14}$/,
  pw: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  email: /^[A-Za-z-0-9\-\.]+@[A-Ja-z-0-9\-\.]+\.[A-Ja-z-0-9]+$/,
  phone: /^\d{3}-\d{3,4}-\d{4}$/,
};

// input별 유효성 검사 여부
const validationFlag = {
  id: false,
  pw: false,
  pwRe: false,
  email: false,
  phone: true,
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
      "아이디는 영어 소문자로 시작하는 영문, 숫자 조합으로 5~15자 이내 입력해주세요.";
  }
};

const checkPwValidation = () => {
  pwAlert.classList.remove("none");
  if (pwReInput.value.length > 0) {
    checkPwReValidation();
  }

  if (regExp.pw.test(pwInput.value)) {
    pwAlert.classList.add("none");
  } else {
    pwAlert.classList.add("alert_bad");
    pwAlert.textContent =
      "비밀번호는 영문, 숫자, 특수문자 조합으로 8자 이상 입력해주세요.";
  }
};

const checkPwReValidation = () => {
  pwReAlert.classList.remove("none");
  if (pwReInput.value === pwInput.value) {
    pwReAlert.classList.remove("alert_bad");
    pwReAlert.classList.add("alert_good");
    pwReAlert.textContent = "비밀번호가 일치합니다.";
  } else {
    pwReAlert.classList.remove("alert_good");
    pwReAlert.classList.add("alert_bad");
    pwReAlert.textContent = "비밀번호가 일치하지 않습니다.";
  }
};

const checkEmailValidation = () => {
  emailAlert.classList.remove("none");
  if (regExp.email.test(emailInput.value)) {
    emailAlert.classList.add("none");
  } else {
    emailAlert.classList.add("alert_bad");
    emailAlert.textContent = "이메일 형식을 지켜서 입력해주세요.";
  }
};

const checkPhoneValidation = () => {
  phoneAlert.classList.remove("none");
  if (regExp.phone.test(phoneInput.value)) {
    phoneAlert.classList.add("none");
  } else {
    phoneAlert.classList.add("alert_bad");
    phoneAlert.textContent = "010-XXXX-XXXX 형식으로 입력해주세요.";
  }
};

idInput.addEventListener("input", checkIdValidation);
pwInput.addEventListener("input", checkPwValidation);
pwReInput.addEventListener("input", checkPwReValidation);
emailInput.addEventListener("input", checkEmailValidation);
phoneInput.addEventListener("input", checkPhoneValidation);

/* TODO
0. 아이디 중복 체크 API 연결
   - 프론트에서도 중복 체크 여부 저장하는 변수 생성 필요
   - 중복 체크를 했더라도 id input란에 변경이 생기면 다시 중복 체크 여부 저장하는 변수 false
   - 중복 체크 true가 되었다면 중복 확인 버튼은 비활성화
1. validationFlag가 모두 true가 되었을 때만 회원가입 하기 버튼 활성화
   - 중복 체크 여부와 상관없이 우선 id input이 validate 한지만 판단
   - 휴대전화와 관심 지역은 값을 입력했을 경우에만 flag를 false로 바꾸고 validation 체크
2. 회원가입 하기 버튼 활성화 클릭 시 post 하기 전 체크해야 할 것
   - 아이디 중복 체크 여부 확인
   - 관심 지역 선택 안했을 경우 null 등으로 값 변경해서 백엔드에 넘기기 
   - post 실패 원인으로 input focus해주기, input 아래에는 메세지 띄워줌
*/
