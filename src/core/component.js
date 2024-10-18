export let currentComponent = null;

const bindEventsAfterRender = (componentInstance, componentId) => {
  requestAnimationFrame(() => {
    if (!document.getElementById(componentId) || !componentInstance.bindEvents)
      return;

    componentInstance.bindEvents();
  });
};

export default function createComponent(component, props) {
  const previousComponent = currentComponent;

  currentComponent = { id: component.name, stateIndex: 0, component, props };

  const componentInstance = component(props);

  const namedComponent = `<div id="${component.name}">${componentInstance.element}</div>`;

  componentInstance.element = namedComponent;

  bindEventsAfterRender(componentInstance, component.name);
  currentComponent = previousComponent;

  return componentInstance;
}
