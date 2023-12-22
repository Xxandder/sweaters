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


