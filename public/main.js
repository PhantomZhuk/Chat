const socket = io('http://localhost:3000');

$(`.drag-and-drop`).on("dragover", (e) => {
    e.preventDefault();
});

$(`.drag-and-drop`).on("drop", (e) => {
    e.preventDefault();

    const file = e.originalEvent.dataTransfer.files[0];
    handleFile(file);
});

$(`#changeProfileImgInput`).on("change", function () {
    const file = this.files[0];
    if (file) {
        console.log(file);
        handleFile(file);
    }
});

function handleFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    axios
        .post("/users/uploadUserIcon", formData)
        .then((res) => {
            console.log(res);
            showProfile();
            $(`.changeProfileImgContainer`).css(`display`, `none`);
            $(`.profileContainer`).css(`display`, `flex`);
            notification(`Profile image changed`);
        })
        .catch((error) => {
            console.log(error);
        });
}

function showProfile() {
    axios
        .get(`/users/getUserInfo`)
        .then((res) => {
            // const transformedPath = res.data.
            //     .replace("public\\", "/")
            //     .replace(/\\/g, "/");

            $("#profileImg").css("background-image", `url(${res.data.photo})`);
            $("#accountIcon").css("background-image", `url(${res.data.photo})`);
            $(".profileName").text(res.data.login);
            $(".accountName").text(res.data.login);
            showMainChatMessages();
        })
        .catch((err) => {
            console.log(err);
        });
}

showProfile();

$(`#changeNameBtn`).click(() => {
    axios
        .post(`/users/updateUserName`, {
            login: $("#changeNameInput").val(),
        })
        .then((res) => {
            console.log(res);
            showProfile();
            $(`.changeNameContainer`).css(`display`, `none`);
            $(`.profileContainer`).css(`display`, `flex`);
            $("#changeNameInput").val(``);
            notification(`Name changed`);
        })
        .catch((error) => {
            console.log(error);
        });
});

socket.on('messageUser', (message) => {
    console.log(message);
});

$(`#sendMessageBtn`).click(() => {
    console.log("Click");
    const message = $("#sendMessageInput").val();
    $("#sendMessageInput").val(``);
    socket.emit("message", message);
})

socket.on("connectionUsers", (connectionUsers) => {
    console.log(connectionUsers);
    $(`.usersOnline`).text(`Online ${connectionUsers}`);
});

// let file;

// $(`#drag-and-dropChat`).click(() => {
//     $(`#changeChatImgInput`).click();
// });

// $(`#drag-and-dropChat`).on("dragover", (e) => {
//     e.preventDefault();
// });

// $(`#drag-and-dropChat`).on("drop", (e) => {
//     e.preventDefault();
//     file = e.originalEvent.dataTransfer.files[0];
//     if (file && file.type.startsWith("image/")) {
//         const reader = new FileReader();
//         reader.onload = function (event) {
//             $(`.changeChatImgContainer`).css(`display`, `none`);
//             $(`.addChatContainer`).css(`display`, `flex`);
//             $(`.newChatIcon`).css(`background-image`, `url(${event.target.result})`);
//         };
//         reader.readAsDataURL(file);
//         $(`#newChatIcon`).text(``);
//     }
// });

// $(`#changeChatImgInput`).on("change", function () {
//     file = this.files[0];
//     if (file && file.type.startsWith("image/")) {
//         const reader = new FileReader();
//         reader.onload = function (event) {
//             $(`.changeChatImgContainer`).css(`display`, `none`);
//             $(`.addChatContainer`).css(`display`, `flex`);
//             $(`.newChatIcon`).css(`background-image`, `url(${event.target.result})`);
//         };
//         reader.readAsDataURL(file);
//         $(`#newChatIcon`).text(``);
//     }
// });


// let chatToken = localStorage.getItem("chatToken") || "mainChat";

// $(".sendMessageContainer").on("submit", (e) => {
//     e.preventDefault();
//     const message = $("#sendMessageInput").val();
//     if (message) {
//         console.log("Sending to chat:", localStorage.getItem("chatToken"));
//         socket.emit("chat message", { message, userId, chatId: localStorage.getItem("chatToken") });
//         $("#sendMessageInput").val("");
//     }
// });

