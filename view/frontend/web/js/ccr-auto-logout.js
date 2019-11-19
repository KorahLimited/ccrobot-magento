// overload the setAttribute property of the user identity form to immediately submit a logout request
(function(){
    if (document.readyState === "complete" || document.readyState === "loaded") {
		bindActionMutator();
	} else {
		document.addEventListener("DOMContentLoaded", function(event) {
			bindActionMutator();
		});
	}
	localStorage.setItem(document.getElementById("korahCcrChatContainer").dataset.orgid+".korahlimitedOpen", "false");
	
	function bindActionMutator() {
		var rootIframe = document.getElementById("korahCcrChatContainer");
        var rootContent = rootIframe.contentDocument || rootIframe.contentWindow.document;

        (function(){
            var fnc = rootContent.appendChild.bind(rootContent);
            rootContent.appendChild = function (arg) {

                // default appendChild
                fnc(arg);

                // rewrite the action to end chat
                // this should only occur the first time the action is set
                var identityForm = rootContent.getElementById("korahCcrChatForm");
                (function(){
                    var fnc = identityForm.setAttribute.bind(identityForm);
                    identityForm.setAttribute = function(key, value){
                        if(key == "action"){
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
								obj.end = true;
								tmp = [];
								for (var k in obj) {
									tmp.push(k + "=" + obj[k]);
								}
								value = url += "?" + tmp.join("&");
							}
                            fnc(key, value);
							console.log(identityForm);
                            identityForm.submit();
                            identityForm.setAttribute = fnc; // reset to default action once logout form is submitted
                        }
                        else{
                            fnc(key, value);
                        }
                    };
                })();
            };
        })();
	}

})();