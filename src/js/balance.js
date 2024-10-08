const balanceForm = document.querySelector('#balance-form');
const inpAmount = document.querySelector('#amount');
const currentBalance = document.querySelector(".current-balance");
let authorEmail = userSession.user.email;


db.collection("users").where("email", "==", authorEmail)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let userDoc = doc.data();

            // Định dạng số tiền thành tiền Việt Nam
            const formattedBalance = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(userDoc.balance);
            currentBalance.innerHTML = "Số dư: " + formattedBalance;
        });
    })
    .catch((error) => {
        console.error("Error getting documents: ", error);
    });

// Nạp tiền vào ví
balanceForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    let amount = parseFloat(inpAmount.value); // Chuyển amount thành số thực

    // Lấy ra thông tin user và cập nhật số dư ví
    db.collection("users").where("email", "==", authorEmail)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let userDoc = doc.data();
                currentBalance.innerHTML = userDoc.balance;
                let newBalance = (userDoc.balance || 0) + amount; // Tính số dư mới
                db.collection("users").doc(doc.id).update({
                    balance: newBalance
                })
                    .then(() => {
                        console.log("Balance updated successfully");
                        alert("Nạp thành công");
                    })
                    .catch((error) => {
                        console.error("Error updating balance: ", error);
                        alert("Có lỗi xảy ra khi nạp");
                    });
            });
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
});
