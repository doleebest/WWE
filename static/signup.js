// ID 관련 element
const idInput = document.getElementById("id");
const idAlert = document.getElementById("id_alert");
const duplicateCheckBtn = document.querySelector(".duplicate_check_btn");
let isDupChecked = false; // 중복 확인 여부
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
// 관심 지역 관련 element
const region = document.getElementById("region");
// 회원가입 하기 버튼
const signupBtn = document.querySelector(".signup_btn");

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
  validationFlag.id = false;
  duplicateCheckBtn.disabled = true;
  isDupChecked = false;
  if (idInput.value.length == 0) {
    idAlert.classList.add("none");
    checkAllValidation();
    return;
  }
  idAlert.classList.remove("none");
  if (regExp.id.test(idInput.value)) {
    duplicateCheckBtn.classList.remove("btn_deactivate");
    duplicateCheckBtn.classList.add("btn_activate");
    duplicateCheckBtn.disabled = false;
    idAlert.classList.add("none");
    validationFlag.id = true;
  } else {
    duplicateCheckBtn.classList.remove("btn_activate");
    duplicateCheckBtn.classList.add("btn_deactivate");
    idAlert.classList.add("alert_bad");
    idAlert.textContent =
      "아이디는 영어 소문자로 시작하는 영문, 숫자 조합으로 5~15자 이내 입력해주세요.";
  }
  checkAllValidation();
};

const checkPwValidation = () => {
  validationFlag.pw = false;
  if (pwInput.value.length == 0) {
    checkPwReValidation();
    pwAlert.classList.add("none");
    checkAllValidation();
    return;
  }
  pwAlert.classList.remove("none");

  if (pwReInput.value.length > 0) {
    checkPwReValidation();
  }

  if (regExp.pw.test(pwInput.value)) {
    pwAlert.classList.add("none");
    validationFlag.pw = true;
  } else {
    pwAlert.classList.add("alert_bad");
    pwAlert.textContent =
      "비밀번호는 영문, 숫자, 특수문자 조합으로 8자 이상 입력해주세요.";
  }
  checkAllValidation();
};

const checkPwReValidation = () => {
  validationFlag.pwRe = false;
  if (pwReInput.value.length == 0) {
    pwReAlert.classList.add("none");
    checkAllValidation();
    return;
  }
  pwReAlert.classList.remove("none");
  if (pwReInput.value === pwInput.value) {
    pwReAlert.classList.remove("alert_bad");
    pwReAlert.classList.add("alert_good");
    pwReAlert.textContent = "비밀번호가 일치합니다.";
    validationFlag.pwRe = true;
  } else {
    pwReAlert.classList.remove("alert_good");
    pwReAlert.classList.add("alert_bad");
    pwReAlert.textContent = "비밀번호가 일치하지 않습니다.";
  }
  checkAllValidation();
};

const checkEmailValidation = () => {
  validationFlag.email = false;
  if (emailInput.value.length == 0) {
    emailAlert.classList.add("none");
    checkAllValidation();
    return;
  }
  emailAlert.classList.remove("none");
  if (regExp.email.test(emailInput.value)) {
    emailAlert.classList.add("none");
    validationFlag.email = true;
  } else {
    emailAlert.classList.add("alert_bad");
    emailAlert.textContent = "이메일 형식을 지켜서 입력해주세요.";
  }
  checkAllValidation();
};

const checkPhoneValidation = () => {
  if (phoneInput.value.length == 0) {
    phoneAlert.classList.add("none");
    validationFlag.phone = true; // 휴대전화는 optional이므로
    checkAllValidation();
    return;
  }
  validationFlag.phone = false;
  phoneAlert.classList.remove("none");
  if (regExp.phone.test(phoneInput.value)) {
    phoneAlert.classList.add("none");
    validationFlag.phone = true;
  } else {
    phoneAlert.classList.add("alert_bad");
    phoneAlert.textContent = "'010-XXXX-XXXX' 형식으로 입력해주세요.";
  }
  checkAllValidation();
};

const checkAllValidation = () => {
  const allValid = Object.values(validationFlag).every((flag) => flag);

  if (allValid) {
    signupBtn.classList.remove("btn_deactivate");
    signupBtn.classList.add("signup_btn_activate");
    signupBtn.disabled = false;
  } else {
    signupBtn.classList.remove("signup_btn_activate");
    signupBtn.classList.add("btn_deactivate");
    signupBtn.disabled = true;
  }
};

idInput.addEventListener("input", checkIdValidation);
pwInput.addEventListener("input", checkPwValidation);
pwReInput.addEventListener("input", checkPwReValidation);
emailInput.addEventListener("input", checkEmailValidation);
phoneInput.addEventListener("input", checkPhoneValidation);

const postIdDuplicate = async () => {
  const userId = idInput.value.trim();
  try {
    const response = await fetch("/check_id_duplicate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId }),
    });

    const result = await response.json();

    if (result.success) {
      isDupChecked = true;
      idAlert.classList.remove("none");
      idAlert.classList.remove("alert_bad");
      idAlert.classList.add("alert_good");
      idAlert.textContent = "사용 가능한 아이디입니다.";
    } else {
      isDupChecked = false;
      idAlert.classList.remove("none");
      idAlert.classList.remove("alert_good");
      idAlert.classList.add("alert_bad");
      idAlert.textContent = "이미 사용 중인 아이디입니다.";
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const submitForm = () => {
  if (!isDupChecked) {
    idInput.focus();
    idAlert.classList.remove("none");
    idAlert.classList.remove("alert_good");
    idAlert.classList.add("alert_bad");
    idAlert.textContent = "아이디 중복 확인을 해주세요.";
    return;
  }
  document.querySelector(".signup_form").submit();
};

duplicateCheckBtn.addEventListener("click", (e) => {
  e.preventDefault();
  postIdDuplicate();
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  submitForm();
});
