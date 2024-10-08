const productForm = document.querySelector('#product-form');

productForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const productName = document.getElementById('product_name').value;
    const productPrice = document.getElementById('product_price').value;
    const productImage = document.getElementById('product_image').files[0];

    if (productImage) {
        const storageRef = storage.ref('product_images/' + productImage.name);
        const uploadTask = storageRef.put(productImage);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Xử lý Loading...
            },
            (error) => {
                console.error("Error uploading image: ", error);
            },
            () => {
                // Update file ảnh sản phẩm
                uploadTask.snapshot.ref.getDownloadURL().then((imageURL) => {
                    db.collection("products").add({
                        name: productName,
                        price: productPrice,
                        imageUrl: imageURL,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                        .then(() => {
                            console.log("Product added successfully!");
                            loadProducts();
                        })
                        .catch((error) => {
                            console.error("Error adding product: ", error);
                        });
                });
            }
        );
    }
});

// Hiển thị danh sách sản phẩm
function loadProducts() {
    const productTableBody = document.getElementById('product-list');
    let htmls = '';
    let index = 1;
    db.collection('products').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                htmls += `
                        <tr class="product-item text-center">
                            <th scope="row">${index}</th>
                            <td><img src="${product.imageUrl}" alt="${product.name}"></td>
                            <td>${product.name}</td>
                            <td>${product.price}</td>
                            <td>
                                <button class="btn btn-danger btn-sm btn-delete-product" data-id="${doc.id}"><i class="fa-light fa-trash-can"></i></button>
                            </td>
                        </tr>
                    `;
                index++;
            });
            productTableBody.innerHTML = htmls;

            const btnDeleteProduct = document.querySelectorAll('.btn-delete-product');
            btnDeleteProduct.forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = btn.getAttribute('data-id');
                    deleteProduct(productId);
                    loadProducts()
                });
            });
        })
        .catch((error) => {
            console.error("Error fetching products: ", error);
        });
}

// Xóa sản phẩm
function deleteProduct(productId) {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        db.collection("products").doc(productId).delete()
            .then(() => {
                console.log("Product successfully deleted!");
                loadProducts(); // Tải lại danh sách sản phẩm
            })
            .catch((error) => {
                console.error("Error removing product: ", error);
            });
    }
}

loadProducts();
