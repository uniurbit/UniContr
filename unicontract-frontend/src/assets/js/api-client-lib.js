/**
 * Created by Jacopo Penazzi on 08/06/2016.
 * @module USIGN_JS
 */

/**
 *
 * @namespace
 */

var messages = [];
messages['IT'] = [];
messages['EN'] = [];
messages['IT']["request_otp_wait_message"] = "Attendi";
messages['EN']["request_otp_wait_message"] = "Please wait";
messages['IT']["request_otp_wait_time"] = "secondi per un nuovo OTP";
messages['EN']["request_otp_wait_time"] = "seconds to request new OTP";
messages['IT']["request_otp"] = "Richiesta OTP";
messages['EN']["request_otp"] = "Request OTP";
messages['IT']["send"] = "Invia";
messages['EN']["send"] = "Send";
messages['IT']["pin_label"] = "PIN";
messages['EN']["pin_label"] = "PIN";
messages['IT']["pin"] = "PIN OBBLIGATORIO";
messages['EN']["pin"] = "PIN REQUIRED";
messages['IT']["password_label"] = "PASSWORD DEL CERTIFICATO";
messages['EN']["password_label"] = "CERTIFICATE PASSWORD";
messages['IT']["password"] = "PASSWORD DEL CERTIFICATO OBBLIGATORIO";
messages['EN']["password"] = "CERTIFICATE PASSWORD REQUIRED";
messages['IT']["otp_label"] = "OTP";
messages['EN']["otp_label"] = "OTP";
messages['IT']["otp"] = "OTP OBBLIGATORIO";
messages['EN']["otp"] = "OTP REQUIRED";
messages['IT']["CONFIRMA_ERROR_0"] = "Errore Generico";
messages['EN']["CONFIRMA_ERROR_0"] = "Generic Error";
messages['IT']["CONFIRMA_ERROR_20"] = "PIN Errato";
messages['EN']["CONFIRMA_ERROR_20"] = "Wrong PIN";
messages['IT']["CONFIRMA_ERROR_21"] = "OTP Errato";
messages['EN']["CONFIRMA_ERROR_21"] = "Wrong OTP";
messages['IT']["CONFIRMA_ERROR_22"] = "PIN Errato";
messages['EN']["CONFIRMA_ERROR_22"] = "Wrong PIN";
messages['IT']["CONFIRMA_ERROR_20_ARUBA"] = "PASSWORD DEL CERTIFICATO errata";
messages['EN']["CONFIRMA_ERROR_20_ARUBA"] = "Wrong CERTIFICATE PASSWORD";
messages['IT']["CONFIRMA_ERROR_22_ARUBA"] = "PASSWORD DEL CERTIFICATO errata";
messages['EN']["CONFIRMA_ERROR_22_ARUBA"] = "Wrong CERTIFICATE PASSWORD";


var USIGN_JS = USIGN_JS || {};

