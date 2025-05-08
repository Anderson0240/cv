document.addEventListener("DOMContentLoaded", function () {
    const parallaxBg = document.getElementById("parallax-bg");
  
    window.addEventListener("scroll", function () {
      let scrollY = window.scrollY;
      parallaxBg.style.transform = `translateY(${scrollY * 0.5}px)`;
    });
  });
  