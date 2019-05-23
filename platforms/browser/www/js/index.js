/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var platform;

$(document).ready(function () {

    $("#search-weather").click(function () {

        var cityName = $("#city-name").val();

        if (platform !== "browser")
            app.requestLocationAccuracy();


        app.fetchWeatherData("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=54145e34e64723b664c1d0a2e51e6ac0");
    })
});


var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },



    //////////////////////////////////////////////////


    //////////////////////////////////////////////////


    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        platform = cordova.platformId;
    },

    fetchWeatherData: function (url) {
        $('#loading-btn').show();
        $('#search-weather').hide();

        $.ajax({
            type: "GET",
            dataType: 'jsonp',
            url: url,
            success: app.onSuccess,
            error: app.onError,
            complete: function(){
                $('#loading-btn').hide();
                $('#search-weather').show();
              }
        });
    },

    onSuccess: function (data) {

        console.log(data);

        $("#condition").text(data.weather[0].main);
        $("#location").text(data.name + ', ' + data.sys.country);
        $("#temp").text(data.main.temp);


    },

    onError: function (data, textStatus, errorThrown) {
        console.error('Data: ' + JSON.stringify(data));
        console.error('Status: ' + textStatus);
        console.error('Error: ' + errorThrown);
    },


    ////////////////////////////////////////////

    onLocationError: function (error) {
        console.error("The following error occurred: " + error);
    },

    handleLocationAuthorizationStatus: function (status) {
        switch (status) {
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                if (platform === "ios") {
                    onError("Location services is already switched ON");
                } else {
                    _makeRequest();
                }
                break;
            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                requestLocationAuthorization();
                break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED:
                if (platform === "android") {
                    onError("User denied permission to use location");
                } else {
                    _makeRequest();
                }
                break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                // Android only
                onError("User denied permission to use location");
                break;
            case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                // iOS only
                onError("Location services is already switched ON");
                break;
        }
    },

    requestLocationAuthorization: function () {
        cordova.plugins.diagnostic.requestLocationAuthorization(app.handleLocationAuthorizationStatus, app.onLocationError);
    },

    requestLocationAccuracy: function () {
        cordova.plugins.diagnostic.getLocationAuthorizationStatus(app.handleLocationAuthorizationStatus, app.onLocationError);
    },

    _makeRequest: function () {
        cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
            if (canRequest) {
                cordova.plugins.locationAccuracy.request(function () {
                    handleSuccess("Location accuracy request successful");
                }, function (error) {
                    onError("Error requesting location accuracy: " + JSON.stringify(error));
                    if (error) {
                        // Android only
                        onError("error code=" + error.code + "; error message=" + error.message);
                        if (platform === "android" && error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                            if (window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")) {
                                cordova.plugins.diagnostic.switchToLocationSettings();
                            }
                        }
                    }
                }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
                );
            } else {
                // On iOS, this will occur if Location Services is currently on OR a request is currently in progress.
                // On Android, this will occur if the app doesn't have authorization to use location.
                onError("Cannot request location accuracy");
            }
        });
    },

};

app.initialize();