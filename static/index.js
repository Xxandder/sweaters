//Slider


document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.slider-wrapper');
    const totalSlides = 5; // Общее количество слайдов
    let lastIndex = 3;
    let slideWidth = 281; // Ширина слайда
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let currentIndex = 1; // Текущий индекс слайда
    if(windowWidth <= 1046 && windowWidth >= 768){
        slideWidth = 455;
    }
    if(windowWidth <= 1046){
        lastIndex = 1;
        currentIndex = 2;
    }

    function updateSlider() {
      const translateValue = -currentIndex * slideWidth + 'px';
      slider.style.transform = 'translateX(' + translateValue + ')';
    }
  
    function disableButtons() {
      const prevButton = document.querySelector('.prev-button');
      const nextButton = document.querySelector('.next-button');
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === totalSlides ; // Последний индекс для отображения трех слайдов
    }
  
    document.querySelector('.next-button').addEventListener('click', function () {
      if (currentIndex < totalSlides - lastIndex) {
        currentIndex++;
        updateSlider();
        disableButtons();
      }
    });
  
    document.querySelector('.prev-button').addEventListener('click', function () {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
        disableButtons();
      }
    });
  
    updateSlider(); // Вызываем при загрузке страницы для начального центрирования
    disableButtons();
  });
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  //FAQ toggles

  const toggles = document.querySelectorAll('.faq__toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', async () => {
      const faqTexts = document.querySelectorAll('.faq__text');
      
      const closefaqs = async () => {
        faqTexts.forEach(async (faqText) => {
        
            if (faqText !== toggle.parentNode.querySelector('.faq__text')) {
             
              if(faqText.classList.contains('active')){
                faqText.classList.remove('active');
                console.log(faqText.parentNode)
                faqText.parentNode.querySelector('.faq__toggle').style.transform = 'rotate(45deg)'
              }
              
              await delay(200);
            }
          });
      }

      await closefaqs();
      
      toggle.parentNode.querySelector('.faq__text').classList.toggle('active');
      
      const isActive = toggle.parentNode.querySelector('.faq__text').classList.contains('active')
      const img = toggle.querySelector('img');
        img.style.transform = isActive ? 'rotate(45deg)' : 'rotate(0deg)'
      
    });
  });
  



// Call Modal

  document.querySelector('.recall__button').addEventListener('click', function(event) {
    event.preventDefault();
    const inputs = document.querySelectorAll('.recall-form__input-fields input');
    if(inputs[0].value===''){
        alert('Введіть ім`я');
        return;
    }
    if(inputs[1].value===''){
        alert('Введіть номер телефону ');
        return;
    }
    inputs[0].value = '';
    inputs[1].value = '';
    document.getElementById('callModal').style.display = 'block';
});

document.getElementById('callCloseModalBtn').addEventListener('click', function() {
    document.getElementById('callModal').style.display = 'none';
});

document.querySelector('#callModal .button').addEventListener('click', function() {
    document.getElementById('callModal').style.display = 'none';
});


// Quantity changer

const choseSweaterButton = document.querySelector('.header .button')


choseSweaterButton.addEventListener('click', function() {
    // Используем метод scrollIntoView для плавного скролла до блока
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  });