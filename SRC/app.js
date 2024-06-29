document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Robusta Italian", img: "product1.jpg", price: 20000 },
      { id: 2, name: "Arabican Taste", img: "product2.jpg", price: 30000 },
      { id: 3, name: "Primo Nesco", img: "product3.jpg", price: 35000 },
      { id: 4, name: "Aceh Blend", img: "product4.jpg", price: 25000 },
      { id: 5, name: "Jawa Mandheling", img: "product5.jpg", price: 40000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // Cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada barang
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang akan diremove berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);
      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= item.price;
      }
    },
  });
});

const checkOutButton = document.querySelector(".checkout-button");
checkOutButton.disabled = true;

const form = document.querySelector("#checkoutForm");
form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkOutButton.classList.remove("disabled");
      checkOutButton.classList.add("disabled");
    } else {
      return false;
    }
  }

  checkOutButton.disabled = false;
  checkOutButton.classList.remove("disabled");
});

// Kirim data Ketika klik checkout button
checkOutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open("http://wa.me/62[no_hpSales]?text" + encodeURIComponent(message));
});

// format kirim pesan Whatsapp
const formatMessage = (obj) => {
  return `Data customer
  Nama: ${obj.name}
  Email: ${obj.email}
  No HP: ${obj.phone}
  Data pesanan
  ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})\n`)}
  TOTAL: ${rupiah(obj.total)}
  Terimakasih.`;
};

// Konversi Mata Uang Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
