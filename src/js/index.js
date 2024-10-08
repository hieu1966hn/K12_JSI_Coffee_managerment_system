// Hiển thị danh sách sản phẩm
const productList = document.querySelector('.product-list');

function getProductList() {
    let htmls = '';
    db.collection('products').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                const productId = doc.id;
                const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
                htmls += `
                    <div class="product-item col-md-3 col-6">
                        <div class="content">
                            <img src="${product.imageUrl}" alt="${product.name}">
                            <div class="text p-2">
                                <div class="d-flex justify-content-between">
                                    <h6>${product.name}</h6>
                                    <h6>${formattedPrice}</h6>
                                </div>
                                <button class="btn btn-primary btn-order" data-id=${productId}>Đặt hàng</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            productList.innerHTML = htmls;

            let btnOrder = document.querySelectorAll('.btn-order');
            btnOrder.forEach(btn => {
                btn.addEventListener('click', function () {
                    const productId = this.getAttribute('data-id');
                    checkSession();
                    showOrderForm(productId);
                });
            });

        })
        .catch((error) => {
            console.error("Error fetching products: ", error);
        });
}

getProductList();

function showOrderForm(productId) {
    let orderForm = document.querySelector(".order-form");
    orderForm.style.display = 'block';

    // Lấy thông tin sản phẩm by id
    db.collection('products').doc(productId).get()
        .then((doc) => {
            if (doc.exists) {
                const product = doc.data();
                const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
                // Hiển thị thông tin sản phẩm trong form đặt hàng
                orderForm.style.display = 'block';
                orderForm.innerHTML = `
                        <div class="content p-2 rounded-md">
                            <button class="btn text-black btn-cancel">Đóng</button>
                            <div class="row">
                                <div class="col-md-4 col-12">
                                    <img src="${product.imageUrl}" alt="${product.name}">
                                </div>
                                <div class="col-md-8 col-12">
                                    <h5>${product.name}</h5>
                                    <p>Giá: ${formattedPrice}</p>
                                    <form id="order-form">
                                        <div>
                                            <label for="quantity">Số lượng</label>
                                            <input type="number" id="quantity" value="1" min="1">
                                        </div>
                                        <button type="submit" class="btn btn-primary mt-4 btn-confirm-order" data-price=${product.price}>Xác nhận</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    `;

                // Thêm sự kiện cho nút đóng form
                const btnCancel = orderForm.querySelector('.btn-cancel');
                btnCancel.addEventListener('click', function () {
                    orderForm.innerHTML = '';
                    orderForm.style.display = 'none';
                });

                // Thêm sự kiện cho form đặt hàng
                const btnConfirmOrder = document.querySelector(".btn-confirm-order");
                btnConfirmOrder.addEventListener('click', function (e) {
                    e.preventDefault();
                    const quantity = document.getElementById('quantity').value;
                    const productPrice = this.getAttribute('data-price');
                    handleOrder(productId, quantity, productPrice);
                });

            } else {
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.error("Error getting document: ", error);
        });

}

function handleOrder(productId, quantity, productPrice) {
    if (!userSession) {
        return;
    }
    let authorEmail = userSession.user.email;
    db.collection("users").where("email", "==", authorEmail)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let author = { ...doc.data() };
                const totalCost = productPrice * quantity; // Tính tổng chi phí

                // Kiểm tra số dư
                if (author.balance < totalCost) {
                    alert("Số dư ví không đủ!");
                    return;
                }

                db.collection("products").doc(productId)
                    .get()
                    .then((doc) => {
                        const orderData = {
                            author: authorEmail, // Người đang order
                            product: doc.data(),
                            quantity: quantity,
                            status: 0,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        };

                        // Lưu đơn hàng
                        db.collection('orders').add(orderData)
                            .then(() => {
                                // Tìm kiếm người dùng theo email
                                return db.collection('users').where("email", "==", authorEmail).get();
                            })
                            .then((querySnapshot) => {
                                // Kiểm tra xem người dùng có tồn tại không
                                if (!querySnapshot.empty) {
                                    // Cập nhật số dư ví của người dùng
                                    const userDoc = querySnapshot.docs[0];
                                    return userDoc.ref.update({
                                        balance: userDoc.data().balance - totalCost // Trừ số dư ví
                                    });
                                } else {
                                    throw new Error("Không tìm thấy người dùng.");
                                }
                            })
                            .then(() => {
                                alert("Đặt hàng thành công!");
                                document.querySelector(".order-form").style.display = 'none';
                            })
                            .catch((error) => {
                                console.error("Error placing order or updating balance: ", error);
                            });
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });

            });

        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

