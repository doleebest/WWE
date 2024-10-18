import createComponent from "./core/component.js";
import Header from "./components/header.js";

export default function App() {
  const headerComponent = createComponent(Header);

  return {
    common: {
      header: `${headerComponent.element}`,
    },
    index: {
      main: `<span>홈 화면입니다.</span>`,
    },
    regItems: {
      main: `<span>상품등록 화면입니다.</span>`,
    },
    mypage: {
      main: `<span>마이페이지 화면입니다.</span>`,
    },
  };
}