(function(ns, window) {

	var postMessageValidity = 3000;
	var timeoutInterval = 100;
	
    var document = window.document;
    
    

    var BASE_URL = 'https://uniurb.webfirma.cineca.it/my-web-firma' ;
    var API_URL =  "/sdk/";
    var OTP_API_URL =   '/api/public/sendOtp/'; //"http://localhost:8080/api/public/sendOtp/";

    var OTP_API_FEA_URL =   '/api/public/sendFilesToFEA/'; //"http://localhost:8080/api/public/sendOtp/";
    var OTP_API_ARUBA_URL = '/api/public/sendArubaOtp';
    var SIGN_API_URL =  '/api/public/signProcess/'; //"http://localhost:8080/api/public/signProcess/";

    var CERT_OTP_URL = '/api/public/certificato/otpType/';

    var OPENED_WINDOWS = {};
    
    var MESSAGE_QUEUE = {};

    var REGISTERED_CALLBACKS = {
        "default_callback": {success: defaultSuccessCallback, error: defaultErrorCallback}
    };

    var SDK_CONFIG = {
        'console.log_mode': false,
        'iframe': false,
        'iframeParent': null,
        'loadingPage': false,
        'otpType': '',
        'language':'EN',
        'BASE_URL' : BASE_URL,
        'API_URL' : BASE_URL + API_URL,
        'OTP_API_URL': BASE_URL + OTP_API_URL,
        'OTP_API_FEA_URL': BASE_URL + OTP_API_FEA_URL,
        'OTP_API_ARUBA_URL': BASE_URL + OTP_API_ARUBA_URL,
        'SIGN_API_URL': BASE_URL + SIGN_API_URL,
        'CERT_OTP_URL': BASE_URL + CERT_OTP_URL,
        'event_listener': null
    };
    
    var BooleanValue = {
        random: function () {
            var num = Math.floor(Math.random() * 2) + 1;
            return ( num % 2 == 0 ? this.TRUE : this.FALSE );
        },
        TRUE: true,
        FALSE: false
    };

    /**
     * @namespace
     */
    var SDK = {};

    var OTP = {
        messageSrc: null,
        srcOrigin: null,
        processOTP: fn_processOTP,
        requestOTP: fn_requestOTP,
        processArubaPin: fn_processArubaPin,
        checkFEASignature: fn_checkFEASignature,
        checkPlaceHolderSignature: fn_checkPlaceHolderSignature,
        commandArgs: {},
        isChromeUserAgent: isChromeUserAgent
    };
    
    initSDK(document);

    /**
     * Initializes the API client object.
     * 
     * @param {object} document - the HTML document object
     */
    function initSDK(document) {
        var body = document.body;

        SDK = {
            //namespace: namespace,
            config: SDK_CONFIG,
            init: fn_init,
            doGet: fn_doGet,
            doPost: fn_doPost,
            doPut: fn_doPut,
            doDelete: fn_doDelete,
            requestAndProcessOTP: fn_requestAndProcessOTP,
            requestPlaceHolder: fn_requestPlaceHolder,
            OTP: OTP
            //callbackTask: callbackTask,
            //callbackTaskWithPopup: OTP_Init,
            //callbackTaskWithIframe: OTP_Init
        };

        window.SDK = SDK;
        //ns.SDK = SDK;
        //window.USIGN_JS = ns;

                    
        // attach listener for Window's Messaging Communication
        fn_registerEventListener('default');
        console.log('initSDK Called', SDK);
        // execute on host page body.onload
        body.onload = function () {
            // init callback ( entry point for client configuration data (eg. tokens, api keys, etc..))
        	//$("#otpForm").hide();
        	//$("#waitingForm").show();
            window.initAsync();
            console.log('init', SDK.config.language);
        };
    }

    // --------------- DEMO FUNCTIONS ---------------- //

    function callbackTask(data, successCallback, errorCallback) {
        console.log("callbackTask called with timeout: " + data.timeout);
        setTimeout(function () {
            if (BooleanValue.random()) {
                data.value = "Task completed";
                successCallback.apply(this, [data]);
            }
            else {
                var error = {
                    message: "Task failed"
                };
                errorCallback.apply(this, [error]);
            }
        }, data.timeout);
    }

    // -------------- HELPER FUNCTIONS ----------------- //
    function OTP_Init(payload, config, successCallback, errorCallback) {
        console.log("[OTP_Init] payload: ", payload);
        
        // 1) define command
    	var command_name = "otp";
        var window_name = command_name;
    	//console.log('[OTP_Init] successCallback', successCallback);
    	//console.log('[OTP_Init] errorCallback', errorCallback);
        // 2) register command's callbacks
        registerCallBacks(command_name, successCallback, errorCallback);
        // var provider = OPENED_WINDOWS[window_name]['provider'];
        var provider = null;
        // console.log('test', OPENED_WINDOWS["opts"]);
        if (config && config.provider) {
        	provider = config.provider;
        }
        if (config && config.language) {
        	SDK.config.language = config.language;
        }

        var otp_form_url ='';
        if (provider && provider.match(".*ARUBA.*")) {
        	otp_form_url = "aruba_otp_form.html";
        } else {
        	otp_form_url = SDK.config.FORM_URL + "infocert_otp_form.html";
        }

        // 3) open window to execute command
        var window_config = {
            otp_form_url: otp_form_url,
            iframe: false,
            iframeParent: null
        };
        
        // overrides default settings
        window_config = extend(window_config, config);

        var win_ref = openWindow(window_name, window_config);

        // 4) communicate with opened window, passing also arguments for command_name if needed
    	postMessage(win_ref, command_name, {
            process_token: (payload.process_token || null),
            auth_token: (payload.auth_token || null),
            otpType: (payload.otpType || null),
            language: SDK.config.language,
            timeout: postMessageValidity
        });
    }

    function OTP_Aruba_Init(payload, config, successCallback, errorCallback) {
        console.log("[OTP_Aruba_Init] payload: ", payload);
        // 1) define command
        var command_name = "otp_aruba";
        window_name = "otp";
        // 2) register command's callbacks
        console.log('[OTP_Aruba_Init] - successCallback', successCallback);
        console.log('[OTP_Aruba_Init] - errorCallback', errorCallback);
        registerCallBacks(command_name, successCallback, errorCallback);

        if (config && config.language) {
        	SDK.config.language = config.language;
        }
        // 3) open window to execute command
        var window_config = {
            otp_form_url: 'req_otp_aruba.html',
            language: config.language,
            iframe: false,
            iframeParent: null
        };
        
        // overrides default settings
        window_config = extend(window_config, config);
        var win_ref = openWindow(window_name, window_config);
        // 4) communicate with opened window, passing also arguments for command_name if needed
    	postMessage(win_ref, command_name, {
            process_token: (payload.process_token || null),
            language: config.language,
            timeout: postMessageValidity
        });

    }
    
    function loadingPage(config) {
    	initSDK(document);
    	var window_config = {
            otp_form_url: 'loadingPage.html',
        };

        // overrides default settings
        window_config = extend(window_config, config);
        var win_ref = openWindow("otp", window_config);
    }
    
    function OTP_FEA_Init(payload, config, successCallback, errorCallback) {
        console.log("[OTP_FEA_Init] payload: ", payload);

        // 1) define command
        var command_name = "fea";
    	var window_name = "otp";

        // 2) register command's callbacks
        registerCallBacks(command_name, successCallback, errorCallback);
        if (config && config.language) {
        	SDK.config.language = config.language;
        }
        // 3) open window to execute command
        var window_config = {
            otp_form_url: 'req_otp_fea.html',
            iframe: false,
            iframeParent: null
        };
        
        // overrides default settings
        window_config = extend(window_config, config);
        fn_registerEventListener('fea');

        var win_ref = openWindow(window_name, window_config);

        // 4) communicate with opened window, passing also arguments for command_name if needed
    	postMessage(win_ref, command_name, {
            process_token: (payload.process_token || null),
            language: config.language,
            timeout: postMessageValidity
        });
    }
    
    function SIGNATURE_PlaceHolder_Init(payload, config, successCallback, errorCallback) {
                console.log("[SIGNATURE_PlaceHolder_Init] payload: ", payload);

        // 1) define command
        var command_name = "signature_ph"; 
        var window_name = "signature_ph";

        // 2) register command's callbacks
        registerCallBacks(command_name, successCallback, errorCallback);
        if (config && config.language) {
        	SDK.config.language = config.language;
        }
        // 3) open window to execute command
        var window_config = {
            otp_form_url: 'req_signaturePlaceHolder.html',
            iframe: false,
            iframeParent: null
        };
        
        // overrides default settings
        window_config = extend(window_config, config);
        fn_registerEventListener('signature_ph');

        var win_ref = openWindow(window_name, window_config);

        // 4) communicate with opened window, passing also arguments for command_name if needed
    	postMessage(win_ref, command_name, {
            process_token: (payload.process_token || null),
            language: config.language,
            fileId: (payload.fileId || null),
            timeout: postMessageValidity
        });       
    }

    /**
     * Registers an array of window's listeners for certains events
     * 
     * @param {array|string} listeners - an array of listener names, or a single one as follows: ['OTP','FOO'] or 'OTP' 
     */
    function registerListeners( listeners ) {
        if ( listeners !== null && listeners !== undefined ) {
            if ( typeof listeners === 'object' ) {
                if ( Object.prototype.toString.call( listeners ) === '[object Array]') {
                    listeners.forEach( function( cur_listener ) {
                        fn_registerEventListener(cur_listener);
                    });
                }
                else {
                    error("[registerListeners] listeners must be an Array or a single String, received: ", listeners);
                }
            }
            else if ( typeof listeners === 'string' ) {
                fn_registerEventListener( listeners )
            }
            else {
                // do nothing.
                console.log("[registerListeners] can't register listeners: ", listeners);
            }
        }

    }

    /**
     * Register a window's listener.
     * Actually only OTP and DEFAULT listener names (types) are supported.
     * 
     * @param {string} listenerType - the listener type to register
     */
    function fn_registerEventListener( listenerType ) {
        if ( listenerType != undefined ) {
            var listenerName = listenerType.toUpperCase();
            if ( listenerName === "OTP" ) { // listener for OTP Submit form page
                if (window.addEventListener) { // all browsers except IE
                    window.addEventListener("message", otp_receivedMessage, false);
                } else { // IE
                    window.attachEvent("message", otp_receivedMessage);
                }
            } else if (listenerName === "FEA") {
                if (window.addEventListener) { // all browsers except IE
                    window.addEventListener("message", fea_receivedMessage, false);
                } else { // IE
                    window.attachEvent("message", fea_receivedMessage);
                }
            } else if (listenerName === "SIGNATURE_PH") {
                if (window.addEventListener) { // all browsers except IE
                    window.addEventListener("message", signature_ph_receivedMessage, false);
                } else { // IE
                    window.attachEvent("message", signature_ph_receivedMessage);
                }
            } else if ( listenerName === "DEFAULT" ) {  // default listener
                // attach listener for Window's Messaging Communication
                if (window.addEventListener) { // all browsers except IE
                    window.addEventListener("message", messageHandler, false);
                } else { // IE
                    window.attachEvent("message", messageHandler);
                }
            }
            else {
                // do nothing.
            }
        }
    }

    /**
     * Callback function called when messageHandler receives 'otp_callback' command.
     * 
     * @param {object} payload - a JSON payload containing the OTP handler response 
     */
    function otp_callback(payload) {
        console.log("[otp_callback] payload: " + JSON.stringify(payload));
        
        var task = "otp";

        if (payload && payload.language) {
        	SDK.config.language = payload.language;
        }
        setLanguage(SDK.config.language);
        var callbacks = getCallbacksForTask(task, true);
        console.log('callbacks otp', callbacks);
        if (payload.op && payload.op == 'requestOTP') {
        	console.log('Request OTP');
        	var config = {
                headers : {
                    "Content-Type" : "application/json"
                }
            };
        	var newPayload = {
        			token: payload.token,
                    auth_token: payload.auth_token,
        			provider: payload.provider,
        			otpType: payload.otpType
        	};
        	fn_requestAndProcessOTP(newPayload, config, callbacks.success, callbacks.error);
        } else {
        	var json = JSON.parse(payload.data);
            if (json.code === 200) {
            	closeWindow(task);
                callbacks.success.apply(this, [json]);
            }
            else {
        		// callbacks.error.apply(this, [json]);
        		if (json.description !== 'CONFIRMA_ERROR_0'
        			&& json.description !== 'CONFIRMA_ERROR_20'
    				&& json.description !== 'CONFIRMA_ERROR_21'
    				&& json.description !== 'CONFIRMA_ERROR_22') {
        			callbacks.error.apply(this, [json]);
        			closeWindow(task);
        		}
            }
        }
        
    }

    function aruba_pin_callback(payload) {
        console.log("[aruba_pin_callback] payload: " + JSON.stringify(payload));

        var task = "otp_aruba";
        
        if (payload && payload.language) {
        	SDK.config.language = payload.language;
        }
    	setLanguage(SDK.config.language);

        var callbacks = getCallbacksForTask(task, true);
        console.log('[aruba_pin_callback] callbacks', callbacks);
        var json = payload.data;
        if (payload.otpType) {
        	SDK.OTP.commandArgs.otpType = payload.otpType;
        }
        
        if (json.code === 200) {
            // callbacks.success.apply(this, [json]);
            if (!SDK.config.iframe || SDK.config.iframe == false) {
            	console.log('close window');
        		closeWindow("otp");
            }
            fn_requestArubaOTPAndSign(payload, SDK.config, callbacks.success, callbacks.error);
        }
        else {
        	console.log('sono qui e dovrei mostrare l\'errore');
        	var errore = "<span id='" + json.description + "'>Password CERTIFICATO Errata/Wrong CERTIFICATE Password</span>";
        	submitError(errore);
			setLanguageValue(json.description + "_ARUBA", SDK.config.language ? SDK.config.language : "EN");
    		// callbacks.error.apply(this, [json]);
    		// closeWindow(task);
        }
    }

    function fea_callback(payload) {
        console.log("[fea_callback] payload: " + JSON.stringify(payload));

        var task = "fea";

        if (payload && payload.language) {
        	SDK.config.language = payload.language;
        }
        setLanguage(SDK.config.language);
        closeWindow(task);

        var callbacks = getCallbacksForTask(task, true);


        if (payload.data.code === 200) {
            callbacks.success.apply(this, [payload.data]);
        }
        else {
            callbacks.error.apply(this, [payload.data]);
        }
    }
    
    function signature_ph_callback(payload) {
        console.log("[signature_ph_callback] payload: " + JSON.stringify(payload));

        var task = "signature_ph";

        if (payload && payload.language) {
        	SDK.config.language = payload.language;
        }
        setLanguage(SDK.config.language);
        closeWindow(task);

        var callbacks = getCallbacksForTask(task, true);


        if (payload.data.code === 200 || payload.data.code === '200' || payload.data.code === 205 || payload.data.code === '205') {
            callbacks.success.apply(this, [payload.data]);
        }
        else {
            callbacks.error.apply(this, [payload.data]);
        }
    }


    /*
     function namespace(ns_string) {
     var parts = ns_string.split(".");
     var parent = SDK,
     i;

     if(parts[0] === "SDK") {
     parts = parts.slice(1);
     }

     for(i=0; i<parts.length; i=+1) {
     if( typeof parent[parts[i]] === undefined ) {
     parent[parts[i]] = {};
     }
     parent = parts[i];
     }
     return parent;
     };
     */

    //FIXME

    /*
     payload : {
     token: "token"
     }
     */
    /**
     * Requests a One Time Password for the sign process and handles the user submission.
     * @param {object} payload - a JSON object containing the process token: <br><pre>{ 
     *     'token': '12345690abcde'
     * }
     * </pre>
     * @param {object} config - a JSON object contaning configuration settings. Allowed settings are: 
     * <ul>
     * <li>headers: a JSON object defining the request's HTTP Headers</li>
     * </ul>
     * @param {function} successCallback - callback function to invoke in case of success
     * @param {function} errorCallback - callback function to invoke in case of error
     */
    function fn_requestAndProcessOTP(payload, config, successCallback, errorCallback) {
        // FIXME: url default
        var OTP_URL = config.api_url || SDK.config.OTP_API_URL;

        OTP_URL = ( OTP_URL.slice(-1) == '/' ? OTP_URL : OTP_URL + '/' );

        var headers = {
            "Content-Type": "application/json",
            "Authorization": payload.auth_token
        };
        headers = extend(headers, config.headers || {});

        var requestPayload = extend({token: ''}, payload || {});
        registerCallBacks("requestAndProcessOTP", successCallback, errorCallback);
        var processToken = requestPayload.token;
        console.log(" [fn_requestAndProcessOTP]: PROCESS_TOKEN: " + processToken);
        console.log(" [payload]: ", payload);

        var requestedUrl = OTP_URL + processToken;
        if (configValue('iframe') == true && SDK.config.loadingPage == true) {
        	var loadingPage_config = {
            		'language': SDK.config.language,
                    'iframe': configValue('iframe'),
                    'iframeParent': configValue('iframeParent'),
                    'modal_show_func': configValue('modal_show_func')
            };
            loadingPage(loadingPage_config);
        }
        if (!payload.provider) {
	        // retrieve certificate issuer by token
	        fn_doGet( SDK.config.CERT_OTP_URL + processToken, 
                headers,
                function(xhr) { // SUCCESS CALLBACK
                    var response = JSON.parse(xhr.response);
                    var provider = response.provider;
                    var otpType = response.otpType;
                    console.log("provider: " + provider);
                    console.log("otpType: " + otpType);
                    
                    provider = (provider !== undefined ? provider.toUpperCase() : null );
                    otpType = (otpType !== undefined ? otpType.toUpperCase() : null );
                    console.log("provider: " + provider);
                    if ( provider.indexOf('ARUBA') > -1
                            && otpType.indexOf('TAPL') == -1
                            && otpType.indexOf('THWD') == -1) {
                    		manageSMSAruba(config, provider, otpType, processToken, successCallback, errorCallback)
                    } else if (provider.indexOf('FEA') > -1) {
                    console.log("------- FEA provider");
                    
                    if ( config.otp_form_url ) { // if client provided its own OTP FORM submit implementation, let's use it
                        otp_config.otp_form_url = config.otp_form_url;
                    }
                    if ( config.iframe == true ) { // overrides IFRAME settings if necessary
                    	otp_config.language = SDK.config.language;
                        otp_config.iframe = config.iframe;
                        otp_config.iframeParent = config.iframeParent;
                        otp_config.modal_show_func = config.modal_show_func;
                    }

                    var pin_payload = {
                            'process_token': processToken,
                    };
                    fn_requestFEAOTPAndSign(pin_payload, 
                            config, 
                            function(resp) {    /* success callback: request OTP and open form to sign */
                                console.log('CallBack FEA_init', resp);
                                var payloadOTP = {
                                    'process_token' : resp.token,
                                    'successCallback': successCallback,
                                    'errorCallback': errorCallback
                                        
                                };
                                successCallback(resp);
                            },
                            errorCallback);
                } else {
                    // INFOCERT or ARUBA with TOKEN
                    console.log("------------------ INFOCERT provider or ARUBA MOBILE");
                    config.provider = provider;
                    config.language = SDK.config.language;
                    fn_signProcess(requestedUrl, headers, requestPayload, config, successCallback, errorCallback);
                }
            },
            function(xhr) { // ERROR_CALLBACK
                console.error(xhr.response);
        		errorCallback('ACTIVE_CERTIFICATE_NOT_FOUND');
            }
        );
        } else if (payload.provider == 'infocert') {
        	console.log("------------------ INFOCERT provider or ARUBA MOBILE");
            config.provider = payload.provider;
            config.language = SDK.config.language;
            fn_signProcess(requestedUrl, headers, requestPayload, config, successCallback, errorCallback);
        } else if (payload.provider == 'aruba' && payload.otpType == 'SMS') {
        	manageSMSAruba(config, payload.provider, payload.otpType, processToken, successCallback, errorCallback);
        }
    }
    
    function manageSMSAruba(config, provider, otpType, processToken, successCallback, errorCallback) {
    	// ARUBA provider and NOT token otp --> should be SMS or ARUBACALL
        console.log("------- ARUBA provider");
        console.log("------------------ ARUBA SMS or ARUBACALL");
            
        //  prepara form per raccolta PIN
        SDK.config.tipoOtp = otpType;
        var otp_config = {
        		'language': SDK.config.language,
        		'provider': provider,
                'iframe': configValue('iframe'),
                'iframeParent': configValue('iframeParent'),
                'modal_show_func': configValue('modal_show_func')
        };
        
        if ( config.otp_form_url ) { // if client provided its own OTP FORM submit implementation, let's use it
            otp_config.otp_form_url = config.otp_form_url;
        }

        if ( config.iframe == true ) { // overrides IFRAME settings if necessary
            otp_config.iframe = config.iframe;
            otp_config.iframeParent = config.iframeParent;
            otp_config.modal_show_func = config.modal_show_func;
        }

        var pin_payload = {
                'process_token': processToken
        };
      
        //open PIN form submission
        OTP_Aruba_Init(pin_payload, 
                otp_config,
                successCallback,
        		errorCallback
        );
    }
    
    /**
     * Requests a One Time Password for the sign process and handles the user submission.
     * @param {object} payload - a JSON object containing the process token: <br><pre>{ 
     *  'token': '12345690abcde'
     * }
     * </pre>
     * @param {object} config - a JSON object contaning configuration settings. Allowed settings are: 
     * <ul>
     * <li>headers: a JSON object defining the request's HTTP Headers</li>
     * </ul>
     * @param {function} successCallback - callback function to invoke in case of success
     * @param {function} errorCallback - callback function to invoke in case of error
     */
    function fn_requestPlaceHolder(payload, config, successCallback, errorCallback) {
        console.log('chiamata fn_requestPlaceHolder');
        
        /*
        // FIXME: url default
        var PDF_URL = config.PDF_URL || SDK.config.PDF_URL;

        PDF_URL = ( PDF_URL.slice(-1) == '/' ? PDF_URL : PDF_URL + '/' );
        */
        var headers = {
            "Content-Type": "application/json"
        };
        headers = extend(headers, config.headers || {});

        var requestPayload = extend({token: '', fileId: 0}, payload || {});

        var processToken = requestPayload.token;
        console.log(" [fn_requestPlaceHolder]: PROCESS_TOKEN: " + processToken);

        var fileId = requestPayload.fileId;
        console.log(" [fn_requestPlaceHolder]: FILE_ID: " + fileId);

        // var requestedUrl = PDF_URL + processToken + "?fileId=" + fileId;
        var otp_config = {
                'iframe': configValue('iframe'),
                'iframeParent': configValue('iframeParent'),
                'modal_show_func': configValue('modal_show_func')
        };
        if ( config.otp_form_url ) { // if client provided its own OTP FORM submit implementation, let's use it
            otp_config.otp_form_url = config.otp_form_url;
        }
        if ( config.iframe == true ) { // overrides IFRAME settings if necessary
            otp_config.iframe = config.iframe;
            otp_config.iframeParent = config.iframeParent;
            otp_config.modal_show_func = config.modal_show_func;
        }

        var payload = {
                'process_token': processToken,
                'fileId': fileId
        };
        SIGNATURE_PlaceHolder_Init(payload, config, successCallback, errorCallback);
        /*
        fn_requestSignaturePlaceHolder(pin_payload, 
                config, 
                function(resp) {
                    console.log('CallBack SIGNATURE_PH_init', resp);
                    var payloadOTP = {
                            'process_token' : resp.token,
                            'process_fileId' : resp.fileId,
                            'signaturePage' : resp.signaturePage,
                            'signatureWidth' : resp.signatureWidth,
                            'signatureHeight' : resp.signatureHeight,
                            'signatureLeft' : resp.signatureLeft,
                            'signatureTop' : resp.signatureTop,
                            'successCallback': successCallback,
                            'errorCallback': errorCallback
                    };
                    successCallback(resp);
                },
                function(xhr) { // ERROR_CALLBACK
                    console.error(xhr.response);
                    errorCallback();
                }
            );
        */
    }
    
    
    // handles PIN and OTP submission for the SIGNATURE PROCESS
    function fn_signProcess(requestedUrl, headers, requestPayload, config, successCallback, errorCallback) {

        // call backend API OTP request
        fn_doPost(
            requestedUrl,
            {},
            headers,
            function (xhr) { // POST success callback

                var otp_payload = {
                    'process_token': requestPayload.token,
                    'auth_token': requestPayload.auth_token
                };

                var otp_config = {
                	'provider': config.provider,
                	'language': config.language,
                    'iframe': configValue('iframe'),
                    'iframeParent': configValue('iframeParent'),
                    'modal_show_func': configValue('modal_show_func')
                };
                if ( config.otp_form_url ) { // if client provided its own OTP FORM submit implementation, let's use it
                    otp_config.otp_form_url = config.otp_form_url;
                }

                if ( config.iframe == true ) { // overrides IFRAME settings if necessary
                    otp_config.iframe = config.iframe;
                    otp_config.iframeParent = config.iframeParent;
                    otp_config.modal_show_func = config.modal_show_func;
                }

                // on success completion open OTP and PIN page submission
                OTP_Init(otp_payload, otp_config, successCallback, errorCallback);

                // if iframe-mode we have to tell to client function to show it inside a modal window
                if (otp_config.iframe && ( typeof otp_config.modal_show_func != 'undefined' )) {
                    var modal_show_func = otp_config.modal_show_func;
                    modal_show_func();
                }

            },
            function (xhr) { // POST errorCallback
                errorCallback(xhr.response);
            }
        );
    }
    
    /**
     * Request an FEA OTP using user's PIN and open a form to handle the signature
     * @param {object} payload - a JSON object containing the process token: <br><pre>{ 
     *  'token': '12345690abcde'
     * }
     * </pre>
     * @param {object} config - a JSON object contaning configuration settings. Allowed settings are: 
     * <ul>
     * <li>headers: a JSON object defining the request's HTTP Headers</li>
     * </ul>
     * @param {function} successCallback - callback function to invoke in case of success
     * @param {function} errorCallback - callback function to invoke in case of error
     */
    function fn_requestFEAOTPAndSign(payload, config, successCallback, errorCallback) {
       console.log("[fn_requestFEAOTPAndSign] payload: " + JSON.stringify(payload) );
        var OTP_URL = config.api_url || SDK.config.OTP_API_FEA_URL;

        OTP_URL = ( OTP_URL.slice(-1) == '/' ? OTP_URL : OTP_URL + '/' );

        var headers = {
            "Content-Type": "application/json"
        };
        headers = extend(headers, config.headers || {});

        var requestedUrl = OTP_URL + payload.process_token;
        console.log("fn_requestFEAOTPAndSign url:" +  requestedUrl);

        // call backend API OTP request
        fn_doPost(
            requestedUrl,
            {},
            headers,
            function (xhr) { // POST success callback

                var otp_payload = {
                    'process_token': payload.process_token
                };

                var otp_config = {
            		'provider': configValue('provider'),
                    'iframe': configValue('iframe'),
                    'iframeParent': configValue('iframeParent'),
                    'modal_show_func': configValue('modal_show_func')
                };
                if ( config.otp_form_url ) { // if client provided its own OTP FORM submit implementation, let's use it
                    otp_config.otp_form_url = config.otp_form_url;
                }

                if ( config.iframe == true ) { // overrides IFRAME settings if necessary
                    otp_config.iframe = config.iframe;
                    otp_config.iframeParent = config.iframeParent;
                    otp_config.modal_show_func = config.modal_show_func;
                }

                // on success completion open OTP and PIN page submission
                OTP_FEA_Init(otp_payload, otp_config, successCallback, errorCallback);

                // if iframe-mode we have to tell to client function to show it inside a modal window
                if (otp_config.iframe && ( typeof otp_config.modal_show_func != 'undefined' )) {
                    var modal_show_func = otp_config.modal_show_func;
                    modal_show_func();
                }

            },
            function (xhr) { // POST errorCallback
                errorCallback(xhr.responseText);
            }
        );
    }
    
    function fn_checkFEASignature(payload) {
        console.log("[fn_checkFEASignature] payload: " + payload);
        return otp_sendResponse( payload );
        // fea_callback(payload);
    }
    
    function fn_checkPlaceHolderSignature(payload) {
        console.log("[fn_checkPlaceHolderSignature] payload: " + payload);
        return otp_sendResponse( payload );
        // fea_callback(payload);
    }
    
    /**
     * Request an ARUBA OTP using user's PIN and open a form to handle the signature
     * @param {object} payload - a JSON object containing the process token: <br><pre>{ 
     *     'token': '12345690abcde'
     * }
     * </pre>
     * @param {object} config - a JSON object contaning configuration settings. Allowed settings are: 
     * <ul>
     * <li>headers: a JSON object defining the request's HTTP Headers</li>
     * </ul>
     * @param {function} successCallback - callback function to invoke in case of success
     * @param {function} errorCallback - callback function to invoke in case of error
     */
    function fn_requestArubaOTPAndSign(payload, config, successCallback, errorCallback) {
       console.log("[fn_requestArubaOTPAndSign] payload: " + JSON.stringify(payload) );
       console.log('fn_requestArubaOTPAndSign] callback', successCallback);
       
        // call backend API OTP request
        var otp_payload = {
            'process_token': payload.data.token,
            'provider':'ARUBA',
            'otpType': payload.otpType
        };

        var otp_config = {
    		'provider': 'ARUBA',
    		'otpType': payload.otpType,
            'iframe': configValue('iframe'),
            'iframeParent': configValue('iframeParent'),
            'modal_show_func': configValue('modal_show_func')
        };
        if ( config.otp_form_url ) { // if client provided its own OTP FORM submit implementation, let's use it
            otp_config.otp_form_url = config.otp_form_url;
        }

        if ( config.iframe == true ) { // overrides IFRAME settings if necessary
            otp_config.iframe = config.iframe;
            otp_config.iframeParent = config.iframeParent;
            otp_config.modal_show_func = config.modal_show_func;
        }
        // on success completion open OTP and PIN page submission
        console.log('send otp_payload',otp_payload);
        OTP_Init(otp_payload, otp_config, successCallback, errorCallback);

        // if iframe-mode we have to tell to client function to show it inside a modal window
        if (otp_config.iframe && ( typeof otp_config.modal_show_func != 'undefined' )) {
            var modal_show_func = otp_config.modal_show_func;
            modal_show_func();
        }
    }


    /**
     *  Simple alert function which outputs an error into the browser's console.
     * @param {string} message - the message to output
     */
    function alertError(message) {
        console.error(message);
    }

    /**
     * Simple alert function which outputs an error into the browser's console.
     * @param {string} message - the message to output
     * @param {string|object} args - a string or a JSON Object of arguments
     */
    function error( message, args ) {
        if (typeof args != 'undefined' && args != null) {
            if (typeof args === 'object') {
                message += " " + JSON.stringify(args);
            }
        }
        throw message;
    }

    // FIXME: validazione parametri di configurazione dipendenti da altri (es. quelli per iFrame)
    /**
     * Initialize the SDK with configuration settings.
     * 
     * @param {object} confObj - a JSON Object containing one or more of the following configuration settings: 
     * <ul>
     * <li><b>console.log_mode:</b> wheather console.log log should be active or not (defaults to false)</li>
       <li><b>BASE_URL:</b> the SDK API BASE_URL </li>
       <li><b>API_URL:<b/> the SDK API_URL</li>
       <li><b>OTP_API_URL:</b> the API URL invoked to request the OTP</li>
       <li><b>SIGN_API_URL:</b> the API URL invoked to sign and complete the process</li>
       <li><b>event_listener:</b> a single or an array of event listener names to register for (defaults to null, other allowed values are 'OTP' or 'DEFAULT')</li>
        </li>
     * </ul> 
     */
    function fn_init(confObj) {
    	console.log('fn_init', confObj);
    	console.log('fn_init', SDK);
        if( confObj.hasOwnProperty("BASE_URL")) {
            var url = confObj.BASE_URL;
            var url_length = url.length;
            confObj.BASE_URL = ( url.slice(-1) == '/' ? url.slice(0, url_length-1) : url );
        }
        else {
            error('config parameter BASE_URL is required');
        }
        
        fn_init_conf(confObj);

        var listeners = confObj.event_listener || null;
        registerListeners( listeners );

        console.log("SDK initialized");
    }

    /**
     * Initializes the SDK upon the passed configuration object.
     * 
     * @param {object} confObj - a JSON Object representing the SDK configuration settings
     */
    function fn_init_conf(confObj) {
        SDK.config = extend(SDK.config, confObj);
    }

    /**
     * Retrieves, if present, the value assigned to the requested configuration parameter.
     *  
     * @param {string} configParam - the configuration parameter name to retrieve
     */
    function configValue(configParam) {
        return SDK.config[configParam];
    }

    /**
     * Extends one object with the properties of another.
     * 
     * @param {object} a - the object to extend
     * @param {object} b - the object to extend from
     */
    function extend(a, b) {
        var key = null;
        for (key in b)
            if (b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    }
    
    function isACK( msg ) {
        if ( msg !== undefined && msg !== null && msg['ACK'] !== undefined) {
            return true;
        }
        return false;
    }

    /**
     * Handles incoming event messages.
     * 
     * @param {string} event - the name of the event to handle
     */
    function messageHandler(event) {
        // filters unknown origin messages
        if (SDK.config.BASE_URL.indexOf(event.origin) == -1) return;

        if ( !mustFilter(event.data) ) {
            var payload = getMessageEventPayload(event);
            if ( isACK( payload ) ) {
                var timer = MESSAGE_QUEUE[payload.ACK]; // contains "command_name" (eg. "otp")
                console.log("[messageHandler] received ACK for command message [" + payload.ACK + "]");
                clearInterval( timer );
                console.log("[messageHandler] continuous sending for command message [" + payload.ACK + "] interrupted");
            }
            else {
                 var callbackName = payload.callback;

                 console.log("[messageHandler]", payload);

                 // TIP: if client needs to handle multiple response commands, add them here
                 switch (callbackName) {
                     case 'otp_callback':
                         otp_callback(payload);
                         break;

                     case 'aruba_pin_callback': 
                         aruba_pin_callback(payload);
                         break;
                     case 'fea_callback': 
                         fea_callback(payload);
                         break;
                     case 'signature_ph_callback': 
                         signature_ph_callback(payload);
                         break;
                     default: // do nothing.
                 }
                 ;
            }
        }
      }

    /**
     * Configures and opens a new browser window.
     * 
     * @param {string} win_name - window/iframe reference name
     * @param {object} win_opts - a JSON object with configuration parameters: <pre>
     *   {
     *         url : target URL to open
     *        features : window's features comma separated string (eg. 'height=600,width=450')
     *        iframe: boolean
     *        parent: parent element ID name where to attach iframe
     *     }
     *</pre>
     */
    function openWindow(win_name, win_opts) {
        var isIframe = ( typeof win_opts.iframe === "undefined" ? false : win_opts.iframe );
        var features = ( typeof win_opts.features === "undefined" ? 'height=600,width=450' : win_opts.features);
        var url = ( isAbsoluteUrl(win_opts.otp_form_url) ? win_opts.otp_form_url : SDK.config.API_URL + win_opts.otp_form_url );

        var win_ref = null;
        if (isIframe == false) { // new window
            win_ref = poptastic(url, win_name, features);
        }
        else { // iframe
            win_ref = openIFrame(url, win_name, win_opts.iframeParent);
        }

        addWindow(win_name, win_ref, isIframe, win_opts);
      
        return win_ref;
    }
    

    /**
     * Add an opened window to the register.
     * 
     * @param {string} window_name - the name of the opened window
     * @param {object} window_ref -  the opened window
     * @param {boolean} is_iframe - a boolean indicating whether the opened window is a window or an iframe
     * @param {object} windows_opts - a JSON object defining the opened windows options
     */
    function addWindow(window_name, window_ref, is_iframe, window_opts) {
        OPENED_WINDOWS[window_name] = {ref: window_ref, iframe: is_iframe, opts: window_opts};
    }

    
    /**
     * Retrieves an opened window from the register.
     * 
     * @param {string} window_name - the name of the window to retrieve.
     */
    function getWindowRef(window_name) {
        return OPENED_WINDOWS[window_name];
    }

    
    /**
     * Closes a window.
     * 
     * @param {string} window_name - the name of the window to close
     */
    function closeWindow(window_name) {
        var win_ref = getWindowRef(window_name);
        if (win_ref && win_ref.iframe == false)
            win_ref.ref.close();
        else {
            // TODO iframe close?
        }
    }

    /**
     * Registers callback functions for a task.
     * 
     * @param {string} task_name - the task to register callbacks for
     * @param {function} successCallback - success callback function
     * @param {function} errorCallback - error callback function
     */
    function registerCallBacks(task_name, successCallback, errorCallback) {
        if (successCallback === undefined) console.error("WARN: successCallback for task '" + task_name + "' was not declared ");
        if (errorCallback === undefined) console.error("WARN: errorCallback for task '" + task_name + "' was not declared ");

        REGISTERED_CALLBACKS[task_name] = {success: successCallback, error: errorCallback};
        console.log('CALLBACKS', JSON.stringify(REGISTERED_CALLBACKS));
    }

    /**
     * Retrieves the callback functions for a registered task. 
     * 
     * @param {string} task_name - the name of the task to retrieve callbacks for
     * @param {boolean} useDefaultIfNotRegistered - defines if to use SDK defaults callbacks if users didn't provide any implementation for them (defaults to false)
     */
    function getCallbacksForTask(task_name, useDefaultIfNotRegistered) {
        var useDefaultIfNotRegistered = (typeof useDefaultIfNotRegistered === 'undefined') ? false : useDefaultIfNotRegistered;
        var defaults = REGISTERED_CALLBACKS['default_callback'];
        var callbacks = REGISTERED_CALLBACKS[task_name];

        if (callbacks === undefined) {
            callbacks = ( useDefaultIfNotRegistered ? defaults : {} );
        }
        else {
            callbacks.success = (callbacks.success === undefined && useDefaultIfNotRegistered ? defaults.success : callbacks.success );
            callbacks.error = (callbacks.error === undefined && useDefaultIfNotRegistered ? defaults.error : callbacks.error );
        }
        return callbacks;
    }

    /**
     * Default success callback. Prints out to browser console.
     */
    function defaultSuccessCallback() {
        console.log("defaultSuccessCallback: SUCCESS");
    }

    /**
     * Default error callback. Prints out to browser console.
     */
    function defaultErrorCallback() {
        console.log("defaultErrorCallback: ERROR");
    }

    /**
     *  Helper function to open popup windows.
     *  
     *  @param {string} url - the URL to open in the window
     *  @param {string} name - the name to assign to the window
     *  @param {string} definitions - configuration options for the window
     */
    function poptastic(url, name, definitions) {
        /*
        var newWindow = null;
        
         if ( isIEUserAgent() ) {
             // AS IN https://stackoverflow.com/questions/16226924/is-cross-origin-postmessage-broken-in-ie10
             //var submitWindow = window.open("/", "processingWindow");
             //submitWindow.location.href = 'about:blank';
             //submitWindow.location.href = 'remotePage to comunicate with';
             
             var fakeUrl = '/my-web-firma/sdk/blank.html';
             newWindow = window.open(fakeUrl, name, definitions);
             //newWindow.location.href = 'about:blank';
             newWindow.location.href = url;
         }
         else {
             newWindow = window.open(url, name, definitions);
         }
         
        if (window.focus) {
             newWindow.focus();
        }
        return newWindow;
        */
        return openFFPromotionPopup(url, name, definitions)
    }
    
    var windowObjectReference = null; // global variable

    function openFFPromotionPopup(url, name, definitions) {
      if(windowObjectReference == null || windowObjectReference.closed)
      /* if the pointer to the window object in memory does not exist
         or if such pointer exists but the window was closed */

      {
        windowObjectReference = window.open(url, name, definitions);
        /* then create it. The new window will be created and
           will be brought on top of any other window. */
      }
      else
      {
        windowObjectReference.focus();
        /* else the window reference must exist and the window
           is not closed; therefore, we can bring it back on top of any other
           window with the focus() method. There would be no need to re-create
           the window or to reload the referenced resource. */
      };
      return windowObjectReference;
    }


    /**
     * Helper function to open IFrame as popup.
     * 
     *  @param {string} url - the URL to open in the window
     *  @param {string} name - the name to assign to the window
     *  @param {string} parent_id - the DOM element ID to which append the IFrame
     */
    function openIFrame(url, name, parent_id) {

        var iframe;
        var oldStyle;
        if (checkJQueryDependency()) {
            try {
                iframe = $(document).find("#" + name);
                if( iframe ) {
                	oldStyle = $(iframe).attr("style");
                    iframe.remove();
                }
            } catch (err) {};
        } else {
            iframe = document.getElementById(name);
            if( iframe && iframe.parentNode ) {
                if (iframe.style) {
                	oldStyle = iframe.style;
                }
                iframe.parentNode.removeChild(iframe);
            }
        }
        /*
        if (iframe && iframe.parentNode) {
        	iframe.parentNode.textContent = '';
        }*/
        iframe = document.createElement("iframe");
        setAttribute(iframe, "src", url);
        setAttribute(iframe, "id", name);
        if (configValue('iframeStyle')) {
        	setAttribute(iframe, "style", configValue('iframeStyle'));
        } else if (oldStyle) {
        	setAttribute(iframe, "style", oldStyle);
        }
        
        var parentId = ( typeof parent_id === "undefined" ? "body" : parent_id );
        var parentElement = ( parentId == "body" ?
                document.getElementsByTagName("body")[0] :
                document.getElementById(parent_id)
        );
        parentElement.appendChild(iframe);
        return iframe.contentWindow;
    }

    /**
     * Helper function to check if an URL is absolute.
     * 
     * @param {string} url - the URL to check
     */
    function isAbsoluteUrl(url) {
        var regex = /^https?:\/\/|^\/\//i;
        return regex.test(url);
    }

    /**
     * Helper function to check if JQuery is defined.
     * 
     */
    function checkJQueryDependency() {
        if(typeof(jQuery) == 'undefined'){
            var errorMsg = "JQuery not defined!\nIn order to make SDK working correctly with iframes, JQuery library is required.\nPlease add it to the page."
            console.log( errorMsg );
            // error(errorMsg);
            return false;
        }
        return true;
    }

    /*
     function fn_doGet(url, headers, successCallback, errorCallback) {
     var xhr = createCORSRequest( 'GET', url, headers, successCallback, errorCallback );
     console.log('[fn_doGet] url: ' + url );
     xhr.send();
     }


     function fn_doPost(url, payload, headers, successCallback, errorCallback ) {
     var xhr = createCORSRequest( 'POST', url, headers, successCallback, errorCallback );
     var stringified_payload = JSON.stringify( payload );
     console.log('[fn_doPost] url: ' + url + ', payload: ' + stringified_payload );
     xhr.send( stringified_payload );
     }
     */

    /**
     * Helper function to encode URL encode JSON objects.
     * 
     * @param {object} jsonObject - The JSON object to URL encode
     */
    function toUrlEncoded(jsonObj) {
        var encoded = "";
        var key = null;
        for (key in jsonObj) {
            if (jsonObj.hasOwnProperty(key))
                var current = (encoded === "" ? "" : "&") + key + "=" + jsonObj[key];
            encoded = encoded.concat(current);
        }
        return encodeURI(encoded);
    }

    /**
     * Helper function to stringify request payloads.
     * 
     * @param {object} jsonPayload - The JSON payload to process
     * @param {Array} requestHeaders - An array of request headers
     */
    function processPayload(jsonPayload, requestHeaders) {
        var stringified_payload = null;
        if (requestHeaders) {
            var contentType = requestHeaders["Content-Type"];
            if (contentType === "application/x-www-form-urlencoded") {
                stringified_payload = toUrlEncoded(jsonPayload);
            }
            else {
                stringified_payload = JSON.stringify(jsonPayload);
            }
        }
        else {
            stringified_payload = JSON.stringify(jsonPayload);
        }
        return stringified_payload;
    }

    /**
     * Performs an XMLHttpRequest.
     * @param {string} method - the HTTP method to use
     * @param {string} url - the URL to send the request to
     * @param {Object} payload - a JSON object representing the request payload
     * @param {Object} headers - a JSON object representing the request headers
     * @param {function} successCallback - a function to call in case of request success
     * @param {function} errorCallback - a function to call in case of request error
     * @returns {*}
     */
    function fn_doConnection(method, url, payload, headers, successCallback, errorCallback) {
        var xhr = createCORSRequest(method, url, headers, successCallback, errorCallback);
        if ('POST' === method || 'PUT' === method || 'DELETE' === method) {
            xhr.send(payload);
        }
        else {
            xhr.send();
        }
        return xhr;
    }

    /**
     * Performs a PUT request.
     *
     * @param {string} url - The requested url
     * @param {Object} payload - A JSON object representing the request payload.
     * @param {Object} headers - A JSON object representing the request headers.
     * @param {function} successCallback - A function to be called upon successfull request.
     * @param {function} errorCallback - A function to be called upon unsuccessfull request.
     */
    function fn_doPut(url, payload, headers, successCallback, errorCallback) {
        var stringified_payload = processPayload(payload, headers);
        console.log('[fn_doPut] url: ' + url + ', payload: ' + stringified_payload);
        // try {
        fn_doConnection('PUT', url, stringified_payload, headers, successCallback, errorCallback);
        // } catch ( err ) {
        //     errorCallback(err);
        // }
    }

    /**
     * Performs a DELETE request.
     *
     * @param {string} url - The requested url
     * @param {Object} payload - A JSON object representing the request payload.
     * @param {Object} headers - A JSON object representing the request headers.
     * @param {function} successCallback - A function to be called upon successfull request.
     * @param {function} errorCallback - A function to be called upon unsuccessfull request.
     */
    function fn_doDelete(url, payload, headers, successCallback, errorCallback) {
        var stringified_payload = processPayload(payload, headers);
        console.log('[fn_doDelete] url: ' + url + ', payload: ' + stringified_payload);
        // try {
        fn_doConnection('DELETE', url, stringified_payload, headers, successCallback, errorCallback);
        // } catch ( err ) {
        //     errorCallback(err);
        // }
    }

    /**
     * Performs a GET request.
     *
     * @param {string} url - The requested url
     * @param {Object} payload - A JSON object representing the request payload.
     * @param {Object} headers - A JSON object representing the request headers.
     * @param {function} successCallback - A function to be called upon successfull request.
     * @param {function} errorCallback - A function to be called upon unsuccessfull request.
     */
    function fn_doGet(url, headers, successCallback, errorCallback) {
        console.log('[fn_doGet] url: ' + url);
        //   try {
        fn_doConnection('GET', url, null, headers, successCallback, errorCallback);
        //   } catch ( err ) {
        //       errorCallback(err);
        //   }
    }


    /**
     * Performs a POST request.
     *
     * @param {string} url - The requested url
     * @param {Object} payload - A JSON object representing the request payload.
     * @param {Object} headers - A JSON object representing the request headers.
     * @param {function} successCallback - A function to be called upon successfull request.
     * @param {function} errorCallback - A function to be called upon unsuccessfull request.
     */
    function fn_doPost(url, payload, headers, successCallback, errorCallback) {
        var stringified_payload = processPayload(payload, headers);
        // console.log('[fn_doPost] url: ' + url + ', payload: ' + stringified_payload);
        //   try {
        fn_doConnection('POST', url, stringified_payload, headers, successCallback, errorCallback);
        //   } catch ( err ) {
        //       errorCallback(err);
        //   }
    }


    /**
     * Helper method to create and setup a CORS Request.
     *
     * @param {string} url - The requested url
     * @param {Object} payload - A JSON object representing the request payload.
     * @param {Object} headers - A JSON object representing the request headers.
     * @param {function} successCallback - A function to be called upon successfull request.
     * @param {function} errorCallback - A function to be called upon unsuccessfull request.
     */
    function createCORSRequest(method, url, headers, successCallback, errorCallback) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }
        if (!xhr) {
            alertError("CORS not supported by browser");
            return xhr;
        }

        setHeaders(xhr, headers);

        var alreadyNotifiedError = false;

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                successCallback(xhr);
            }
            //else if ( xhr.readyState = 4 && xhr.status != 500)  {
            else if (xhr.readyState == 4 && xhr.status != 200) {
                errorCallback(xhr);
                alreadyNotifiedError = true;
            }
        };

        xhr.onerror = function () {
            if (!alreadyNotifiedError) {
                if (xhr.readyState === 4) {
                    // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText
                    console.log("STATUS " + xhr.status + ",  " + xhr.statusText);
                }
                else if (xhr.readyState === 0) {
                    // Network error (i.e. connection refused, access denied due to CORS, etc.)
                    console.log("NETWORK ERROR");
                }
                else {
                    // something weird happened
                    console.log("SOMETHING WEIRD HAPPENED");
                }

                errorCallback(xhr); // FIXME: pass whole XHR object or error POJO
            }
        };

        return xhr;
    }

    /**
     * Helper method to set request headers.
     * 
     * @param {Object} xmlHttpRequest - A XHR object
     * @param {Object} headers - A JSON Object representing the request headers
     */
    function setHeaders(xmlHttpRequest, headers) {
        if (( typeof( headers ) === 'object' ) && xmlHttpRequest) {
            var header = null;
            var value = null;
            for (header in headers) {
                if (headers.hasOwnProperty(header)) {
                    value = headers[header];
                    console.log("[setHeaders] " + header + " : " + value);
                    xmlHttpRequest.setRequestHeader(header, value);
                }
            }
        }
    }

    /**
     * Helper method to send messages between HTML Window instances, using the HTML5 Messaging API.
     * 
     * @param {Object} win_ref - A window reference instance
     * @param {string} command_name - the name of the command (message) that has to be sent to the recipient window
     * @param {Object} jsonArgs - a JSON object representing command (message) arguments
     */
    function postMessage(win_ref, command_name, jsonArgs) {
        var payload = {
            command: command_name,
            args: jsonArgs
        };
        var stringified = JSON.stringify(payload);
       // setTimeout(function () {
           var timer = setInterval( function() {
                   win_ref.postMessage(stringified, SDK.config.BASE_URL);
                console.log("[postMessage] " + stringified);
           }, timeoutInterval);
           
           MESSAGE_QUEUE[command_name] = timer;
           
       // }, 500);
    }

    /**
     * Helper function to get a DOM element by its class name. If multiple elements match the class name, the first one is returned.
     * 
     * @param {string} className - the element class name
     */
    function getElementByClass(className) {
        return document.getElementsByClassName(className)[0];
    }

    /**
     * Helper function to create a HTML DOM element.
     * 
     * @param {string} tag - the element to create
     */
    function createElement(tag) {
        return document.createElement(tag);
    }

    /**
     * Helper function to create a HTML DOM attribute.
     * 
     * @param {string} attr - the attribute to create
     */
    function createAttribute(attr) {
        return document.createAttribute(attr);
    }

    /**
     * Helper function to set an attribute for a HTML DOM element.
     * 
     * @param {Object} element - the DOM element
     * @param {string} attrName - the attribute name to set
     * @param {string} attrValue - the attribute value
     */
    function setAttribute(element, attrName, attrValue) {
        var attr = createAttribute(attrName);
        attr.value = attrValue;
        element.setAttributeNode(attr);
        return element;
    }

    /**
     * Helper function to create a DOM text element.
     * 
     * @param {string} text -  the element content
     */
    function createTextNode(text) {
        return document.createTextNode(text);
    }

    /**
     * Helper function to set a text element.
     * 
     * @param {Object} element - the DOM element 
     * @param {string} text - the text to be set
     */
    function setText(element, text) {
        var textnode = createTextNode(text);
        element.appendChild(textnode);
        return element;
    }

    /**
     * Helper function to extract the payload of a received message through the HTML5 Messaging API.
     * 
     * @param {Object} event - the event from which to extract the payload
     */
    function getMessageEventPayload(event) {
        var payload = {};
        if (event !== undefined && event.data !== undefined) {
            try {
                payload = JSON.parse(event.data);
            } catch (error) {
            }
        }
        return payload;
    }

    /**
     * Helper function to identify if the current browser is Chrome.
     * 
     */
    function isChromeUserAgent() {
        var isChrome = false;

        var isChromium = window.chrome,
            winNav = window.navigator,
            vendorName = winNav.vendor,
            isOpera = winNav.userAgent.indexOf("OPR") > -1,
            isIEedge = winNav.userAgent.indexOf("Edge") > -1,
            isIOSChrome = winNav.userAgent.match("CriOS");

        if(isIOSChrome){
            // is Google Chrome on IOS
            isChrome = true;
        } else if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
            // is Google Chrome
            isChrome = true;
        } else {
            // not Google Chrome
            isChrome = false;
        }
        return isChrome;
    }
    
    /**
     * Helper function to identify if the current browser is Internet Explorer or Edge.
     * 
     */
    function isIEUserAgent() {
        var isIE = false;
        if(navigator.userAgent.indexOf('MSIE')!==-1
            || navigator.appVersion.indexOf('Trident/') > 0) {
                /* Microsoft Internet Explorer detected in. */
            isIE = true;
        }
        return isIE;
    }
    
    function fn_requestOTP(provider, otpType) {
        var response_payload = {
            callback: 'otp_callback',
            op:"requestOTP",
            provider: provider,
            otpType: otpType,
            token: SDK.OTP.commandArgs.process_token,
            auth_token: SDK.OTP.commandArgs.auth_token
        };
        otp_sendResponse( response_payload );
    	// fn_requestAndProcessOTP(payload, config, successCallback, errorCallback)
    }

    /**
     * Function that implements the request to the Sign Process API, sending the user's OneTimePassword and PIN.
     * 
     * @param {string} otp - the user's OneTimePassword
     * @param {string} pin - the user's pin
     */
    function fn_processOTP(otp, pin) {

        // $('#submitBtn').html("Processing...").attr("disabled","disabled");

        //var otp = otp; //$('#otp').val();
        //var pin = pin; //$('#pin').val();

        // console.log("OTP[" + otp + "], PIN[" + pin + "]");

        // perform tasks
        // FIXME: API URL
        //var url_firma = "http://localhost:8080/api/public/signProcess/" + OTP.commandArgs.process_token;
        // var url_firma = "http://localhost:8080/api/public/alwaysOK/" + OTP.commandArgs.process_token;
        var url_firma = SDK.config.SIGN_API_URL + OTP.commandArgs.process_token;

        var payload = {
            "pin": pin,
            "otp": otp
        };

        var headers = {
            "Content-Type":  "application/x-www-form-urlencoded"
        };

        var response_payload = {
            callback: 'otp_callback',
        	op:"processOTP"
        };

        fn_doPost(url_firma, payload, headers,
            function(xhr) { // SUCCESS CALLBACK
                // inject the JSON response
                response_payload.data = xhr.response;
                return otp_sendResponse( response_payload );
            },
            function(xhr) { // ERROR_CALLBACK
                response_payload.data = xhr.response;
            	return otp_sendResponse( response_payload );
            }
        );

    };
    /**
     * Function that handles the submission of the user's PIN
     * 
     * @param {string} pin - the user's pin
     * @param {string} token - the process' token
     */
    function fn_processArubaPin(pin, token) {
        console.log("PIN[" + pin + "], TOKEN: " + token);

        
        var OTP_URL = SDK.config.OTP_API_ARUBA_URL;

        OTP_URL = ( OTP_URL.slice(-1) == '/' ? OTP_URL : OTP_URL + '/' );

        var headers = {
            "Content-Type": "application/json"
        };
        headers = extend(headers, SDK.config.headers || {});

        var requestedUrl = OTP_URL + token;
        console.log("fn_requestArubaOTPAndSign url:" +  requestedUrl);

        
        fn_doPost(requestedUrl,
            {
                'pin' : pin
            },
            headers,
            function (xhr) { // POST success callback
            	console.log('dovrei andare avanti');
            	var payload = {
                    "pin": pin,
                    "token" : token,
                    "code" : 200
                };
            	var response_payload = {
                    callback: 'aruba_pin_callback',
                    language: SDK.config.language,
                    otpType: SDK.OTP.commandArgs.otpType,
                    data: payload
                };
            	return otp_sendResponse( response_payload );
            },
            function(xhr) { // POST errorCallback
            	console.log('dovrei dare errore (' + SDK.config.provider + '\')');
            	SDK.config.provider = 'ARUBA'
            	var response_payload = {
                    callback: 'aruba_pin_callback',
                    language: SDK.config.language,
                    otpType: SDK.OTP.commandArgs.otpType,
                    data: xhr.response
                };
            	return otp_sendResponse( response_payload );
            }
        );
    };

    /**
     * Function that implements the response to the client which performed the Signing process.
     * 
     * @param {Object} payload - a JSON Object representing the response payload
     */
    function otp_sendResponse( payload ) {
        console.log('[otp_sendResponse]', JSON.stringify(payload));
        if (payload && payload.data) {
        	console.log('payload.data', typeof payload.data);
        	var jsonData = ((typeof payload.data).toLowerCase() === 'string') ? JSON.parse(payload.data) : payload.data;
        	console.log('jsonData', jsonData);
            if (jsonData.description === 'CONFIRMA_ERROR_20' || jsonData.description === 'CONFIRMA_ERROR_20_ARUBA'
            	|| jsonData.description === 'CONFIRMA_ERROR_21' || jsonData.description === 'CONFIRMA_ERROR_22' || jsonData.description === 'CONFIRMA_ERROR_22_ARUBA') {
            	if (typeof submitError === 'function') {
            		console.log('mostro l\'errore (' + SDK.config.provider + '\')');
            		var errore = jsonData.description;
            		if (jsonData.description === 'CONFIRMA_ERROR_20' || jsonData.description === 'CONFIRMA_ERROR_22') {
            			if (SDK.config.provider == 'ARUBA') {
            				jsonData.description = jsonData.description + "_ARUBA";
            				errore = "<span id='" + jsonData.description + "'>Password CERTIFICATO Errata/Wrong CERTIFICATE Password</span>";
            			} else {
            				errore = "<span id='" + jsonData.description + "'>PIN Errato/Wrong PIN</span>";
            			}

            			console.log('errore', errore);
            			console.log('desc', jsonData.description);
            			if (!SDK.config.language) {
            				SDK.config.language = "EN";
            			}
            			console.log('lang', SDK.config.language);
            			submitError(errore);
            			setLanguageValue(jsonData.description, SDK.config.language);
            		} else if (jsonData.description === 'CONFIRMA_ERROR_0') {
            			errore = "<span id='" + jsonData.description + "'>Errore Generico/Generic Error</span>";
            			console.log('errore', errore);
            			console.log('desc', jsonData.description);
            			if (!SDK.config.language) {
            				SDK.config.language = "EN";
            			}
            			console.log('lang', SDK.config.language);
            			submitError(errore);
            			setLanguageValue(jsonData.description, SDK.config.language);
            		} else if (jsonData.description === 'CONFIRMA_ERROR_21') {
            			errore = "<span id='" + jsonData.description + "'>OTP Errato/Wrong OTP</span>";
            			console.log('errore', errore);
            			console.log('desc', jsonData.description);
            			if (!SDK.config.language) {
            				SDK.config.language = "EN";
            			}
            			console.log('lang', SDK.config.language);
            			submitError(errore);
            			setLanguageValue(jsonData.description, SDK.config.language ? SDK.config.language : "EN");
            		} else if (jsonData.description === 'CONFIRMA_ERROR_20_ARUBA' || jsonData.description === 'CONFIRMA_ERROR_22_ARUBA') {
            			errore = "<span id='" + jsonData.description + "'>Password CERTIFICATO Errata/Wrong CERTIFICATE Password</span>";
            			console.log('errore', errore);
            			console.log('desc', jsonData.description);
            			if (!SDK.config.language) {
            				SDK.config.language = "EN";
            			}
            			console.log('lang', SDK.config.language);
            			submitError(errore);
            			setLanguageValue(jsonData.description, SDK.config.language);
            		} else {
            			submitError(errore);
            		}
            		
            		return false;
            	} else {
            		console.log('ho idea che continui a non trovare submitError');
            	}
            } else {
    	        OTP.messageSrc.postMessage(
    	            JSON.stringify( payload ), // payload
    	            ( OTP.isChromeUserAgent() ? '*' : OTP.srcOrigin ) ); // targetOrigin
            }
        } else {
	        OTP.messageSrc.postMessage(
	            JSON.stringify( payload ), // payload
	            ( OTP.isChromeUserAgent() ? '*' : OTP.srcOrigin ) ); // targetOrigin
        }
        return true;
    }


    /**
     * Helper function to handle received messages through the HTML5 Messaging API.
     * 
     * @param {Object} event - an Object representing the received event ( message )
     */
    function otp_receivedMessage(event) {

        var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.

        OTP.srcOrigin = origin;

        //        check the origin for security reasons!
        //        if (origin !== "http://example.org:8080")
        //            return;

        //$('#message').html( event.origin );

        if ( !mustFilter( event.data )) {
            console.log("MESSAGE RECEIVED:", event.data);

            var payload = null;

            try {
                payload = JSON.parse(event.data);
            } catch (err) {
                console.log("[otp_sendResponse] error:", err);
                payload = null;
            }
            if( payload !== null && payload.command === 'otp') {
                OTP.messageSrc = event.source;
                OTP.commandArgs = payload.args; // extract command's args
                console.log("[otp_sendResponse] OTP command received:" , OTP.commandArgs);
                if (OTP.commandArgs.language) {
                	SDK.config.language = OTP.commandArgs.language;
                }
                setLanguage(SDK.config.language);
                if (payload.args.otpType && payload.args.otpType == 'SMS') {
                	SDK.OTP.otpType = 'SMS';
                }
                showRequestOtp();
                initButtons();
                // send ACK to sender to suspend continuous delivery of "otp" command message;
                var ack = { "ACK" : payload.command };
                otp_sendResponse( ack );
                console.log("[otp_sendResponse] sent ACK for command " + payload.command);
            }
            else if ( payload !== null && payload.command === 'otp_aruba') {
                OTP.messageSrc = event.source;
                OTP.commandArgs = payload.args; // extract command's args
                console.log("[otp_sendResponse] otp_aruba command received:" , OTP.commandArgs);
                if (OTP.commandArgs.language) {
                	SDK.config.language = OTP.commandArgs.language;
                }
                setLanguage(SDK.config.language);
                // send ACK to sender to suspend continuous delivery of "otp" command message;
                var ack = { "ACK" : payload.command };
                otp_sendResponse( ack );
                console.log("[otp_sendResponse] sent ACK for command " + payload.command);
            } else if ( payload !== null && payload.command === 'pin_aruba_error') {
                OTP.messageSrc = event.source;
                OTP.commandArgs = payload.args; // extract command's args
            	var errore = "";
            	var jsonData = JSON.parse(OTP.commandArgs);
            	console.log('jsonData', jsonData);
            	if (jsonData.description === 'CONFIRMA_ERROR_0') {
        			errore = "<span id='" + jsonData.description + "'>Errore Generico/Generic Error</span>";
        			console.log('errore', errore);
        			console.log('desc', jsonData.description);
        			if (!SDK.config.language) {
        				SDK.config.language = "EN";
        			}
        			console.log('lang', SDK.config.language);
        			submitError(errore);
        			setLanguageValue(jsonData.description, SDK.config.language);
        		} else if (jsonData.description === 'CONFIRMA_ERROR_20' || jsonData.description === 'CONFIRMA_ERROR_22') {
        			errore = "<span id='" + jsonData.description + "'>Password CERTIFICATO Errata/Wrong CERTIFICATE Password</span>";
        			console.log('errore', errore);
        			console.log('desc', jsonData.description);
        			if (!SDK.config.language) {
        				SDK.config.language = "EN";
        			}
        			console.log('lang', SDK.config.language);
        			submitError(errore);
        			setLanguageValue(jsonData.description, SDK.config.language);
        		}
            	var ack = { "ACK" : payload.command };
                otp_sendResponse( ack );
                console.log("[otp_sendResponse] sent ACK for command " + payload.command);
            }
            else if ( payload !== null && payload.command === 'fea') {
                OTP.messageSrc = event.source;
                OTP.commandArgs = payload.args; // extract command's args
                if (OTP.commandArgs.language) {
                	SDK.config.language = OTP.commandArgs.language;
                }
                setLanguage(SDK.config.language);
                console.log("[otp_sendResponse] fea command received:" , OTP.commandArgs);

                // send ACK to sender to suspend continuous delivery of "otp" command message;
                var ack = { "ACK" : payload.command };
                otp_sendResponse( ack );
                console.log("[otp_sendResponse] sent ACK for command " + payload.command);
            }
            else if ( payload !== null && payload.command === 'signature_ph') {
                console.log('[signature_ph_receivedMessage]', JSON.stringify(event));
                OTP.messageSrc = event.source;
                OTP.commandArgs = payload.args; // extract command's args
                if (OTP.commandArgs.language) {
                	SDK.config.language = OTP.commandArgs.language;
                }
                setLanguage(SDK.config.language);
                console.log("[otp_sendResponse] signature_ph command received:" , OTP.commandArgs);

                // send ACK to sender to suspend continuous delivery of "otp" command message;
                var ack = { "ACK" : payload.command };
                otp_sendResponse( ack );
                console.log("[otp_sendResponse] sent ACK for command " + payload.command);
            }
        }
        
    };
    
    /**
     * Helper function to handle received messages through the HTML5 Messaging API.
     * 
     * @param {Object} event - an Object representing the received event ( message )
     */
    function fea_receivedMessage(event) {

        var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.

        OTP.srcOrigin = origin;

        //      check the origin for security reasons!
        //      if (origin !== "http://example.org:8080")
        //          return;

        //$('#message').html( event.origin );

        if ( !mustFilter( event.data )) {
            console.log("MESSAGE RECEIVED:", event.data);

            var payload = null;

            try {
                payload = JSON.parse(event.data);
            } catch (err) {
                console.log("[fea_receivedMessage] error:", err);
                payload = null;
            }
            if ( payload !== null && payload.command === 'fea') {
                OTP.messageSrc = event.source;
                OTP.commandArgs = payload.args; // extract command's args
                console.log("[fea_receivedMessage] fea command received:" , OTP.commandArgs);

                // send ACK to sender to suspend continuous delivery of "otp" command message;
                var ack = { "ACK" : payload.command };
                otp_sendResponse( ack );
                console.log("[fea_receivedMessage] sent ACK for command " + payload.command);
            }
        }
    };
    
    /**
     * Helper function to handle received messages through the HTML5 Messaging API.
     * 
     * @param {Object} event - an Object representing the received event ( message )
     */
    function signature_ph_receivedMessage(event) {

        var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.

        OTP.srcOrigin = origin;

        //      check the origin for security reasons!
        //      if (origin !== "http://example.org:8080")
        //          return;

        //$('#message').html( event.origin );

        if ( !mustFilter( event.data )) {
            console.log("MESSAGE RECEIVED:", event.data);

            var payload = null;

            try {
                payload = JSON.parse(event.data);
            } catch (err) {
                console.log("[fea_receivedMessage] error:", err);
                payload = null;
            }
            if ( payload !== null && payload.command === 'signature_ph') {
                OTP.messageSrc = event.source;
                OTP.commandArgs = payload.args; // extract command's args
                console.log("[signature_ph_receivedMessage] fea command received:" , OTP.commandArgs);

                // send ACK to sender to suspend continuous delivery of "otp" command message;
                var ack = { "ACK" : payload.command };
                otp_sendResponse( ack );
                console.log("[signature_ph_receivedMessage] sent ACK for command " + payload.command);
            }
        }
    };

    function mustFilter(data) {
        console.log("[mustFilter]: '" + data + "'");
        if ((data) && ( data.indexOf("frms_dsptch@@READY") > -1 )) {
          return true;  
        } 
        return false;
    }

