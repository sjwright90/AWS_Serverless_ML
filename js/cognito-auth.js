/*
This file contains the functions for the Auth object, which is used to manage the user authentication.
The Auth object is used to check if the user is authenticated, get the current authentication token, and sign out the user.
Configuration settings for the Cognito user pool are stored in the config.js file.
*/

var Auth = window.Auth || {};

(function scopeWrapper($) {
    // Get the configuration settings from the config.js file
    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId,
    };

    // Create a new instance of the CognitoUserPool object
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    // Define the functions for the Auth object
    Auth.getCurrentUser = function () {
        return userPool.getCurrentUser();
    };

    // Check if the user is authenticated
    Auth.isAuthenticated = function (callback) {
        var cognitoUser = Auth.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function (err, session) {
                if (err || !session.isValid()) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        } else {
            callback(false);
        }
    };

    // Redirect to the sign-in page if the user is not authenticated
    Auth.redirectIfNotAuthenticated = function (redirectUrl) {
        Auth.isAuthenticated(function (isAuthenticated) {
            if (!isAuthenticated) {
                alert('You must be signed in to access the page');
                window.location.replace(redirectUrl);
            } else {
                $('#predictProbaLoading').hide();
                $('#predictProbaContent').show();
            }
        });
    };

    // Get the current authentication token
    Auth.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        Auth.isAuthenticated(function (isAuthenticated) {
            if (!isAuthenticated) {
                resolve(null);
            } else {
                var cognitoUser = userPool.getCurrentUser();
                cognitoUser.getSession(function sessionCallback(err, session) {
                    if (err) {
                        reject(err);
                    } else if (!session.isValid()) {
                        resolve(null);
                    } else {
                        resolve(session.getIdToken().getJwtToken());
                    }
                });
            }
        });
    });


    // Sign in the user
    Auth.signOut = function () {
        var cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
            cognitoUser.signOut();
            window.location.replace('index.html');
        }
    };

}(jQuery));
