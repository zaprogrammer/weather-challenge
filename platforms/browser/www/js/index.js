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

$(document).ready(function () {

    $("#searchWeather").click(function () {

        var cityName = $("#city-name").val();
        // alert(cityName);

        app.fetchWeatherData('https://samples.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=b6907d289e10d714a6e88b30761fae22');
    })
});

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        // this.receivedEvent('deviceready');
    },

    fetchWeatherData: function (url) {
        $.ajax({
            type: "GET",
            dataType: 'jsonp',
            url: url,
            success: app.onSuccess,
            error: app.onError
        });
    },

    onSuccess: function (data) {

        console.log(data);

        // if (data.hasOwnProperty('status')) {
        //     navigator.notification.alert('Please insert a valid feed!', null, 'Error', 'OK');
        // } else {
            // var items = [];
            // $.each(data, function (key, val) {
            //     var url = val['enclosure'].link
            //     items.push('<div class="card mb-3"> <img class="card-img-top img-responsive" src="' + url + '"> <div class="card-block"> <h4 class="card-title">' + val.title + '</h4> <p class="card-text">' + val.description + '</p> <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p> </div> </div>')
            // });
            // $('#feeds').html(items.join(''));
        // }
    },

    onError: function (data, textStatus, errorThrown) {
        console.error('Data: ' + JSON.stringify(data));
        console.error('Status: ' + textStatus);
        console.error('Error: ' + errorThrown);
    },

    // // Update DOM on a Received Event
    // receivedEvent: function(id) {

    // }
};

app.initialize();