// socket.on("My message", (data) => {
//     axios.get(`/auth/allUsers`)
//         .then((res) => {
//             const user = res.data.find((el) => el._id === userId);
//             if (!user) return;

//             const transformedPath = user.path.replace("public\\", "./").replace(/\\/g, "/");

//             appendMessage(
//                 "myMessage",
//                 nameUser,
//                 data.message,
//                 transformedPath,
//                 localStorage.getItem("chatToken"),
//                 data.messageId
//             );

//             $(".messageContainer").animate(
//                 { scrollTop: $(".messageContainer").prop("scrollHeight") },
//                 "slow"
//             );
//         })
//         .catch((err) => console.log(err));
// });

// socket.on("Other message", (data) => {
//     axios.get(`/auth/allUsers`)
//         .then((res) => {
//             const user = res.data.find((el) => el._id === data.userId);
//             if (!user) return;

//             const transformedPath = user.path.replace("public\\", "./").replace(/\\/g, "/");

//             getUserNameById(data.userId, (userName) => {
//                 appendMessage(
//                     "otherMessage",
//                     userName,
//                     data.message,
//                     transformedPath,
//                     data.chatId,
//                     data.messageId
//                 );

//                 $(".messageContainer").animate(
//                     { scrollTop: $(".messageContainer").prop("scrollHeight") },
//                     "slow"
//                 );
//             });
//         })
//         .catch((err) => console.log(err));
// });

// socket.on("connectionUsers", (connectionUsers) => {
//     $(`.usersOnline`).text(`Online ${connectionUsers}`);
//     connectionUser = connectionUsers;
// });

// function checkAuthorisation() {
//     axios.get("/users/getUserInfo")
//         .then((res) => {
//             console.log(res);
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// }

// checkAuthorisation();

// function getUserNameById(id, callback) {
//     axios
//         .get("/auth/allUsers")
//         .then((res) => {
//             const user = res.data.find((el) => el._id === id);
//             if (user) {
//                 callback(user.login);
//             } else {
//                 callback("Unknown");
//             }
//         })
//         .catch(() => callback("Unknown"));
// }

// function appendMessage(type, userName, message, photoUrl, chatId, messageId) {
//     if (chatId == localStorage.getItem("chatToken")) {
//         $(".messageContainer").append(`
//             <div class="${type} message" id="${messageId}">
//                 <div class="iconContainer">
//                     <div class="icon" style="background-image: url('${photoUrl}');"></div>
//                 </div>
//                 <div class="nameContainer">
//                     <div class="nameUser">${userName}</div>
//                     <div class="message">${message}</div>
//                 </div>
//             </div>
//         `);
//     }
// }

// function showMainChatMessages(userId) {
//     axios.get(`/chat/mainChatMessages`)
//         .then((messageRes) => {
//             axios
//                 .get(`/auth/allUsers`)
//                 .then((userRes) => {
//                     const users = userRes.data;
//                     $(`.messageContainer`).empty();
//                     for (let message of messageRes.data) {
//                         const user = users.find((el) => el._id === message.userId);
//                         if (user) {
//                             const transformedPath = user.path
//                                 .replace("public\\", "./")
//                                 .replace(/\\/g, "/");

//                             if (message.userId === userId) {
//                                 appendMessage(
//                                     "myMessage",
//                                     user.login,
//                                     message.message,
//                                     transformedPath,
//                                     chatToken,
//                                     message._id
//                                 );
//                             } else {
//                                 appendMessage(
//                                     "otherMessage",
//                                     user.login,
//                                     message.message,
//                                     transformedPath,
//                                     chatToken,
//                                     message._id
//                                 );
//                             }
//                         }
//                     }

//                     setTimeout(() => {
//                         $(".messageContainer").animate(
//                             { scrollTop: $(".messageContainer").prop("scrollHeight") },
//                             "fast"
//                         );
//                     }, 0);
//                 })
//                 .catch((err) => console.log(err));
//         })
//         .catch((err) => console.log(err));
// }

// showMainChatMessages(userId);

