
let Products = [];
async function getCartPro() {
  let res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("userToken").slice(1, -1),
    },
  });
  let resFinal = await res.json();
  Products = resFinal.data.products;
  console.log(Products);
  disCartPro();
}
getCartPro();

function disCartPro() {
  let pro = ``;
  for (let i = 0; i < Products.length; i++) {
    const product = Products[i];
    const totalPrice = product.price * product.count; // Calculate total price based on quantity

    pro += `
      <div class="cart-object" data-product-id="${product.product._id}">
        <i class="fa-solid fa-trash" onclick="deleteProduct('${product.product._id}')"></i>
        <img src="${product.product.imageCover}" alt="">
        <div class="cart-details">
          <div class="cart-detail">
            <p>Name</p>
            <p>${product.product.title}</p>
          </div>
          <div class="cart-detail">
            <p>Quantity</p>
            <button onclick="changeQuantity('${product.product._id}', -1)">-</button>
            <span>${product.count}</span>
            <button onclick="changeQuantity('${product.product._id}', 1)">+</button>
          </div>
          <div class="cart-detail">
            <p>Price</p>
            <p>$${totalPrice.toFixed(2)}</p> <!-- Display total price based on quantity -->
          </div>
        </div>
      </div>
    `;
  }
  document.querySelector(".cart-body").innerHTML = pro;
}

async function changeQuantity(productId, change) {
  const product = Products.find(p => p.product._id === productId);
  if (!product) return;

  const newCount = product.count + change;
  if (newCount < 1) return; // Prevent quantity from going below 1

  // Update the quantity on the server
  try {
    let res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("userToken").slice(1, -1),
      },
      body: JSON.stringify({ count: newCount })
    });

    if (res.ok) {
      // Update the local product quantity and refresh the cart display
      product.count = newCount;
      disCartPro(); // Refresh to show updated quantity and price
    } else {
      console.error("Failed to update quantity:", await res.json().message);
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
}

async function deleteProduct(productId) {
  try {
    let res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("userToken").slice(1, -1),
      },
    });
    let resFinal = await res.json();
    if (res.ok) {
      Products = Products.filter(product => product.product._id !== productId);
      disCartPro();
      console.log(`Product with ID ${productId} deleted successfully.`);
    } else {
      console.error("Failed to delete product:", resFinal.message);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}
