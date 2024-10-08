function checkSession() {
    if (userSession) {
        const now = new Date().getTime();

        if (now > userSession.expiry) {
            // Phiên đã hết hạn, xóa dữ liệu và chuyển hướng về trang đăng nhập
            localStorage.removeItem('user_session');
            window.location.href = "/src/pages/login.html";
        } else {
            console.log("Phiên còn hợp lệ");
        }
    } else {
        // Không có phiên, chuyển hướng về trang đăng nhập
        window.location.href = "/src/pages/login.html";
    }
}