function notification(notification) {
    $(`.notificationContainer`).css("display", "flex");
    $(`.notificationText`).text(notification);
    setTimeout(() => {
        $(`.notificationContainer`).css("display", "none");
        $(`.notificationText`).text(``);
    }, 3000);
}

// function createChat(nameChat, userId, chatType, file) {
//     const formData = new FormData();
//     formData.append("nameChat", nameChat);
//     formData.append("userId", userId);
//     formData.append("chatType", chatType);
//     if (file) formData.append("file", file);

//     axios
//         .post(`/chat/createChat`, formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         })
//         .then((res) => {
//             notification(`Chat ${nameChat} created`);
//             $(`.addChatContainer`).css(`display`, `none`);
//             $(`.wrap`).css(`filter`, `brightness(1)`);
//             showChats();
//         })
//         .catch((error) => console.log(error));
// }

// $(`#addChatInput`).on(`input`, () => {
//     if (
//         $(`#newChatIcon`).css(`background-image`) !== "none" &&
//         $(`#newChatIcon`).css(`background-image`) !== ""
//     ) {
//         $(`#newChatIcon`).text(``);
//     } else {
//         if ($(`#addChatInput`).val().length > 0) {
//             $(`#newChatIcon`).text($(`#addChatInput`).val()[0].toUpperCase());
//         } else {
//             $(`#newChatIcon`).text(``);
//         }
//     }
// });

// let chatType = `public`;
// $(`#makeChatPrivateBtn`).click(() => {
//     if ($(`#makeChatPrivateBtn`).hasClass("fa-square")) {
//         $(`#makeChatPrivateBtn`).removeClass("fa-square").addClass("fa-square-check");
//         chatType = `private`;
//     } else if ($(`#makeChatPrivateBtn`).hasClass("fa-square-check")) {
//         $(`#makeChatPrivateBtn`).removeClass("fa-square-check").addClass("fa-square");
//         chatType = `public`;
//     }
// });


// $(`#addChatBtn`).click(() => {
//     axios.get(`/user/AllChats`)
//         .then((res) => {
//             let chatCreated = false;
//             if (Array.isArray(res.data)) {
//                 chatCreated = res.data.some((chat) => chat.chatName === $("#addChatInput").val());
//             }
//             if (chatCreated) {
//                 notification(`Chat ${$("#addChatInput").val()} already exists`);
//             } else if ($("#addChatInput").val().length > 27) {
//                 notification(`Chat name is too long`);
//             } else {
//                 createChat($("#addChatInput").val(), userId, chatType, file);
//                 $(`#addChatInput`).val(``);
//             }
//         })
//         .catch((err) => console.log(err));
// });

// function showChats() {
//     axios.get(`/auth/allUsers`)
//         .then((res) => {
//             $(`.chatContainer`).empty();
//             for (let user of res.data) {
//                 if (user._id == userId) {
//                     for (let chat of user.chats) {
//                         let chatId = chat;
//                         axios.get(`/chat/Allchats`).then((res) => {
//                             for (let chat of res.data) {
//                                 if (chat._id === chatId) {
//                                     if (chat.nameChat.includes(",")) {
//                                         let chatIcon = chat.nameChat.slice(0, 1).toUpperCase();
//                                         let usersArray = chat.nameChat.split(", ");
//                                         let remainingUsers = usersArray.filter((name) => name !== nameUser).join(", ");
//                                         $(".chatContainer").append(`
//                                             <div class="chat" id="${chat._id}">
//                                                 <p class="chatIcon" id="${chat._id}">${chatIcon}</p>
//                                                 <p class="chatName" id="${chat._id}">${remainingUsers}</p>
//                                             </div>
//                                         `);
//                                     } else {
//                                         let chatIcon;
//                                         if (chat.filename == `none`) {
//                                             chatIcon = chat.nameChat.slice(0, 1).toUpperCase();
//                                             $(".chatContainer").append(`
//                                                 <div class="chat" id="${chat._id}">
//                                                     <p class="chatIcon" id="${chat._id}">${chatIcon}</p>
//                                                     <p class="chatName" id="${chat._id}">${chat.nameChat}</p>
//                                                 </div>
//                                             `);
//                                         } else {
//                                             const chatIcon = chat.path.replace("public\\", "./").replace(/\\/g, "/");
//                                             $(".chatContainer").append(`
//                                                 <div class="chat" id="${chat._id}">
//                                                     <p class="chatIcon" id="${chat._id}" style="background-image: url(${chatIcon})"></p>
//                                                     <p class="chatName" id="${chat._id}">${chat.nameChat}</p>
//                                                 </div>
//                                             `);
//                                         }
//                                     }
//                                 }
//                             }
//                         });
//                     }
//                 }
//             }
//         })
//         .catch((err) => console.log(err));
// }

