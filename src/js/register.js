const inpUsername = document.querySelector(".inp-username");
const inpEmail = document.querySelector(".inp-email");
const inpPwd = document.querySelector(".inp-pwd");
const inpConfirmPwd = document.querySelector(".inp-cf-pw");
const registerForm = document.querySelector("#register-form");

function handleRegister(event) {
    event.preventDefault() // Ngăn chặn hành vi mặc định của form

    let username = inpUsername.value;
    let email = inpEmail.value;
    let password = inpPwd.value;
    let confirmPassword = inpConfirmPwd.value;
    let role_id = 2; // Mặc định là quyền của guest. ( 1: Admin, 2: Guest )

    // check fields empty
    if (!username || !email || !password || !confirmPassword) {
        alert("Vui lòng điền đủ các trường");
        return;
    }
    if (password != confirmPassword) {
        alert("Mật khẩu không khớp");
        return;
    }

    // Tạo tài khoản với Firebase Auth
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // Thông tin người dùng
            let userData = {
                username,
                email,
                password,
                role_id: role_id,
                balance: 0, // số dư ví mặc định là 0
            }

            // Thêm user vào Firestore
            db.collection("users").add(userData)
                .then((docRef) => {
                    alert("Đăng ký thành công");
                    window.location.href = "/src/pages/login.html";
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                    alert("Đăng ký thất bại");
                    console.error("Error adding document: ", error);
                });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
            alert(`Lỗi: ${errorMessage}`);
            console.log(errorMessage);
        });
}

registerForm.addEventListener("submit", handleRegister);
