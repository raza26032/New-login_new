function signup() {
    axios({
        method: 'post',
        url: 'http://localhost:5000/signup',
        data: {
            name: document.getElementById('sname').value,
            email: document.getElementById('semail').value.toLowerCase(),
            password: document.getElementById('spw').value,
            phone: document.getElementById('sno').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./login.html"
        } else {
            alert(response.data.message);
        }
    }).catch((error) => {
        console.log(error);
    });
    return false
}

function login() {
    axios({
        method: 'post',
        url: 'http://localhost:5000/login',
        data: {
            email: document.getElementById('lemail').value.toLowerCase(),
            password: document.getElementById('lpassword').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./deshboard.html"
        }
        else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false
}

function logout() {
    axios({
        method: 'post',
        url: 'http://localhost:5000/logout',
    }).then((response) => {
        location.href = "./login.html"
    }, (error) => {
        console.log(error);
    });
    return false
}

function forgetPassword() {
    email = document.getElementById('femail').value;
    localStorage.setItem('email', email)
    axios({
        method: 'post',
        url: 'http://localhost:5000/forget-password',
        data: {
            email: email,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./forget2.html"
        }
        else {
            alert(response.data.message)
        }
    }, (error) => {
        alert(error);
    });
    return false
}

function forgetPassword2() {
    let getEmail = localStorage.getItem('email')
    axios({
        method: 'post',
        url: 'http://localhost:5000/forget-password-2',
        data: {
            email: getEmail,
            newPassword: document.getElementById('newPassword').value,
            otp: document.getElementById('otp').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./login.html"
        }
        else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false
}