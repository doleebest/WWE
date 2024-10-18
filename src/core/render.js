import createComponent from "./component.js";

const render = (component, props) => {
  const $component = document.getElementById(component.name || "");

  if (!$component) {
    throw new Error(`컴포넌트 요소를 찾을 수 없습니다: ${component.name}`);
  }

  const componentInstance = createComponent(component, props);

  $component.outerHTML = componentInstance.element;
};

export default render;
