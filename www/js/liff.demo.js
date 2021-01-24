window.onload = function() {
    const defaultLiffId = "1655275883-ax5XoZAk";

    let myLiffId = "";

    myLiffId = defaultLiffId;
    initializeLiffOrDie(myLiffId);
}

/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        window.alert('LIFF ID error');
    } else {
        initializeLiff(myLiffId);
    }
}

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            window.alert(err);
        });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    if (!liff.isLoggedIn()) {
        liff.login({
            redirectUri: "https://a18ba203e215.ngrok.io/2021-klim-healthcoin"
        });
    } else {
        registerHandlers();
    }
}

function registerHandlers() {
    if (!liff.isInClient()) {
        sendAlertIfNotInClient();
    } else {
        liff.getFriendship().then(data => {
            if (data.friendFlag) {
                // user has friendship
                const accessToken = liff.getAccessToken();
                if (accessToken) {
                    $.ajax({
                        method: "POST",
                        url: "../2021-klim-healthcoin-api/picture",
                        headers: {
                            "Authorization": "Bearer " + accessToken
                        },
                        data: {
                            access_token:accessToken,
                            file:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
                        },
                        dataType: "json",
                        success: function (res) {
                            // liff.sendMessages([
                            //     {
                            //         'type':'text',
                            //         'text':''
                            //     }
                            // ])
                            // .catch(function(error) {
                            //     window.alert('Error sending message: ' + error);
                            // });
                            console.log(res)
                        },
                        error: function (res) {
                            console.log(res)
                        },
                        complete: function () {
                            // liff.closeWindow();
                        }
                    });
                } else {
                    window.alert('token error');
                }
            } else {
                liff.openWindow({
                    url: 'https://lin.ee/dw2zwyq',
                    external: true
                });
                liff.closeWindow();
            }
        })
        .catch((err) => {
            window.alert(err);
        });;
    }
}

function getProfile()
{
    liff.getProfile().then(function(profile) {
        return profile;
    }).catch(function(error) {
        window.alert('Error getting profile: ' + error);
    });
}

/**
* Alert the user if LIFF is opened in an external browser and unavailable buttons are tapped
*/
function sendAlertIfNotInClient() {
    alert('請使用LINE App 開啟!');
}
