(function (funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if (document.readyState === "complete") {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function (callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function () { callback(context); }, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({ fn: callback, ctx: context });
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);


docReady(function () {
    console.debug("docReady");
    var containerNode = document.getElementById("korahCcrChatContainer");
    if (!containerNode) {
        return;
    }
    try {
        customJsBeforeCcrBtnLoad();
        var orgId = getParameterByName('ccrOrgId') || containerNode.dataset.orgid;
        var localBaseUrl = containerNode.dataset.baseurl;
        if (typeof localBaseUrl == "string") {
            localBaseUrl = localBaseUrl.replace(/\/$/, "");
        } else {
            localBaseUrl = "";
        }
        var serverHost = containerNode.dataset.hosturl;

        var checkAvalUrl = serverHost + "ccrBtnAvailability.php";
        var isCheckCcrAvailability = containerNode.dataset.ischeckccravailability;

        const svrBaseUrl = serverHost + "ccr-btn-sdk/ccrBtn/";
        const svrTemplateUrl = svrBaseUrl + "ccrBtnTemplate.html";

        var templateHtml = "";
        //1. Read ccrBtn.html from remote ccrBtnTemplate.html
        getUrl(svrTemplateUrl, function () {
            if (this.readyState == 4 && this.status == 200) {
                templateHtml = this.responseText;
                // If need to check ccR avalability
                if (isCheckCcrAvailability == "true") {
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open("post", checkAvalUrl);
                    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xmlHttp.onload = function () {
                        if (xmlHttp.status === 200) {
                            var rsp = xmlHttp.responseText;
                            if (typeof rsp == "string") {
                                rsp = JSON.parse(rsp);
                            }

                            if (rsp && typeof rsp.rc != "undefined" && rsp.rc == 1) {
                                loadCcrBtnHtml(localBaseUrl, svrBaseUrl, serverHost, containerNode, templateHtml);
                            }
                        } else {
                            containerNode.parentNode.removeChild(containerNode);
                        }
                    };
                    xmlHttp.send(encodeURI('orgId=' + orgId));
                } else {
                    loadCcrBtnHtml(localBaseUrl, svrBaseUrl, serverHost, containerNode, templateHtml);
                }
            }
        });
    } catch (e) {
        console.log(e);
        containerNode.parentNode.removeChild(containerNode);
    }
});


function loadCcrBtnHtml(localBaseUrl, svrBaseUrl, hostUrl, node, templateHtml) {
    var htmlElemen = document.createElement("html");
    var i18ScriptTag = document.createElement('script');
    var localceScriptUrl = "/js/i18Locale.js";
    if (localBaseUrl) {
        localceScriptUrl = localBaseUrl + localceScriptUrl;
    } else {
        localceScriptUrl = getCurPageDir() + localceScriptUrl;
    }
    i18ScriptTag.setAttribute("type", "text/javascript");

    if (typeof svrBaseUrl == "string" && svrBaseUrl.trim() != "") {
        var baseTag = document.createElement('base');
        baseTag.setAttribute("href", svrBaseUrl);
        baseTag.setAttribute("target", "_blank");
    }
    getUrl(localceScriptUrl, function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                i18ScriptTag.innerHTML = this.responseText;
                htmlElemen.innerHTML = templateHtml;
                if (baseTag) {
                    if (htmlElemen.getElementsByTagName("head").length > 0) {
                        for (var i = 0; i < htmlElemen.getElementsByTagName("base").length; i++) {
                            htmlElemen.getElementsByTagName("head")[0].removeChild(htmlElemen.getElementsByTagName("base")[i]);
                        }
                        htmlElemen.getElementsByTagName("head")[0].appendChild(baseTag);
                    }
                }
                htmlElemen.appendChild(i18ScriptTag);
                node.contentDocument.removeChild(node.contentDocument.getElementsByTagName("html")[0]);
                node.contentDocument.appendChild(htmlElemen);
                loadScript(node.contentDocument, hostUrl + "ccr-btn-sdk/ccrBtn/js/util.js", function () {
                    loadScript(node.contentDocument, hostUrl + "ccr-btn-sdk/ccrBtn/js/ccrBtn.js", function () {
                        console.log("Script loaded.");
                    })
                });
            } catch (e) {
                console.error(e);
            }
        }
    })
}

function loadScript(document, url, callback) {
    /* Load script from url and calls callback once it's loaded */
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", url);
    if (typeof callback !== "undefined") {
        if (scriptTag.readyState) {
            /* For old versions of IE */
            scriptTag.onreadystatechange = function () {
                if (this.readyState === 'complete' || this.readyState === 'loaded') {
                    callback();
                }
            };
        } else {
            scriptTag.onload = callback;
        }
    }
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
}

function getUrl(url, onStateChange) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onreadystatechange = onStateChange;
    xhr.onerror = function (err) {
        console.error(err);
        onStateChange();
    }
    xhr.onloadend = function () {
        if (xhr.status == 404) {
            console.error(url + " not found.");
        }
    }
}

function customJsBeforeCcrBtnLoad() {
    //document.getElementById("korahCcrChatContainer").style.visibility = "hidden";
    //localStorage.removeItem('profile');
    //setTimeout(function () {
    //    var profileObjExample = {
    //        "email": "spoon@korahlimited.com",
    //        "name": "Stephen Poon",
    //        "given_name": "Stephen",
    //        "family_name": "Poon",
    //        "picture": "https://lh4.googleusercontent.com/-rHfVMRpYvAI/AAAAAAAAAAI/AAAAAAAAAHo/-Su0miUcROQ/photo.jpg",
    //        "gender": "male",
    //        "locale": "en",
    //        "nickname": "spoon",
    //        "user_metadata": { "empId": "EMP009" },
    //        "app_metadata": {},
    //        "email_verified": true,
    //        "clientID": "RjbIXT8VR0GPJkbM0E8Qeq75F0qb0296",
    //        "updated_at": "2018-11-08T01:12:12.720Z",
    //        "user_id": "google-oauth2|110531214788243406414",
    //        "identities": [{
    //            "provider": "google-oauth2",
    //            "user_id": "110531214788243406414",
    //            "connection": "google-oauth2",
    //            "isSocial": true
    //        }],
    //        "created_at": "2017-10-03T20:22:59.365Z",
    //        "empId": "EMP009",
    //        "sub": "google-oauth2|110531214788243406414"
    //    };
    //    var profileObj = {
    //        "email": "spoon@korahlimited.com",
    //        "given_name": "Stephen",
    //        "family_name": "Poon",
    //        "custId": "custId",
    //        "user_metadata": { "empId": "EMP009" },
    //    };
    //    var profileObjString = JSON.stringify(profileObj);
    //    localStorage.setItem('profile', profileObjString);
    //    console.log("LocalStorage set.");
    //    document.getElementById("korahCcrChatContainer").style.visibility = "visible";
    //}, 5000);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getCurPageDir() {
    var loc = window.location.pathname;
    return loc.substring(0, loc.lastIndexOf('/'));
}