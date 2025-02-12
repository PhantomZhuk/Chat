$(`#MenuBtn`).click(() => {
    if ($(`#MenuBtn`).hasClass(`fa-bars`)) {
        $(`.mainChatContainer`).css("margin-top", "10px");
        $(`header`).css("width", "300px");
        $(`.mainChat`).css("background-color", "#2d5362");
        $(`.mainChat`).css("justify-content", "flex-start");
        $(`.mainChatIcon`).css("margin", "10px");
        $(`.mainChatName`).css("display", "flex");
        $(`.addChatBtn`).css("width", "90%");
        $(`.menuBtnContainer`).css(`justify-content`, `space-between`);
        $(`.menuBtnContainer`).css(`padding`, `0 20px`);
        $(`.accountContainer`).css(`display`, `flex`);
        $(`.settingBtn`).css(`justify-content`, `flex-start`);
        $(`.settingBtn`).css(`padding`, `0 20px`);
        $(`#MenuBtn`).addClass(`fa-xmark`);
        $(`#MenuBtn`).removeClass(`fa-bars`);
        $(`#searchInput`).css(`display`, `flex`);
        $(`.searchContainer`).css(`justify-content`, `space-between`);
        $(`#searchBtn`).css(`width`, `40px`);
        $(`#searchBtn`).css(`height`, `40px`);
        $(`.settingsText`).css(`display`, `flex`);
        $(`.chat`).css("background-color", "#2d5362");
        $(`.chat`).css("justify-content", "flex-start");
        $(`.chatIcon`).css("margin", "10px");
        $(`.chatName`).css("display", "flex");
        $(`.searchChat`).css("background-color", "#2d5362");
        $(`.searchChat`).css("justify-content", "flex-start");
        $(`.searchChatIcon`).css("margin", "10px");
        $(`.searchChatName`).css("display", "flex");
    } else if ($(`#MenuBtn`).hasClass(`fa-xmark`)) {
        $(`.mainChatContainer`).css("margin-top", "0");
        $(`header`).css("width", "100px");
        $(`.mainChat`).css("background-color", "#264653");
        $(`.mainChat`).css("justify-content", "center");
        $(`.mainChatIcon`).css("margin", "0");
        $(`.mainChatName`).css("display", "none");
        $(`.addChatBtn`).css("width", "65px");
        $(`.menuBtnContainer`).css(`justify-content`, `center`);
        $(`.menuBtnContainer`).css(`padding`, `0`);
        $(`.accountContainer`).css(`display`, `none`);
        $(`.settingBtn`).css(`justify-content`, `center`);
        $(`.settingBtn`).css(`padding`, `0`);
        $(`#MenuBtn`).addClass(`fa-bars`);
        $(`#MenuBtn`).removeClass(`fa-xmark`);
        $(`#searchInput`).css(`display`, `none`);
        $(`.searchContainer`).css(`justify-content`, `center`);
        $(`#searchBtn`).css(`width`, `65px`);
        $(`#searchBtn`).css(`height`, `65px`);
        $(`#searchBtn`).addClass(`openMenu`);
        $(`#searchBtn`).removeClass(`search`);
        $(`.settingsText`).css(`display`, `none`);
        $(`.chat`).css("background-color", "#264653");
        $(`.chat`).css("justify-content", "center");
        $(`.chatIcon`).css("margin", "0");
        $(`.chatName`).css("display", "none");
        $(`.searchChat`).css("background-color", "#264653");
        $(`.searchChat`).css("justify-content", "center");
        $(`.searchChatIcon`).css("margin", "0");
        $(`.searchChatName`).css("display", "none");
    }
});

$(`#searchBtn`).click(() => {
    if ($(`#searchBtn`).hasClass(`openMenu`)) {
        $(`.mainChatContainer`).css("margin-top", "10px");
        $(`header`).css("width", "300px");
        $(`.mainChat`).css("background-color", "#2d5362");
        $(`.mainChat`).css("justify-content", "flex-start");
        $(`.mainChatIcon`).css("margin", "10px");
        $(`.mainChatName`).css("display", "flex");
        $(`.addChatBtn`).css("width", "90%");
        $(`.menuBtnContainer`).css(`justify-content`, `space-between`);
        $(`.menuBtnContainer`).css(`padding`, `0 20px`);
        $(`.accountContainer`).css(`display`, `flex`);
        $(`.settingBtn`).css(`justify-content`, `flex-start`);
        $(`.settingBtn`).css(`padding`, `0 20px`);
        $(`#MenuBtn`).addClass(`fa-xmark`);
        $(`#MenuBtn`).removeClass(`fa-bars`);
        $(`#searchInput`).css(`display`, `flex`);
        $(`.searchContainer`).css(`justify-content`, `space-between`);
        $(`#searchBtn`).css(`width`, `40px`);
        $(`#searchBtn`).css(`height`, `40px`);
        $(`.settingsText`).css(`display`, `flex`);
        $(`.chat`).css("background-color", "#2d5362");
        $(`.chat`).css("justify-content", "flex-start");
        $(`.chatIcon`).css("margin", "10px");
        $(`.chatName`).css("display", "flex");
        $(`.searchChat`).css("background-color", "#2d5362");
        $(`.searchChat`).css("justify-content", "flex-start");
        $(`.searchChatIcon`).css("margin", "10px");
        $(`.searchChatName`).css("display", "flex");
    } else if ($(`#MenuBtn`).hasClass(`fa-xmark`)) {
        console.log(`Search button clicked`);
    }
});

$(`.accountContainer`).click(() => {
    $(`.profileContainer`).css(`display`, `flex`);
    $(`.wrap`).css(`filter`, `brightness(0.7)`);
    $(`.addChatContainer`).css(`display`, `none`);
});

$(`.closeProfileBtn`).click(() => {
    $(`.profileContainer`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `brightness(1)`);
});

$(`.openChangeNameContainer`).click(() => {
    $(`.changeNameContainer`).css(`display`, `flex`);
    $(`.profileContainer`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `brightness(0.7)`);
    $(`.addChatContainer`).css(`display`, `none`);
});

$(`#cancelNameBtn`).click(() => {
    $(`.changeNameContainer`).css(`display`, `none`);
    $(`.profileContainer`).css(`display`, `flex`);
});

$(`.openChangeProfileImg`).click(() => {
    $(`.changeProfileImgContainer`).css(`display`, `flex`);
    $(`.profileContainer`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `brightness(0.7)`);
    $(`.addChatContainer`).css(`display`, `none`);
});

$(`.closeImgBtn`).click(() => {
    $(`.changeProfileImgContainer`).css(`display`, `none`);
    $(`.profileContainer`).css(`display`, `flex`);
});

$(`.selectFile`).click(() => {
    $(`#changeProfileImgInput`).click();
});

$(`.addChatBtn`).click(() => {
    $(`.addChatContainer`).css(`display`, `flex`);
    $(`.profileContainer`).css(`display`, `none`);
    $(`.changeProfileImgContainer`).css(`display`, `none`);
    $(`.changeNameContainer`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `brightness(0.7)`);
});

$(`.closeAddChatBtn`).click(() => {
    $(`.addChatContainer`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `brightness(1)`);
});

$(`.openChangeChatImg`).click(() => {
    $(`.changeChatImgContainer`).css(`display`, `flex`);
    $(`.addChatContainer`).css(`display`, `none`);
});

$(`.closeChatImgBtn`).click(() => {
    $(`.changeChatImgContainer`).css(`display`, `none`);
    $(`.wrap`).css(`filter`, `brightness(1)`);
});