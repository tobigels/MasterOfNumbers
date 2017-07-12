angular.module('starter.services',['ionic','ngCordova'])

    //factory for returning json-objects
    .factory('Words', function ($http) {
        var words = [];
        var word = [];

        if(ionic.Platform.isAndroid()) {

            //get data from dataDirectory
            $http.get('file:///data/data/com.masterOfNumbers/files/two_digit_words.json').then(
                function (result) {
                    for (var i = 0; i < result.data.length; i++) {
                        words.push(result.data[i]);
                    }
                }
            );
        } else {

            //get data from application-Directory
            $http.get('two_digit_words.json').then(
                function (result) {
                    for (var i = 0; i < result.data.length; i++) {
                        words.push(result.data[i]);
                    }
                }
            );
        }
        

        return {
            all: function () {
                return words;
            },
            single: function (id) {
                word = [];
                console.log("in singleWord");
                console.log(words[id].words);

                word.push(words[id].words);
                return word;
            },
            addWord: function (id, word) {
                console.log("in addWord");

                words[id].words.push(word);

                console.log(words[id].words);

                return words;
            }
        };
    })

    //factory for detecting initial launch
    .factory('Startup', function($window) {

        return {
            setInitialRun: function(initial) {
                $window.localStorage["initialRun"] = (initial ? "true" : "false");
            },
            isInitialRun: function() {
                var value = $window.localStorage["initialRun"] || "true";
                return value == "true";
            }
        }
    })

    //factory for Settings
    .factory('Settings', function($window) {
        return {
            
        }
    })
