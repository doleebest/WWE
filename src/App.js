import NavBar from "./components/navBar.js";
import createComponent from "./core/component.js";

export default function App() {
  const navBarComponent = createComponent(NavBar);

  return {
    element: `${navBarComponent.element}`,
  };
}
