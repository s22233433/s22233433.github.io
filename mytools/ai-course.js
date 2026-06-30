document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".prompt").forEach((block, index) => {
    if (block.closest(".prompt-shell")) return;

    const shell = document.createElement("div");
    shell.className = "prompt-shell";

    const toolbar = document.createElement("div");
    toolbar.className = "prompt-toolbar";

    const label = document.createElement("span");
    label.textContent = `可複製模板 ${index + 1}`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "複製";

    toolbar.append(label, button);
    block.parentNode.insertBefore(shell, block);
    shell.append(toolbar, block);

    button.addEventListener("click", async () => {
      const text = block.innerText.trim();
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "已複製";
        window.setTimeout(() => { button.textContent = "複製"; }, 1600);
      } catch {
        button.textContent = "請手動選取";
      }
    });
  });

  document.querySelectorAll(".checklist li").forEach((item, index) => {
    if (item.querySelector("input")) return;
    const text = item.innerHTML;
    item.innerHTML = "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `course-check-${index}`;

    const label = document.createElement("span");
    label.innerHTML = text;

    item.append(checkbox, label);
    checkbox.addEventListener("change", () => {
      item.classList.toggle("is-done", checkbox.checked);
    });
  });

  document.querySelectorAll("[data-tip]").forEach((item) => {
    if (!item.hasAttribute("tabindex")) item.setAttribute("tabindex", "0");
  });

  document.querySelectorAll(".quiz-card").forEach((card) => {
    const button = card.querySelector("button");
    const result = card.querySelector(".quiz-result");
    if (!button || !result) return;

    button.addEventListener("click", () => {
      const checked = card.querySelector("input:checked");
      if (!checked) {
        result.textContent = "先選一個答案。";
        return;
      }
      result.textContent = checked.dataset.correct === "true"
        ? "答對了。這就是本章要養成的判斷。"
        : "再想一次。重點是先降低模糊和風險。";
    });
  });
});
