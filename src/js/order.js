const orderList = document.querySelector('.order-list');
console.log(userSession);

function getOrderList() {
    let authorEmail = userSession?.user.email;
    let htmls = "";
    db.collection("orders").where("author", "==", authorEmail)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const orderItem = doc.data();
                const createdAt = orderItem.createdAt.toDate(); // Chuyển đổi Firestore Timestamp thành đối tượng Date
                const options = { timeZone: 'Asia/Ho_Chi_Minh', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
                const formattedDate = createdAt.toLocaleString('vi-VN', options); // Định dạng ngày tháng và giờ theo định dạng Việt Nam

                let statusString = "";
                let cancelButton = ""; // Khởi tạo biến để lưu nút hủy

                if (orderItem.status == 0) {
                    statusString = "Chờ xác nhận";
                    cancelButton = `<button class="btn btn-danger btn-cancel" data-order-id="${doc.id}">Hủy đơn</button>`; // Nút hủy hiển thị nếu status = 0
                } else if (orderItem.status == 1) {
                    statusString = "Chờ vận chuyển";
                } else if (orderItem.status == 2) {
                    statusString = "Đã nhận hàng";
                }
                else {
                    statusString = "Đã hủy";
                }

                htmls += `
                    <div class="order-item shadow-md mt-2">
                        <div class="d-flex align-items-center px-2">
                            <img class="rounded-md" src="${orderItem.product.imageUrl}" alt="${orderItem.product.name}">
                            <div class="content p-2" style="flex: 50%">
                                <h6>${orderItem.product.name}</h6>
                                <p>Tổng tiền: ${orderItem.product.price * parseInt(orderItem.quantity)}</p>
                                <p>Ngày đặt: ${formattedDate}</p>
                                <p>Trạng thái: <i>${statusString}</i></p>
                            </div>
                            <div class="actions">
                                ${cancelButton}
                            </div>
                        </div>
                    </div>
                `;
            });
            orderList.innerHTML = htmls;

            // Thêm sự kiện cho nút hủy
            document.querySelectorAll('.btn-cancel').forEach((button) => {
                button.addEventListener('click', function() {
                    const orderId = this.getAttribute('data-order-id');

                    // Xác nhận hủy đơn hàng
                    if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
                        db.collection("orders").doc(orderId).update({
                            status: 3 // Cập nhật status thành -1 hoặc một giá trị nào đó để thể hiện rằng đơn hàng đã bị hủy
                        })
                        .then(() => {
                            alert("Hủy đơn hàng thành công.");
                            getOrderList(); // Cập nhật lại danh sách đơn hàng
                        })
                        .catch((error) => {
                            alert("Lỗi hủy đơn hàng.");
                            console.error("Error cancelling order: ", error);
                        });
                    }
                });
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

getOrderList();
