
function addScript(uri) {
    var head = document.getElementsByTagName('head')[0]; var script = document.createElement('script'); script.async = true; script.type = 'text/javascript'; var rnd = 'rnd=' + Math.random().toString(); if (uri.indexOf('?') > 0) {
        if (uri.indexOf('?') == uri.length - 1) { uri = uri + rnd; } else { uri = uri + '&' + rnd; }
    }
    else { uri = uri + '?' + rnd; }
    script.src = uri; script.onload = function (e) { head.removeChild(script); script = null; }
    script.onerror = function (e) {
        head.removeChild(script); script = null; if (fcHttpServerOfflineCallback)
            fcHttpServerOfflineCallback();
    }
    script.onreadystatechange = function () { if (this.readyState == 'complete') { head.removeChild(script); script = null; } }
    head.appendChild(script);
}
function is_int(value) { return typeof (value) == 'number' && parseInt(value) == value; }
function FccertificateToken() { }; FccertificateToken.prototype = { certificateIndex: -1, certificateName: '', readerName: '', userName: '', password: '', otp: '' }
function Fcsign() { }; Fcsign.prototype = {
    templateUrl: '', uploadSoapRequest: '', uploadSoapAction: '', uploadSoapContentType: '', uploadPostFieldName: '', uploadMethod: '', documentSchema: '', callback: null, extraParams: '', version: function () { addScript("https://localhost:7777/version"); }, sign: function (downloadUrl, downloadFilename, uploadUrl, uploadFilename, signAction) { if (downloadUrl) { downloadFilename = downloadFilename || ''; uploadUrl = uploadUrl || ''; uploadFilename = uploadFilename || ''; signAction = is_int(signAction) ? signAction : -1; addScript("https://localhost:7777/sign?f=" + escape(downloadUrl) + "&a=" + signAction + "&df=" + downloadFilename + "&t=" + escape(fcsign.templateUrl) + "&s=" + fcsign.documentSchema + "&u=" + escape(uploadUrl) + "&usr=" + escape(fcsign.uploadSoapRequest) + "&usa=" + escape(fcsign.uploadSoapAction) + "&usc=" + escape(fcsign.uploadSoapContentType) + "&uf=" + uploadFilename + "&upfn=" + fcsign.uploadPostFieldName + "&um=" + fcsign.uploadMethod + "&e=" + fcsign.extraParams); } else { fcsigncallback({ success: false, errorMessage: "pdf required" }); } }, readers: function (onlyLocal, localStorage) {
        if (onlyLocal) { l = '1'; } else { l = '0'; }
        if (localStorage) { s = '1'; } else { s = '0'; }
        addScript("https://localhost:7777/readers?l=" + l + "&s=" + s);
    }, installManagedCertificate: function (certFile, password) { certFile = certFile || ''; password = password || ''; addScript("https://localhost:7777/installmanagedcertificate?c=" + certFile + "&p=" + password); }, uninstallManagedCertificate: function (name) { if (name) { addScript("https://localhost:7777/uninstallmanagedcertificate?n=" + name); } else { fcsigncallback({ success: false, errorMessage: "certificate name required" }); } }, tabletStatusById: function (vendorId, productId) { vendorId = is_int(vendorId) ? vendorId : 0; productId = is_int(productId) ? productId : 0; addScript("https://localhost:7777/tabletstatusbyid?v=" + vendorId + "&p=" + productId); }, clearMemory: function () { addScript("https://localhost:7777/clearmemory"); }, loadDocumentInMemory: function (filename) { if (filename) { addScript("https://localhost:7777/loaddocumentinmemory?f=" + escape(filename)); } else { fcsigncallback({ success: false, errorMessage: "file required" }); } }, isDocumentInMemory: function () { addScript("https://localhost:7777/isdocumentinmemory"); }, uploadSignedDocumentFromMemory: function (uploadUrl, uploadFilename, uploadZipped) {
        if (uploadUrl) {
            uploadUrl = uploadUrl || ''; uploadFilename = uploadFilename || ''; if (uploadZipped) { uz = '1'; } else { uz = '0'; }
            addScript("https://localhost:7777/uploadsigneddocumentfrommemory?u=" + escape(uploadUrl) + "&uf=" + uploadFilename + "&usr=" + escape(fcsign.uploadSoapRequest) + "&usa=" + escape(fcsign.uploadSoapAction) + "&usc=" + escape(fcsign.uploadSoapContentType) + "&upfn=" + fcsign.uploadPostFieldName + "&um=" + fcsign.uploadMethod + "&uz=" + uz);
        } else { fcsigncallback({ success: false, errorMessage: "upload url required" }); }
    }, readSignedDocumentArray: function () { addScript("https://localhost:7777/readsigneddocumentarray"); }, readDocumentArray: function () { addScript("https://localhost:7777/readdocumentarray"); }, uploadSignedDocumentFlatFromMemory: function (uploadUrl, uploadFilename, uploadZipped) {
        if (uploadUrl) {
            uploadUrl = uploadUrl || ''; uploadFilename = uploadFilename || ''; if (uploadZipped) { uz = '1'; } else { uz = '0'; }
            addScript("https://localhost:7777/uploadsigneddocumentflatfrommemory?u=" + escape(uploadUrl) + "&uf=" + uploadFilename + "&usr=" + escape(fcsign.uploadSoapRequest) + "&usa=" + escape(fcsign.uploadSoapAction) + "&usc=" + escape(fcsign.uploadSoapContentType) + "&upfn=" + fcsign.uploadPostFieldName + "&um=" + fcsign.uploadMethod + "&uz=" + uz);
        } else { fcsigncallback({ success: false, errorMessage: "upload url required" }); }
    }, readSignedDocumentFlatArray: function () { addScript("https://localhost:7777/readsigneddocumentflatarray"); }, uploadSpecimensFromMemory: function (uploadUrl, uploadFilename) { if (uploadUrl) { uploadUrl = uploadUrl || ''; uploadFilename = uploadFilename || ''; addScript("https://localhost:7777/uploadspecimensfrommemory?u=" + escape(uploadUrl) + "&uf=" + uploadFilename + "&usr=" + escape(fcsign.uploadSoapRequest) + "&usa=" + escape(fcsign.uploadSoapAction) + "&usc=" + escape(fcsign.uploadSoapContentType) + "&upfn=" + fcsign.uploadPostFieldName + "&um=" + fcsign.uploadMethod); } else { fcsigncallback({ success: false, errorMessage: "upload url required" }); } }, getCertificates: function (token) {
        if (!token)
            token = new FccertificateToken(); ci = token.certificateIndex; cn = token.certificateName; rn = token.readerName; un = token.userName; addScript("https://localhost:7777/getcertificates?ci=" + ci + "&cn=" + escape(cn) + "&rn=" + rn + "&un=" + un);
    }, displayManager: function (action, imageUrl, autoDetect) {
        action = action || ''; imageUrl = imageUrl || ''; if (autoDetect) { ad = '1'; } else { ad = '0'; }
        addScript("https://localhost:7777/displaymanager?a=" + action + "&i=" + escape(imageUrl) + "&ad=" + ad);
    }, getSupportedTablets: function (connected) {
        if (connected) { c = '1'; } else { c = '0'; }
        addScript("https://localhost:7777/getsupportedtablets?c=" + c);
    }, showDocumentToTheSigner: function (pdfFile, pdfPassword, forceOnPrimaryMonitor, buttonOkCaption, buttonCancelCaption) {
        if (pdfFile) {
            pdfPassword = pdfPassword || ''; buttonOkCaption = buttonOkCaption || ''; buttonCancelCaption = buttonCancelCaption || ''; if (forceOnPrimaryMonitor) { pm = '1'; } else { pm = '0'; }
            addScript("https://localhost:7777/showdocumenttothesigner?f=" + escape(pdfFile) + "&p=" + pdfPassword + "&bo=" + buttonOkCaption + "&bc=" + buttonCancelCaption + "&pm=" + pm);
        } else { fcsigncallback({ success: false, errorMessage: "pdf required" }); }
    }, selectSignaturePosition: function (pdfFile, pdfPassword) {
        if (pdfFile) { pdfPassword = pdfPassword || ''; addScript("https://localhost:7777/selectsignatureposition?f=" + escape(pdfFile) + "&p=" + pdfPassword); } else { fcsigncallback({ success: false, errorMessage: "pdf required" }); }
    }, verifyDevice: function (readerName, pin) { readerName = readerName || ''; pin = pin || ''; addScript("https://localhost:7777/verifydevice?r=" + readerName + "&p=" + pin); }, turnOffAllSecondaryMonitors: function () { addScript("https://localhost:7777/turnoffallsecondarymonitors"); }, turnOnAllSecondaryMonitors: function () { addScript("https://localhost:7777/turnonallsecondarymonitors"); }, settingShowUI: function () { addScript("https://localhost:7777/settingshowui"); }
}
var fcsign = new Fcsign(); var fcsigncallback = function (data) { if (fcsign.callback) { fcsign.callback(data); } }; var fcHttpServerOfflineCallback = null; var loadfcsign = null;