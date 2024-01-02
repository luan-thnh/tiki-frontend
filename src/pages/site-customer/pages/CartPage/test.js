const LIST_CART = JSON.parse(localStorage.getItem('list_cart'));
const USER = JSON.parse(localStorage.getItem('user')) || [];

const tableBody = document.querySelector('.cart__table-body');
const totalPrice = document.querySelector('.cart__checkout-price--final');
const checkoutPrice = document.querySelector('.cart__checkout-price-price');
const btnCheckout = document.querySelector('.cart__checkout-price-btn');

const { name: userName } = USER;
const listCartByName = LIST_CART.filter((item) => item.user_name === userName)[0].product;

let sumPrice = 0;
let countProduct = 0;

function renderCart() {
  const titleAll = document.querySelector('.cart__select-all-product');

  let html = listCartByName
    .map(
      ({ id, image_url, name_product, price_product, price_discount, quantity, shop_name }) => `
    <div class="cart__table-group" data-product-id="${id}">
      <div class="cart__table-row">
        <div class="cart__table-col">
          <label for="table-checkbox-${id + 99}" class="cart__table-label">
            <img
              src="https://salt.tikicdn.com/ts/upload/30/24/79/8317b36e87e7c0920e33de0ab5c21b62.png"
              alt="Icon home"
              class="cart__table-icon-home"
            />
            <span class="cart__table-seller">${shop_name}</span>
          </label>
        </div>
      </div>
      <div class="cart__table-row">
        <div class="cart__table-col">
        <input type="checkbox" id="table-checkbox-${id + 99}" class="cart__table-checkbox cart__checkbox-item" />
          <a href="/details" class="cart__table-product">
            <img
              src="${image_url}"
              alt="${name_product}"
              class="cart__table-product-image"
            />
            <span class="cart__table-product-name">${name_product}</span>
          </a>
        </div>
        <div class="cart__table-col cart__table-price">
          ${
            price_product === price_discount
              ? `<span class="price-current">${formatPrice(price_product)}</span>`
              : `
              <span class="price-current">${formatPrice(price_discount)}</span>
              <span class="price-discount">${formatPrice(price_product)}</span>
              `
          }
          

        </div>
        <div class="cart__table-col cart__table-quantity">
          <button class="cart__table-quantity-btn cart__table-quantity-btn-minus">
            <img src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/decrease.svg" alt="" />
          </button>
          <input type="number" class="cart__table-quantity-input" value="${quantity}" min="1" max="99" />
          <button class="cart__table-quantity-btn cart__table-quantity-btn-plus">
            <img src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/increase.svg" alt="" />
          </button>
        </div>
        <div class="cart__table-col cart__table-money">
          <span data-money="${
            price_product === price_discount ? price_product * quantity : price_discount * quantity
          }">${
            price_product === price_discount
              ? formatPrice(price_product * quantity)
              : formatPrice(price_discount * quantity)
          }</span>
        </div>
        <div class="cart__table-col">
          <button class="cart__table-btn-remove cart__table-btn-remove-one">
            <img src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/trash.svg" alt="" />
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  tableBody.innerHTML = html;

  checkoutPrice.innerHTML = '0đ';
  totalPrice.innerHTML = 'Vui lòng chọn sản phẩm';
  totalPrice.style.fontSize = '13px';
  totalPrice.style.fontWeight = '400';

  btnCheckout.innerHTML = `Mua Hàng (0)`;
  titleAll.innerHTML = `Tất cả (${listCartByName.length} sản phẩm)`;
}

renderCart();

function handleRemoveProduct() {
  const btnRemoveAll = document.querySelector('.cart__table-btn-remove-all');
  const checkboxes = document.querySelectorAll('.cart__checkbox-item');
  const btnRemoveItems = document.querySelectorAll('.cart__table-btn-remove-one');
  const tableBody = document.querySelector('.cart__table-body');

  function removeRow(rowGroup, priceElRemove, dataProductId) {
    tableBody.removeChild(rowGroup);
    sumPrice -= priceElRemove;
    countProduct -= 1;

    const index = listCartByName.findIndex((item) => item.id === parseInt(dataProductId));
    listCartByName.splice(index, 1);

    localStorage.setItem('list_cart', JSON.stringify([{ user_name: userName, product: listCartByName }]));
    updateTotalPrice();
  }

  btnRemoveAll.addEventListener('click', () => {
    const checkedCheckboxes = document.querySelectorAll('.cart__checkbox-item:checked');

    if (checkedCheckboxes.length === 0) {
      alert('Bạn chưa chọn sản phẩm nào');
    } else {
      checkedCheckboxes.forEach((checkbox) => {
        const rowGroup = checkbox.closest('.cart__table-group');
        const row = checkbox.closest('.cart__table-row');
        const priceElRemove = parseInt(row.querySelector('.cart__table-money span').getAttribute('data-money'));
        const dataProductId = rowGroup.getAttribute('data-product-id');

        if (rowGroup) {
          removeRow(rowGroup, priceElRemove, dataProductId);
        }
      });
    }
  });

  btnRemoveItems.forEach((btnRemoveItem, index) => {
    btnRemoveItem.addEventListener('click', (e) => {
      if (!checkboxes[index].checked) {
        alert('Bạn chưa chọn sản phẩm');
      } else {
        const rowGroup = e.target.closest('.cart__table-group');
        const row = e.target.closest('.cart__table-row');
        const priceElRemove = parseInt(row.querySelector('.cart__table-money span').getAttribute('data-money'));
        const dataProductId = rowGroup.getAttribute('data-product-id');

        removeRow(rowGroup, priceElRemove, dataProductId);
      }
    });
  });
}

handleRemoveProduct();

function handleClickCheckbox() {
  const checkboxAll = document.querySelector('.cart__checkbox-all');
  const checkboxes = document.querySelectorAll('.cart__checkbox-item');
  const cartColMoneys = document.querySelectorAll('.cart__table-money span');

  checkboxAll.addEventListener('change', () => {
    if (checkboxAll.checked) {
      checkboxes.forEach((checkbox) => (checkbox.checked = true));

      sumPrice = Array.from(cartColMoneys).reduce(
        (total, money) => total + parseInt(money.getAttribute('data-money')),
        0
      );
      countProduct = checkboxes.length;
      updateTotalPrice();
    } else {
      checkboxes.forEach((checkbox) => (checkbox.checked = false));
      sumPrice = 0;
      countProduct = 0;
      updateTotalPrice();
    }
  });

  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', () => {
      const money = parseInt(cartColMoneys[index].getAttribute('data-money'));
      if (checkbox.checked) {
        sumPrice += money;
        countProduct += 1;
      } else {
        sumPrice -= money;
        countProduct -= 1;
      }

      if (sumPrice < 0) {
        sumPrice = 0;
        countProduct = 0;
      }

      updateTotalPrice();

      if (!checkbox.checked) checkboxAll.checked = false;
    });
  });
}

handleClickCheckbox();

function handleChangeQuantityProduct() {
  const inputQuantities = document.querySelectorAll('.cart__table-quantity-input');
  const btnMinuses = document.querySelectorAll('.cart__table-quantity-btn-minus');
  const btnPluses = document.querySelectorAll('.cart__table-quantity-btn-plus');
  const cartColMoneys = document.querySelectorAll('.cart__table-money span');

  listCartByName.forEach(({ id, price_product, price_discount, limit_product }, index) => {
    const inputQuantity = inputQuantities[index];
    const btnMinus = btnMinuses[index];
    const btnPlus = btnPluses[index];
    const colMoney = cartColMoneys[index];

    function updateQuantityProduct() {
      const index = listCartByName.findIndex((cart) => id === cart.id);

      listCartByName[index].quantity = parseInt(inputQuantity.value);
      localStorage.setItem(
        'list_cart',
        JSON.stringify([
          {
            user_name: userName,
            product: listCartByName,
          },
        ])
      );

      colMoney.setAttribute('data-money', moneyCart * inputQuantity.value);
      colMoney.innerHTML = formatPrice(moneyCart * inputQuantity.value);
    }

    let moneyCart = 0;
    price_product === price_discount ? (moneyCart = price_product) : (moneyCart = price_discount);

    if (inputQuantity.value === '1') {
      btnPlus.classList.remove('disable');
      btnMinus.classList.add('disable');
    }

    inputQuantity.addEventListener('keydown', (e) => {
      if ([' ', '-', '+', '*', '/'].includes(e.key)) {
        e.preventDefault();
      }
    });

    inputQuantity.addEventListener('focusout', (e) => {
      if (!e.target.value || !!parseInt(e.target.value) === false) {
        e.target.value = 1;
        btnPlus.classList.remove('disable');
        btnMinus.classList.add('disable');
      }

      if (e.target.value > limit_product) {
        e.target.value = limit_product;
        btnPlus.classList.add('disable');
        btnMinus.classList.remove('disable');
      }

      updateQuantityProduct();
    });

    btnPlus.addEventListener('click', () => {
      inputQuantity.value = parseInt(inputQuantity.value) + 1;
      btnMinus.classList.remove('disable');

      updateQuantityProduct();

      const checkboxes = document.querySelectorAll('.cart__checkbox-item');
      const cartColMoneys = document.querySelectorAll('.cart__table-money span');

      sumPrice = Array.from(cartColMoneys).reduce(
        (total, money) => total + parseInt(money.getAttribute('data-money')),
        0
      );
      countProduct = checkboxes.length;
      updateTotalPrice();

      if (inputQuantity.value >= limit_product) {
        btnPlus.classList.add('disable');
      }
    });

    btnMinus.addEventListener('click', () => {
      if (inputQuantity.value > 1) {
        inputQuantity.value = parseInt(inputQuantity.value) - 1;

        updateQuantityProduct();
        if (inputQuantity.value === '1') {
          btnPlus.classList.remove('disable');
          btnMinus.classList.add('disable');
        }
      }
    });
  });
}

handleChangeQuantityProduct();

function updateTotalPrice() {
  checkoutPrice.textContent = formatPrice(sumPrice);
  totalPrice.textContent = sumPrice === 0 ? 'Vui lòng chọn sản phẩm' : formatPrice(sumPrice);
  totalPrice.style.fontSize = sumPrice > 0 ? '22px' : '13px';
  totalPrice.style.fontWeight = sumPrice > 0 ? '600' : '400';
  btnCheckout.textContent = `Mua Hàng (${countProduct})`;
}

function formatPrice(num) {
  return num.toLocaleString('vi', {
    style: 'currency',
    currency: 'VND',
  });
}
