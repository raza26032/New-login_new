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
            email: document.getElementById('lemail').value,
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

function forgetPassword() {
    let email = document.getElementById('femail').value;
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







// var socket = io();
// var name = getQueryVariable("name") || 'Anonymous';

// $(".room-title").text(name);
// socket.on("connect", function () {
//     console.log("Connected to Socket I/O Server!");
//     console.log(name + " wants to join");
//     socket.emit('joinRoom', {
//         name: name,
//     });
// });

// var timeout;

// function timeoutFunction() {
//     typing = false;
//     console.log("stopped typing");
//     socket.emit('typing', {
//         text: ""
//     });
// }

// $('#messagebox').keyup(function () {
//     console.log('happening');
//     typing = true;
//     $("#icon-type").removeClass();
//     socket.emit('typing', {
//         text: name + " is typing ..."
//     });
//     clearTimeout(timeout);
//     timeout = setTimeout(timeoutFunction, 1000);
// });

// var hidden, visibilityChange;
// if (typeof document.hidden !== "undefined") {
//     hidden = "hidden";
//     visibilityChange = "visibilitychange";
// } else if (typeof document.mozHidden !== "undefined") {
//     hidden = "mozHidden";
//     visibilityChange = "mozvisibilitychange";
// } else if (typeof document.msHidden !== "undefined") {
//     hidden = "msHidden";
//     visibilityChange = "msvisibilitychange";
// } else if (typeof document.webkitHidden !== "undefined") {
//     hidden = "webkitHidden";
//     visibilityChange = "webkitvisibilitychange";
// }

// socket.on("typing", function (message) {
//     $(".typing").text(message.text);
// });

// socket.on("userSeen", function (msg) {

//     var icon = $("#icon-type");
//     icon.removeClass();
//     icon.addClass("fa fa-check-circle");
//     if (msg.read) {
//         icon.addClass("msg-read");
//     } else {
//         icon.addClass("msg-delieverd");
//     }
//     console.log(msg);
// });

// socket.on("message", function (message) {
//     console.log("New Message !");
//     console.log(message.text);
//     var $messages = $(".messages");
//     var $message = $('<li class = "list-group-item"></li>');

//     var momentTimestamp = moment.utc(message.timestamp).local().format("h:mm a");
//     $message.append("<strong>" + momentTimestamp + " " + message.name + "</strong>");
//     $message.append("<p>" + message.text + "</p>");
//     $messages.append($message);
//     var obj = $("ul.messages.list-group");
//     var offset = obj.offset();
//     var scrollLength = obj[0].scrollHeight;
//     $("ul.messages.list-group").animate({
//         scrollTop: scrollLength - offset.top
//     });

//     if (document[hidden]) {
//         notifyMe(message);
//         var umsg = {
//             text: name + " has not seen message",
//             read: false
//         };
//         socket.emit("userSeen", umsg);
//     } else {
//         var umsg = {
//             text: name + " has seen message",
//             read: true,
//             user: name
//         };
//         socket.emit("userSeen", umsg);
//     }
// });

// var $form = $("#messageForm");
// var $message1 = $form.find('input[name=message]');
// $form.on("submit", function (event) {
//     event.preventDefault();
//     var msg = $message1.val();
//     msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
//     if (msg === "") return -1;

//     socket.emit("message", {
//         text: msg,
//         name: name
//     });
//     var $messages = $(".messages");
//     var $message = $('<li class = "list-group-item"></li>');

//     var momentTimestamp = moment().format("h:mm a");
//     $message.append("<strong>" + momentTimestamp + " " + name + "</strong>");
//     $message.append($("<p>", {
//         class: "mymessages",
//         text: $message1.val()
//     }));
//     $messages.append($message);
//     $message1.val('');
//     var obj = $("ul.messages.list-group");
//     var offset = obj.offset();
//     var scrollLength = obj[0].scrollHeight;
//     $("ul.messages.list-group").animate({
//         scrollTop: scrollLength - offset.top
//     });
// });

// function notifyMe(msg) {
//     if (!("Notification" in window)) {
//         alert("This browser does not support desktop notification,try Chromium!");
//     }

//     else if (Notification.permission === "granted") {
//         var notification = new Notification('Twitter', {
//             body: msg.name + ": " + msg.text,
//             icon: ''
//         });
//         notification.onclick = function (event) {
//             event.preventDefault();
//             this.close();
//             var umsg = {
//                 text: name + " has seen message",
//                 read: true,
//                 user: name
//             };
//             socket.emit("userSeen", umsg);
//         };
//     }
//     else if (Notification.permission !== 'denied') {
//         Notification.requestPermission(function (permission) {
//             if (permission === "granted") {
//                 var notification = new Notification('Twitter', {
//                     body: msg.name + ": " + msg.text,
//                     icon: ''
//                 });
//                 notification.onclick = function (event) {
//                     event.preventDefault();
//                     this.close();
//                     var umsg = {
//                         text: name + " has seen message",
//                         read: true,
//                         user: name
//                     };
//                     socket.emit("userSeen", umsg);
//                 };
//             }
//         });
//     }
// }