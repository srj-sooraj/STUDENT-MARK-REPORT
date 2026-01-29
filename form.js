document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    const inputs = form.querySelectorAll("input");

    for (let input of inputs) {
      if (input.value.trim() === "") {
        alert("⚠️ Please fill all fields");
        e.preventDefault();
        return;
      }

    
      if (
        ["chem", "phy", "bio", "maths"].includes(input.name) &&
        (input.value < 0 || input.value > 100)
      ) {
        alert("⚠️ Marks must be between 0 and 100");
        e.preventDefault();
        return;
      }
    }
  });
});
