document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations (fade in)
  const sections = document.querySelectorAll('section');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Un-comment to only animate once:
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // Sidebar Nav Active State on Scroll
  const navLinks = document.querySelectorAll('.sidebar nav a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // Smooth Scroll for Nav Links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      window.scrollTo({
        top: targetSection.offsetTop - 40,
        behavior: 'smooth'
      });
    });
  });

  // SPARQL Accordion Toggle
  const queryBlocks = document.querySelectorAll('.query-block');
  
  queryBlocks.forEach(block => {
    const header = block.querySelector('.query-header');
    header.addEventListener('click', () => {
      // Close other open blocks (accordion behavior)
      queryBlocks.forEach(otherBlock => {
        if (otherBlock !== block && otherBlock.classList.contains('open')) {
          otherBlock.classList.remove('open');
        }
      });
      // Toggle current block
      block.classList.toggle('open');
    });
  });
});

  // Lightbox Logic
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const expandableImgs = document.querySelectorAll(".expandable-img");

  if (lightbox && lightboxImg && closeBtn) {
    expandableImgs.forEach(img => {
      img.addEventListener("click", () => {
        lightbox.style.display = "block";
        lightboxImg.src = img.src;
      });
    });

    closeBtn.addEventListener("click", () => {
      lightbox.style.display = "none";
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target !== lightboxImg) {
        lightbox.style.display = "none";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.style.display === "block") {
        lightbox.style.display = "none";
      }
    });
  }
