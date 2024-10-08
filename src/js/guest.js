const profileDropdown = document.querySelector('#author-menu-drd');
if (userSession) {
    const now = new Date().getTime();
    if (now < userSession.expiry) {
        profileDropdown.innerHTML = `
                <li class="bg-grey-light"><span class="dropdown-item">${userSession.user.providerData[0].email}</span></li>
                <li><a class="dropdown-item" href="./order.html">Đơn hàng</a></li>
                <li><a class="dropdown-item" href="./balance.html">Ví</a></li>
                <li><button id="logout-btn" class="btn text-danger">Đăng xuất</button</li>
            `;

        // Xử lý đang xuất
        document.getElementById('logout-btn').addEventListener('click', function () {
            if (confirm("Bạn có chắc chắn muốn đăng xuất")) {
                // Xóa thông tin phiên người dùng khỏi localStorage
                localStorage.removeItem('user_session');

                // Chuyển hướng tới trang đăng nhập
                window.location.href = "../../../index.html";
            }
        });
    }
}