// showChats();

// function showMessages(chatId, userId) {
//     $(".messageContainer").empty();
//     axios.get(`/chat/Allchats`)
//         .then((res) => {
//             for (let chat of res.data) {
//                 if (chat._id === chatId) {
//                     for (let message of chat.messages) {
//                         axios.get(`/auth/allUsers`)
//                             .then((res) => {
//                                 const user = res.data.find((el) => el._id === (message.userId === userId ? userId : message.userId));
//                                 if (user) {
//                                     const transformedPath = user.path.replace("public\\", "./").replace(/\\/g, "/");
//                                     const messageType = message.userId === userId ? "myMessage" : "otherMessage";
//                                     appendMessage(messageType, user.login, message.message, transformedPath, chatId, message._id);
//                                     setTimeout(() => {
//                                         $(".messageContainer").animate(
//                                             { scrollTop: $(".messageContainer").prop("scrollHeight") },
//                                             "fast"
//                                         );
//                                     }, 0);
//                                 }
//                             });
//                     }
//                 }
//             }
//         });
// }

// $(`.chatContainer`).on(`click`, `.chat`, (e) => {
//     let ID = e.target.id;
//     axios.get(`/chat/Allchats`).then((res) => {
//         for (let chat of res.data) {
//             if (chat._id === ID) {
//                 $(`.nameChat`).text(`${chat.nameChat}`);
//                 localStorage.setItem("chatToken", ID);
//                 socket.emit("joinChat", ID);
//                 let numerUsers = chat.users.length;
//                 $(`#users`).removeClass(`usersOnline`).addClass(`numberUsers`);
//                 $(`.numberUsers`).text(`Number of users ${numerUsers}`);
//                 showMessages(ID, userId);
//             }
//         }
//     });
// });


// $(`.mainChat`).click(() => {
//     $(`.nameChat`).text(`Main Chat`);
//     localStorage.setItem("chatToken", `mainChat`);
//     $(`.sendMessageForm`).css(`display`, `flex`);
//     $(`.joinChatContainer`).css(`display`, `none`);
//     $(`#users`).removeClass(`numberUsers`);
//     $(`#users`).addClass(`usersOnline`);
//     $(`.usersOnline`).text(`Online ${connectionUser}`);
//     showMainChatMessages(userId);
// });


// $(`#searchInput`).on(`input`, () => {
//     if ($(`#searchInput`).val().length > 0) {
//         $(`.searchChatContainer`).css(`display`, `flex`);
//         $(`.mainChatContainer`).css(`display`, `none`);
//         axios.get(`/chat/Allchats`).then((res) => {
//             $(`.searchChatContainer`).empty();
//             for (let chat of res.data) {
//                 if (chat.nameChat.toLowerCase().includes($(`#searchInput`).val().toLowerCase())) {
//                     if (chat.filename == `none`) {
//                         let chatIcon = chat.nameChat.slice(0, 1).toUpperCase();
//                         $(`.searchChatContainer`).append(`
//                             <div class="searchChat" id="${chat._id}">
//                                 <p class="searchChatIcon" id="${chat._id}">${chatIcon}</p>
//                                 <p class="searchChatName" id="${chat._id}">${chat.nameChat}</p>
//                             </div>
//                         `);
//                     } else {
//                         const chatIcon = chat.path.replace("public\\", "./").replace(/\\/g, "/");
//                         $(`.searchChatContainer`).append(`
//                             <div class="searchChat" id="${chat._id}">
//                                 <p class="searchChatIcon" id="${chat._id}" style="background-image: url(${chatIcon})"></p>
//                                 <p class="searchChatName" id="${chat._id}">${chat.nameChat}</p>
//                             </div>
//                         `);
//                     }
//                 }
//             }
//         });
//     } else {
//         $(`.searchChatContainer`).css(`display`, `none`);
//         $(`.mainChatContainer`).css(`display`, `flex`);
//     }
// });

