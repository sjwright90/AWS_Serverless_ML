/*
This script submits the form data to the backend API to run inputs through the machine learning model.
The results are then displayed on the page.
Authentication is handled with functions from cognito-auth.js
*/

(function scopeWrapper($) {
    var signinUrl = 'index.html';
    var apiEndPoint = 'prod/endpoint';
    //Check authentication
    $(document).ready(function () {
        Auth.redirectIfNotAuthenticated(signinUrl);
    });


    // Set the authToken variable
    var authToken;
    Auth.authToken.then(function setAuthToken(token) {
        authToken = token;
    }
    ).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });
    
    // Function to call the predictProba API
    predictProba = function predictProba(var_1, var_2, var_3, var_4) {
        return new Promise(function (resolve, reject) {
            // Use the API endpoint URL from the config.js file, with the API endpoint path
            var url = _config.api.invokeUrl + apiEndPoint; 
            var body = {
                body: JSON.stringify({
                    var_1: var_1,
                    var_2: var_2,
                    var_3: var_3,
                    var_4: var_4
                }),
                isBase64Encoded: false
            };

            // Package up the inputs and send them to the backend API
            $.ajax({
                method: 'POST',
                url: url,
                headers: {
                    Authorization: authToken
                },
                data: JSON.stringify(body),
                contentType: 'application/json',
                success: function (result) {
                    resolve(result);
                },
                error: function ajaxError(jqXHR, textStatus, errorThrown) {
                    console.error('Error calculating: ', textStatus, ', Details: ', errorThrown);
                    console.error('Response: ', jqXHR.responseText);
                    reject('An error occured while calculating: ' + jqXHR.responseText
                        + ', ' + textStatus + ', ' + errorThrown
                    );
                }

            });
        });
    };
    // /*
    //  *  Event Handlers
    //  */

    $(function onDocReady() {
        $('#predictProbaForm').submit(handlePredictProba);
    });

    function handlePredictProba(event) {
        // Get the values from the form
        var var_1 = $('#var_1').val();
        var var_2 = $('#var_2').val();
        var var_3 = $('#var_3').val();
        var var_4 = $('#var_4').val();
        event.preventDefault();
        // Call the predictProba function
        predictProba(var_1, var_2, var_3, var_4).then(function (result) {
            try {
                // Expecting a JSON object with the result
                result = JSON.parse(result.body);
                // Extract the predicted probability from the result
                var predProba = result.pred_proba;
                var outcomeClass = outcomeClassification(predProba);
                // Display the result on the page, formatted with the outcomeClass
                $('#result').removeClass('good bad').text(predProba).addClass(outcomeClass);
                $('#report').text(reportClassification(predProba));
            } catch (error) {
                console.error('Error parsing result: ', error);
                alert('Error parsing result: ' + error);
            }
        }).catch(function (error) {
            alert('Error calculating: ' + error);
        });
    }
    /*
    Helper function to display the result.
    Allows for easy styling of the result based on custom probability threshold.
    */
    function outcomeClassification(predProba) {
        if (predProba <= 0.5) {
            return 'good';
        } else {
            return 'bad';
        }
    }

    function reportClassification(predProba) {
        if (predProba <= 0.5) {
            return 'Good result';
        } else {
            return 'Bad result';
        }
    }

}(jQuery));
