import createComponent from "./core/component.js";
import Header from "./components/header.js";
import Count from "./components/count.js";

export default function App() {
  const countComponent = createComponent(Count);
  const headerComponent = createComponent(Header);

  return {
    common: {
      header: `${headerComponent.element}`,
    },
    index: {
      main: `${countComponent.element}</span>`,
    },
    regItems: {
      main: `<span>상품등록 화면입니다.</span>`,
    },
    mypage: {
      main: `<span>마이페이지 화면입니다.</span>`,
    },
  };
}
