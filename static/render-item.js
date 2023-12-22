const currentUrl = window.location.href;
const apiUrl = `http://localhost:3000/api/items/${currentUrl.split('=')[1]}`;
console.log(currentUrl.split('='))
let jsonObject;

async function fetchData() {
  try {
    response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Произошла ошибка:', error.message);
  }
}


const renderItem = () => {
   
    const itemBodyInnerText = `
                   
                    <div class="item__container _container">
                        <div class="item__images ">

                            <div class="item__secondary-images">

                                ${
                                    jsonObject.photos.map(photo=>  {
                                        return `
                                        <div class="item__secondary-image">
                                            <div class="item__secondary-image-wrapper _ibg">
                                                <img src="http://localhost:3000/goods-images/${photo}" alt="">
                                            </div>
                                        
                                        </div>
                                        `
                                    }).slice(0, -1).join('')
                                }

                              
                               
                            </div>
                            <div class="item__main-image ">
                            
                                <div class="item__main-image-wrapper _ibg">
                                
                                        <img src="http://localhost:3000/goods-images/${jsonObject.photos[0]}" alt="">
                                
                                </div>
                                
                            </div>
                        </div>

                        <div class="item__info">
                            <div class="item__info-wrapper">
                                <div class="item__header">${jsonObject.title}</div>
                            <div class="item__code">Код: ${jsonObject.code}</div>
                            <div class="item__price">${jsonObject.price} грн</div>
                            <div class="item__data">
                                <div class="item__sizes">
                                    <div class="item__sizes-title">
                                        Розміри:
                                    </div>
                                    <div class="item__sizes-values">
                                    ${
                                        jsonObject.sizes.map(size => {
                                            return `
                                            <div class="item__size">
                                                ${size}
                                            </div>`
                                        }).join('')
                                    }
                                
                                </div>
                                

                            </div>
                            <div class="item__manufacturer">
                                    Виробник: <span>Туреччина</span>
                                </div>
                                <div class="item__composition">
                                    Склад: <span>70% вовна, 30% акрил</span>
                                </div>
                            <div class="item__quantity">
                                <div class="item__quentity-title">
                                    Кількість:
                                </div>
                                <div class="item__quantity-manage">
                                    <div class="item__quantity-button item__quantity-button-next">
                                        -
                                    </div>
                                    <div class="item__quantity-value">
                                        1
                                    </div>
                                    <div class="item__quantity-button item__quantity-button-prev">
                                        +
                                    </div>
                                </div>
                            </div>
                            </div>
                            

                            <a class="item__order-button button">
                                <div>
                                    ЗАМОВИТИ
                                </div>
                            </a>

                        </div>

                    </div>
                </div>
        `
        this.document.querySelector('.item').innerHTML = itemBodyInnerText;
                    const quantityValue = document.querySelector('.item__quantity-value');
            const quantityNextButton =  document.querySelector('.item__quantity-button-next');
            const quantityPrevButton =  document.querySelector('.item__quantity-button-prev');

            quantityNextButton.addEventListener('click', ()=>{
                if(parseInt(quantityValue.innerHTML) > 1){
                    quantityValue.innerHTML = `${parseInt(quantityValue.innerHTML) - 1}`
                }
                
            })

            quantityPrevButton.addEventListener('click', ()=>{
                quantityValue.innerHTML = `${parseInt(quantityValue.innerHTML) + 1}`
            })


            document.querySelector('.item__order-button').addEventListener('click', ()=>{
                const orderModal = document.querySelector('#orderModal');
                orderModal.style.display = 'block'
            })

            document.getElementById('orderCloseModalBtn').addEventListener('click', function() {
                document.getElementById('orderModal').style.display = 'none';
            });

            const orderButton = document.querySelector('#orderModal .button');
            orderButton.addEventListener('click', ()=>{
                const inputFields = document.querySelectorAll('.recall-form__input-fields input');
                if(inputFields[0].value===''){
                    alert('Введіть ім`я');
                    return;
                }
                if(inputFields[1].value===''){
                    alert('Введіть номер телефону ');
                    return;
                }
                inputFields[0].value = '';
                inputFields[1].value = '';
                document.getElementById('orderModal').style.display = 'none';

                document.querySelector('#thankModal').style.display = 'block'
            })

            document.querySelector('#thankCloseModalBtn').addEventListener('click', ()=>{
                document.querySelector('#thankModal').style.display = 'none';
            })

            document.querySelector('#thankModal .button').addEventListener('click', ()=>{
                document.querySelector('#thankModal').style.display = 'none';
            })
    }
   
    


fetchData().then(data=>{
    jsonObject = data;
    renderItem();
});


