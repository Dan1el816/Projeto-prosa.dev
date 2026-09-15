document.addEventListener("click", (event) => {
  const menus = document.querySelectorAll(".post-menu");

  menus.forEach((menu) => {
    if (!menu.contains(event.target)) {
      menu.removeAttribute("open");
    }
  });
});
