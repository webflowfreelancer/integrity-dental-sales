document
  .getElementById("toggleDarkModeButton")
  .addEventListener("click", function () {
    console.log("Button clicked!"); // Added console.log statement
    document.body.classList.toggle("dark-mode");
  });
