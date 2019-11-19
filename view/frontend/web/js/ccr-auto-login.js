(function(){
    if (document.readyState === "complete" || document.readyState === "loaded") {
		bindIdentitySetter();
	} else {
		document.addEventListener("DOMContentLoaded", function(event) {
			bindIdentitySetter();
		});
	}
	
    function bindIdentitySetter() {

        var rootIframe = document.getElementById("korahCcrChatContainer");
        var rootContent = rootIframe.contentDocument || rootIframe.contentWindow.document;

        (function(){
            var fnc = rootContent.appendChild.bind(rootContent);
            rootContent.appendChild = function (arg) {
    
                // default appendChild
                fnc(arg);

                // overload action setter to provide user credentials
                var identityForm = rootContent.getElementById("korahCcrChatForm");
                (function(){
                    var rewriteAction = function (value) {
                        // for ie/safari compatibility
                        var tmp;
                        if ((tmp = value.split("?")) && tmp.length == 2) {
                            var url = tmp[0];
                            var queryString = tmp[1];

                            var obj = {};
                            var pairs = queryString.split("&");
							for(var i=0; i<pairs.length; i++) {
                                var pair = pairs[i].split("=", 2);
                                if (pair.length == 2) {
                                    obj[pair[0]] = pair[1];
                                }
							}
                            obj.firstName = ccrobot_instance.identity.firstName;
                            obj.lastName = ccrobot_instance.identity.lastName;
                            obj.phone = ccrobot_instance.identity.phone;
                            obj.email = ccrobot_instance.identity.email;
                            if (ccrobot_instance.identity.firstName && ccrobot_instance.identity.lastName && ccrobot_instance.identity.email) {
                                obj.isShowUsrModal = false;
                            }
                            tmp = [];
                            for (var key in obj) {
                                tmp.push(key + "=" + obj[key]);
                            }
                            return url += "?" + tmp.join("&");
                        }
                        return value;
                    };
                    // overload both action setter and setAttribute for action
                    (function(){
                        var fnc = identityForm.setAttribute.bind(identityForm);
                        identityForm.setAttribute = function(key, value){
                            if(key == "action"){
                                value = rewriteAction(value);
                            }
                            fnc(key, value);
                        }
                    })();
                    (function(){
                        Object.defineProperty(identityForm, "action", {
                            get: function(){
                                return identityForm.getAttribute("action");
                            },
                            set: function(value){
                                identityForm.setAttribute("action", rewriteAction(value));
                            }
                        });
                    })();
                })();
            };
        })();
    }
})();