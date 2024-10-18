export default function createComponent(component, props) {
  const componentInstance = component(props);

  return componentInstance;
}
