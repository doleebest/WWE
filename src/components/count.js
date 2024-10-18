import useState from "../core/hooks/useState.js";

function Count() {
  const [count, setCount] = useState(0);

  const bindEvents = () => {
    const addCount = document.querySelector(".add-count");

    addCount.addEventListener("click", () => {
      setCount(count + 1);
    });
  };

  return {
    element: `
      <div>count: ${count}</div>
      <button class="add-count">더하기</button>
    `,
    bindEvents,
  };
}

export default Count;