//})(parent.window);
//}

//USIGN_JS.init(window);

})(USIGN_JS, window);
// delay(1000, "request_otp_wait", "request_otp_wait_val");
function initDelay(idParent, id, idTarget, timeNow) {
	if (document.getElementById(id) && document.getElementById(idParent) && document.getElementById(idTarget)) {
		document.getElementById(id).innerHTML = timeNow;
		showElement(idParent);
		disableElement(idTarget);
		
		var time = 1000;
		setTimeout(function() {
			delay(time, idParent, id, idTarget, timeNow);
		}, time);
	}
}
function delay(time, idParent, id, idTarget, timeNow) {
	if (document.getElementById(id) && document.getElementById(idParent) && document.getElementById(idTarget)) {
		var sec = parseInt(timeNow);
		if (sec > 0) {
			var newSec = sec -1;
			document.getElementById(id).innerHTML = "" + newSec;
			setTimeout(function() {
				delay(time, idParent, id, idTarget, newSec);
			}, time);
		} else {
			document.getElementById(id).innerHTML = "0";
			hideElement(idParent);
			enableElement(idTarget);
		}
	}
	
}

function setLanguage(language) {
	if (messages && messages[language]) {
    	setLanguageValue("pin_label", language);
    	setLanguageValue("pin", language, "placeholder");
    	setLanguageValue("password_label", language);
    	setLanguageValue("password", language, "placeholder");
    	setLanguageValue("otp_label", language);
    	setLanguageValue("otp", language, "placeholder");
    	setLanguageValue("request_otp", language);
    	setLanguageValue("request_otp_wait_message", language);
    	setLanguageValue("request_otp_wait_time", language);
    	setLanguageValue("send", language);
	}
	showElement("otpForm");
	hideElement("waitingForm");
}

function showElement(id) {
	var element = document.getElementById(id);
	if (element) {
		element.style.display = "inline";
	}
}

function hideElement(id) {
	var element = document.getElementById(id);
	if (element) {
		element.style.display = "none";
	}
}

function enableElement(id) {
	var element = document.getElementById(id);
	if (element) {
		element.removeAttribute("disabled");
	}
}

function disableElement(id) {
	var element = document.getElementById(id);
	if (element) {
		element.setAttribute("disabled","disabled");
	}
}


function setLanguageValue(id, language, attrName) {
	if (messages[language][id]) {
		if (!attrName) {
			if (document.getElementById(id)) {
				document.getElementById(id).innerHTML = messages[language][id];
				document.getElementById(id).setAttribute("value", messages[language][id]);
			}
		} else {
			if (document.getElementById(id)) {
				const element = document.getElementById(id);
				element.setAttribute(attrName, messages[language][id]);
				/*
				if (element.hasAttribute(attrName)) {
					
				} else {
					const attr = document.createAttribute(attrName);
					attr.value = messages[language][id];
					element.setAttributeNode(attr);
				}
				*/
			}
		}
	}
}