// $(`.searchChatContainer`).on(`click`, `.searchChat`, (e) => {
//     let ID = e.target.id;
//     axios.get(`/chat/Allchats`).then((res) => {
//         let chatFound = false;
//         for (let chat of res.data) {
//             if (chat._id === ID) {
//                 chatFound = true;
//                 $(`.nameChat`).text(`${chat.nameChat}`);
//                 localStorage.setItem("chatToken", ID);
//                 showMessages(ID, userId);
//                 $(`.sendMessageForm`).css(`display`, `none`);
//                 $(`.joinChatContainer`).css(`display`, `flex`);
//                 $(`.joinChatName`).text(chat.nameChat);
//             }
//         }
//         if (!chatFound) {
//             console.log("Chat not found");
//         }
//     });
// });

// $(`#joinChatBtn`).click(() => {
//     let chatToken = localStorage.getItem(`chatToken`);
//     if (chatToken) {
//         joinToChat(chatToken, userId);
//         $(`.sendMessageForm`).css(`display`, `flex`);
//         $(`.joinChatContainer`).css(`display`, `none`);
//         showChats();
//         $(`.mainChatContainer`).css("margin-top", "0");
//         $(`header`).css("width", "100px");
//         $(`.mainChat`).css("background-color", "#264653");
//         $(`.mainChat`).css("justify-content", "center");
//         $(`.mainChatIcon`).css("margin", "0");
//         $(`.mainChatName`).css("display", "none");
//         $(`.addChatBtn`).css("width", "65px");
//         $(`.menuBtnContainer`).css(`justify-content`, `center`);
//         $(`.menuBtnContainer`).css(`padding`, `0`);
//         $(`.accountContainer`).css(`display`, `none`);
//         $(`.settingBtn`).css(`justify-content`, `center`);
//         $(`.settingBtn`).css(`padding`, `0`);
//         $(`#MenuBtn`).addClass(`fa-bars`);
//         $(`#MenuBtn`).removeClass(`fa-xmark`);
//         $(`#searchInput`).css(`display`, `none`);
//         $(`.searchContainer`).css(`justify-content`, `center`);
//         $(`#searchBtn`).css(`width`, `65px`);
//         $(`#searchBtn`).css(`height`, `65px`);
//         $(`#searchBtn`).addClass(`openMenu`);
//         $(`#searchBtn`).removeClass(`search`);
//         $(`.settingsText`).css(`display`, `none`);
//         $(`.chat`).css("background-color", "#264653");
//         $(`.chat`).css("justify-content", "center");
//         $(`.chatIcon`).css("margin", "0");
//         $(`.chatName`).css("display", "none");
//         $(`.searchChat`).css("background-color", "#264653");
//         $(`.searchChat`).css("justify-content", "center");
//         $(`.searchChatIcon`).css("margin", "0");
//         $(`.searchChatName`).css("display", "none");
//     }
// });

// $('.messageContainer').on('click', '.message', (e) => {
//     let ID = e.currentTarget.id;
//     axios.get('/chat/Allchats')
//         .then((res) => {
//             for (let chat of res.data) {
//                 if (chat._id === localStorage.getItem('chatToken')) {
//                     for (let message of chat.messages) {
//                         if (message._id === ID) {
//                             axios.post(`/chat/deleteMessages`, { messageId: ID, chatId: localStorage.getItem('chatToken') })
//                                 .then(() => {
//                                     showMessages(localStorage.getItem('chatToken'), userId);
//                                     notification('Повідомлення видалено'); // Використовуйте notification замість console.log
//                                 })
//                                 .catch((error) => {
//                                     notification('Помилка при видаленні повідомлення: ' + (error.response ? error.response.data : error.message));
//                                 });
//                             return; // Додаємо return, щоб вийти з циклів
//                         }
//                     }
//                 }
//             }
//         });
// });