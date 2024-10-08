function loadOrders() {
    const orderTableBody = document.getElementById('order-list-admin');
    let htmls = '';
    let index = 1;
    db.collection('orders').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const orderItem = doc.data();
                const orderId = doc.id; // Lấy ID của tài liệu
                htmls += `
                    <tr class="product-item text-center">
                        <th scope="row">${index}</th>
                        <td>${orderItem.author}</td>
                        <td>${orderItem.product.name}</td>
                        <td>${orderItem.product.price * parseInt(orderItem.quantity)}</td>
                        <td>
                            <select class="slt-order-status" data-order-id="${orderId}">
                                <option value="0" ${orderItem.status === 0 ? 'selected' : ''}>Chờ xác nhận</option>
                                <option value="1" ${orderItem.status === 1 ? 'selected' : ''}>Chờ vận chuyển</option>
                                <option value="2" ${orderItem.status === 2 ? 'selected' : ''}>Đã nhận hàng</option>
                                <option value="2" ${orderItem.status === 3 ? 'selected' : ''}>Đã hủy</option>
                            </select>
                        </td>
                    </tr>
                `;
                index++;
            });
            orderTableBody.innerHTML = htmls;

            // Thêm trình xử lý sự kiện cho tất cả các select
            document.querySelectorAll('.slt-order-status').forEach((selectElement) => {
                selectElement.addEventListener('change', function() {
                    const orderId = this.getAttribute('data-order-id');
                    const newStatus = parseInt(this.value);

                    // Cập nhật trường status trong Firestore
                    db.collection('orders').doc(orderId).update({
                        status: newStatus
                    }).then(() => {
                        alert('Cập nhật trạng thái thành công');
                    }).catch((error) => {
                        alert('Lỗi cập nhật trạng thái');
                        console.error('Error updating order status: ', error);
                    });
                });
            });
        })
        .catch((error) => {
            console.error("Error fetching products: ", error);
        });
}

loadOrders();
