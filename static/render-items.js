const apiUrlItems = 'http://localhost:3000/api/items';

let jsonObjectItems;

async function fetchData() {
  try {
    response = await fetch(apiUrlItems);
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Произошла ошибка:', error.message);
  }
}

const renderItems = (limit, start=0) => {
    const shopBody = document.querySelector('.shop__body');
    const items = jsonObjectItems['data'];
   
    let shopBodyInnerText = '';
    const maxIndex = limit ? limit : items.length
    console.log(items.length)
    for(let i = 0; i < maxIndex; i++){
        console.log(items[i])
        shopBodyInnerText += `
                <div class="shop__column">        
                <article class="shop__item item-shop">
                    <div class="item-shop__content">
                        <a href="http://localhost:3000/item.html?code=${items[i]['code']}" class="item-practice__image _ibg">
                            <img class="" src="http://localhost:3000/goods-images/${items[i]['photos'][0]}"/>
                        </a>
                        <a href="" class="item-shop__link">
                            <h4 class="item-shop__title">
                                ${items[i]['title']}
                            </h4>
                        </a>
                        <div class="item-shop__code">
                            Код: ${items[i]['code']}
                        </div>                             
                        <div class="item-shop__price">
                         ${items[i]['price']} грн
                        </div>
                        <a href="http://localhost:3000/item.html?code=${items[i]['code']}"  class="button item-shop__button">
                            <div class="">
                                ЗАМОВИТИ
                            </div>
                        </a>
                    </div>
                </article>
            </div>
        `
    }
    shopBody.innerHTML = shopBodyInnerText;
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    
}

fetchData().then(data=>{
    jsonObjectItems = data;
    renderItems(4, 0);
});


document.querySelector('.shop__show-all-button').addEventListener('click', (event)=>{
    event.preventDefault();
    if(document.querySelector('.shop__show-all-button').innerHTML === "СХОВАТИ"){
        document.querySelector('.shop__show-all-button').innerHTML = "ПОКАЗАТИ ВСІ"
        renderItems(4, 0);
    }else{
        document.querySelector('.shop__show-all-button').innerHTML = "СХОВАТИ"
        renderItems();
    }
    
    
})
