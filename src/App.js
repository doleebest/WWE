import createComponent from "./core/component.js";
import Header from "./components/header.js";

export default function App() {
  const headerComponent = createComponent(Header);

  return {
    common: {
      header: `${headerComponent.element}`,
    },
    index: {
      main: `<span>메인입니다</span>`,
    },
    regItems: {},
  };
}
