<?php

// If you choose to use ENV vars to define these values, give this IdP its own env var names
// so you can define different values for each IdP, all starting with 'SAML2_'.$this_idp_env_id
$this_idp_env_id = 'PREPROD';

//This is variable is for simplesaml example only.
// For real IdP, you must set the url values in the 'idp' config to conform to the IdP's real urls.
$idp_host = env('SAML2_'.$this_idp_env_id.'_IDP_HOST', 'https://idptest.uniurb.it/');

return $settings = array(

    /*****
     * One Login Settings
     */

    // If 'strict' is True, then the PHP Toolkit will reject unsigned
    // or unencrypted messages if it expects them signed or encrypted
    // Also will reject the messages if not strictly follow the SAML
    // standard: Destination, NameId, Conditions ... are validated too.
    //'strict' => true, //@todo: make this depend on laravel config

    // Enable debug mode (to print errors)
    'debug' => env('APP_DEBUG', true),


    // Service Provider Data that we are deploying
    'sp' => array(
        
        // Specifies constraints on the name identifier to be used to
        // represent the requested subject.
        // Take a look on lib/Saml2/Constants.php to see the NameIdFormat supported
        'NameIDFormat' => 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',

        // Usually x509cert and privateKey of the SP are provided by files placed at
        // the certs folder. But we can also provide them with the following parameters
        'x509cert' => env('SAML2_SP_x509',''),
        'privateKey' => env('SAML2_SP_PRIVATEKEY',''),

        // Identifier (URI) of the SP entity.
        // Leave blank to use the 'saml_metadata' route.
        'entityId' => env('SAML2_SP_ENTITYID',''),

        // Specifies info about where and how the <AuthnResponse> message MUST be
        // returned to the requester, in this case our SP.
        'assertionConsumerService' => array(
            // URL Location where the <Response> from the IdP will be returned,
            // using HTTP-POST binding.
            // Leave blank to use the 'saml_acs' route
            'url' => '',
        ),
        // Specifies info about where and how the <Logout Response> message MUST be
        // returned to the requester, in this case our SP.
        // Remove this part to not include any URL Location in the metadata.
        'singleLogoutService' => array(
            // URL Location where the <Response> from the IdP will be returned,
            // using HTTP-Redirect binding.
            // Leave blank to use the 'saml_sls' route
            'url' => '',        
        ),
    ),

    // Identity Provider Data that we want connect with our SP
    'idp' => array(
        // Identifier of the IdP entity  (must be a URI)
        //https://idptest.uniurb.it/idp/shibboleth
        'entityId' => env('SAML2_IDP_ENTITYID', $idp_host.'idp/shibboleth'), //. 'idp/shibboleth'
        // SSO endpoint info of the IdP. (Authentication Request protocol)
        'singleSignOnService' => array(
            // URL Target of the IdP where the SP will send the Authentication Request Message,
            // using HTTP-Redirect binding.
            'url' => $idp_host.'idp/profile/SAML2/Redirect/SSO',
            
        ),
        // SLO endpoint info of the IdP.
        'singleLogoutService' => array(
            // URL Location of the IdP where the SP will send the SLO Request,
            // using HTTP-Redirect binding.
            //https://ds90p01.bib.uniurb.it/Shibboleth.sso/Logout?return=https://idp.uniurb.it/idp/profile/Logout
            'url' => $idp_host.'idp/profile/Logout',
        ),
        // Public x509 certificate of the IdP
        'x509cert' => env('SAML2_IDP_x509', 'MIIFhTCCA22gAwIBAgIJANN/ysx6nt9TMA0GCSqGSIb3DQEBCwUAMFgxCzAJBgNV
        BAYTAklUMQswCQYDVQQIDAJQVTEPMA0GA1UEBwwGVXJiaW5vMQ8wDQYDVQQKDAZV
        bml1cmIxGjAYBgNVBAMMEWlkcHRlc3QudW5pdXJiLml0MCAXDTE3MDMwOTE0NDgw
        NloYDzIxMTcwMjEzMTQ0ODA2WjBYMQswCQYDVQQGEwJJVDELMAkGA1UECAwCUFUx
        DzANBgNVBAcMBlVyYmlubzEPMA0GA1UECgwGVW5pdXJiMRowGAYDVQQDDBFpZHB0
        ZXN0LnVuaXVyYi5pdDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAMA+
        BQsFgWbk4eUg9NtHi6p2f4NiufdMfw0g4AR1fsLw8KXbEsndheEhwzCHlIFJeg8L
        0xvz4yn42xx6/ICyyUJBgsNv8v0dCL/gft04Jms1F7SaEfU2BNYHdZF1i08oDm96
        YXjS5M/P7X3mxPxDV0pzuseZ3ykgdIQcuG4q3L3lbmXOwoJh5u7LrxKmS3qwBcDC
        pQSf2OjfEZVCILANN7SXUAbW9celzD6QaM7TOL/UYHL+0dB35Q/HdNp5mxdNTEh7
        l79qljmRXWlVFS5KeTk3M0P3C2Ni3kHj5wP9mOPEAVS5efcWlV+vd2sHQnSoMfvK
        tiwAR9aKJ/ebfjcIHP1cLaeedJLFzcgkvgXm5bR+leOqGMLedndKjtKt8LjHqlgr
        GjJ8ICg86rlkhSRPbH1gq61LunzYhGn4AuQYNJYRnqTXu9U4kf2djYIQmezdVGMp
        lXBzzBeZcFcq7RjgSE0JLaRiW3lSD4DveAHlzrOvoTbO1T7vd/S3lYrad4d3pSFj
        a9RIpevF9MWOyPiwF4MD7tk4dHh//Cu/soSFDJX3c3xICSW09ukZQU3AfNVOa7Lv
        E6qF25SEaxz5MqSMTUXfafg4CsO0wPEuYnf6Xv6ffh8IWlUTMgvJi9Vmn34OqdJq
        msTN+g1UgdoVz2B8zAQzAbRaIxgddhkVVW7EqyxRAgMBAAGjUDBOMB0GA1UdDgQW
        BBQvjS4SHIKbxyolWYlFv6em4rJ3TjAfBgNVHSMEGDAWgBQvjS4SHIKbxyolWYlF
        v6em4rJ3TjAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBCwUAA4ICAQBpiWMKZHa8
        TW6GZ0BEO5POBPOWSUua8gYlBnlDLP9wUiRC0vOvmQa/EH7SNrCwYxtPOy9EL3Jo
        igH9gcRGRrQFgvuTV7pE9Bvw0NhcTllnHNGzHld/y93eZSakg+7M4B5Elx0RdRBc
        e09QvR0P0HGZkVrpdT9P1q6+AAUfbelpSQOBDgUwaZHXWmz3fb2iZ/oCQz13QxKi
        wdwQueK7090An4y4U9pjVII2b+E7rxQksZXGCRWbeZrEAXkqnuJoBoQQbIYgE2Lo
        0e9gNR8pvdLy76m9KNYq7v5Agqemwn+5rfYoknd4WePbD4zdndZxDEbdYLpn9eXB
        oSXiiX1BFgTgeVo+25EI0KRfoaeZvT4TD+04RdKr6XJDH02bs1fqcwv0cpsiAfIR
        hjmhu8Zcj3kVOo14II2LQblb4FL3ojFZNv9WXe+XPMJx2B6btV6FWXQ/s2yXkfsJ
        bjMITcD1H6kiZ8oWEMruXxtQPMrnn9p/nuAZpzl970q8oXe03y4sA7EPRodICtAt
        RDWRi9LvX2vpNkiMrTgm0WA2cTHCfa0JPd2DHlvFQSGNEpV0F3/OAZSp4/aPICnr
        76XZb0N5TnPYY+fA6mw9ftDHkdiVxCaaPD6mxlj/JUouFJkq+KlquVzA6LNr2rdF
        9PARtscKmMRcsOLB0ZoSokGbWS0qAazRIA=='),
        /*
         *  Instead of use the whole x509cert you can use a fingerprint
         *  (openssl x509 -noout -fingerprint -in "idp.crt" to generate it)
         */
        // 'certFingerprint' => '',
    ),



    /***
     *
     *  OneLogin advanced settings
     *
     *
     */
    // Security settings
    'security' => array(

        /** signatures and encryptions offered */

        // Indicates that the nameID of the <samlp:logoutRequest> sent by this SP
        // will be encrypted.
        'nameIdEncrypted' => false,

        // Indicates whether the <samlp:AuthnRequest> messages sent by this SP
        // will be signed.              [The Metadata of the SP will offer this info]
        'authnRequestsSigned' => false,

        // Indicates whether the <samlp:logoutRequest> messages sent by this SP
        // will be signed.
        'logoutRequestSigned' => false,

        // Indicates whether the <samlp:logoutResponse> messages sent by this SP
        // will be signed.
        'logoutResponseSigned' => false,

        /* Sign the Metadata
         False || True (use sp certs) || array (
                                                    keyFileName => 'metadata.key',
                                                    certFileName => 'metadata.crt'
                                                )
        */
        'signMetadata' => false,


        /** signatures and encryptions required **/

        // Indicates a requirement for the <samlp:Response>, <samlp:LogoutRequest> and
        // <samlp:LogoutResponse> elements received by this SP to be signed.
        'wantMessagesSigned' => false,

        // Indicates a requirement for the <saml:Assertion> elements received by
        // this SP to be signed.        [The Metadata of the SP will offer this info]
        'wantAssertionsSigned' => false,

        // Indicates a requirement for the NameID received by
        // this SP to be encrypted.
        'wantNameIdEncrypted' => false,

        'wantAssertionsEncrypted' => true,
        // Authentication context.
        // Set to false and no AuthContext will be sent in the AuthNRequest,
        // Set true or don't present thi parameter and you will get an AuthContext 'exact' 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'
        // Set an array with the possible auth context values: array ('urn:oasis:names:tc:SAML:2.0:ac:classes:Password', 'urn:oasis:names:tc:SAML:2.0:ac:classes:X509'),
        'requestedAuthnContext' => false,        

          //'signatureAlgorithm' => 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
        'signatureAlgorithm' => 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
      
        //'digestAlgorithm' =>  'http://www.w3.org/2000/09/xmldsig#sha1',
        'digestAlgorithm' => 'http://www.w3.org/2001/04/xmlenc#sha256',
    ),

    // Contact information template, it is recommended to suply a technical and support contacts
    'contactPerson' => array(
        'technical' => array(
            'givenName' => 'name',
            'emailAddress' => 'no@reply.com'
        ),
        'support' => array(
            'givenName' => 'Support',
            'emailAddress' => 'no@reply.com'
        ),
    ),

    // Organization information template, the info in en_US lang is recomended, add more if required
    'organization' => array(
        'en-US' => array(
            'name' => 'Name',
            'displayname' => 'Display Name',
            'url' => 'http://url'
        ),
    ),

/* Interoperable SAML 2.0 Web Browser SSO Profile [saml2int]   http://saml2int.org/profile/current
*/
  // 'authnRequestsSigned' => false,    // SP SHOULD NOT sign the <samlp:AuthnRequest>,
                                      // MUST NOT assume that the IdP validates the sign
  // 'wantAssertionsSigned' => true,
  // 'wantAssertionsEncrypted' => true, // MUST be enabled if SSL/HTTPs is disabled
  // 'wantNameIdEncrypted' => false,


);

