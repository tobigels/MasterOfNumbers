angular.module('starter.controllers', [])

// Instruction-Controller
.controller('InstructionCtrl', function ($scope, $state) {

  var instruction_heading = document.getElementById("instruction_heading");
  var instruction_content = document.getElementById("instruction_content");
  var instruction_picture = document.getElementById("instruction_picture");
  var instruction_next = document.getElementById("instructionButton");

  var counter = 1;

  var headings = ["Was ist das MasterSystem?",
  "Worte aus Zahlen",
  "Ein Beispiel",
  "Die Zuordnung",
  "Doppelte Konsonanten"];

  var contents = ["Das Mastersystem ist ein System zum Merken von Zahlen. Basierend auf der Erkenntnis, dass der Mensch sich viel leichter Bilder als Zahlen merken kann, werden Zahlen in Worte gewandelt",
  "Alle Konsonanten werden in Gruppen eingeteilt und Zahlen zugeordnet. Diese Konsonanten müssen dann nur noch sinnvoll durch Vokale ergänzt werden, um Worte zu erhalten",
  "Die Zahl 5821 wird nach dem Mastersystem zu der Konsonantengruppe LFNT daraus kann das Wort Elefant gebildet werden",
  "Um das MasterSystem anwenden zu können muss der Nutzer die Zahl-Konsonanten-Paare lernen. Diese sind so gewählt, dass die Buchstaben möglichst ähnlich sind",
  "Benachbarte Konsonanten derselben Gruppe werden zu einer Zahl zusammengefasst"];

  var pictures = ["img/page_one.png","img/page_two.png","img/page_three.png","img/page_four.png","img/page_five.png"];

  $scope.nextCard = function() {
    console.log("nextCard "+ counter);
    if(counter >= pictures.length) {
      counter = 0;
      $state.go('home');
    }
    instruction_heading.innerHTML = headings[counter];
    instruction_content.innerHTML = contents[counter];
    instruction_picture.setAttribute("src",pictures[counter]);
    counter++;
  };

})

// Game-Controller
.controller('GameCtrl', function ($scope, Words, $ionicPopup, $cordovaFile, $state) {

  var inputTextField = document.getElementById("inputText");
  var displayedNumber = document.getElementById("number");
  var tips = document.getElementById("tips");
  var tipstext = document.getElementById("tipstext");

  var inputTextValue;
  var processedTextValue;
  var index;
  var index_inside;
  var letter;
  var number_view = "";
  var number_calc = "";
  var prev_num;
  var toBeProcessed = "";
  var solved;
  var searchedNumber;
  var alreadySolved = 0;
  var firstTimeWrong = 0;
  var helpNeeded = 0;
  var maxSolved = 5;
  var firstTimeRight = true;

  $scope.wordsArray = Words.all();
  generateNumber();

  $scope.wordSubmitted = function () {
    console.log("wordSubmitted");

    $scope.singleArray = Words.single(searchedNumber);
    inputTextValue = inputTextField.value;
    processWord(inputTextValue);
    inputTextField.value = "";
  };

  $scope.helpNeeded = function() {
    console.log("helpNeeded")

    $state.go('numbertable', {param1: 1});
  };

  $scope.showTips = function () {
    console.log("showTips");

    $scope.singleArray = Words.single(searchedNumber);
    helpNeeded++;
    tips.style.display = "block";
  };

  function toDictionary() {
    console.log("dictButton: "+searchedNumber +" | "+inputTextValue);

    //Wort hinzufügen
    $scope.addWord = Words.addWord(searchedNumber,inputTextValue);

    //Wort abspeichern if app is on android
    if(ionic.Platform.isAndroid()) {
      saveWords();
    }
    inputTextValue = '';
    generateNumber();
  };

  function saveWords() {
    ionic.Platform.ready(function() {

      var json = Words.all();
      $cordovaFile.writeFile(cordova.file.dataDirectory, "two_digit_words.json", JSON.stringify(json), true).then(function(success) {
        console.log("success saveWord");
      }, function(error) {
        console.log("error saveWord");
      });
    });
  }

  function processWord(textValue) {
    console.log("Wortwert: " + textValue);

    if (textValue == "") {
      console.log("eintrag ist leer");
      var alertPopup = $ionicPopup.alert({
        title: 'Eintrag ist leer'
      });
    } else {
      //make sure you got only lowercase
      processedTextValue = textValue.toLocaleLowerCase();

      //reset number
      number = "";

      //index through word
      index_inside = 0;
      solved = true;
      prev_num = "#";
      for (index = 0; index < processedTextValue.length; index++) {
        letter = processedTextValue.charCodeAt(index);
        console.log("-" + letter);
        switch(letter) {
          case 115:
          case 122:
          case 120:
            addNumber("0");
            break;
          case 116:
          case 100:
            addNumber("1");
            break;
          case 110:
            addNumber("2");
            break;
          case 109:
            addNumber("3");
            break;
          case 114:
            addNumber("4");
            break;
          case 108:
            addNumber("5");
            break;
          case 106:
          case 103:
          case 104:
          case 121:
            addNumber("6");
            break;
          case 107:
          case 99:
          case 113:
            addNumber("7");
            break;
          case 102:
          case 118:
          case 119:
            addNumber("8");
            break;
          case 112:
          case 98:
            addNumber("9");
            break;
          default:
            console.log("wrong character");
            addNumber("#");
            break;
        }
      }
      console.log("number View: " + number_view + " number Calc: " + number_calc);
      showResultScreen();
    }
  };

  //check for double numbers
  function addNumber(toAdd) {
    var linkClass = "correct";
    if (toAdd != "#") {
      if (toAdd != prev_num) {
        number_view = number_view + toAdd;
        if(toAdd != displayedNumber.textContent.charAt(index_inside)) {
          linkClass = "incorrect";
          solved = false;
        }
      }
      toBeProcessed = toBeProcessed + "<a class='input_word " + linkClass + "'>" + inputTextValue.charAt(index) + "</a>";
      index_inside++;
    } else {
      toBeProcessed = toBeProcessed + "<a class='input_word'>" + inputTextValue.charAt(index) + "</a>";
    }
    number_calc = number_calc + toAdd;
    prev_num = toAdd;
  };

  function generateNumber() {
    if(!firstTimeRight) {
      firstTimeWrong++;
      firstTimeRight = true;
    }
    alreadySolved++;
    if(alreadySolved < maxSolved) {
      console.log("generateNumber");
      console.log(alreadySolved);
      searchedNumber = Math.floor((Math.random() * 99) + 1);
      displayedNumber.innerHTML = searchedNumber;
      tips.style.display = "none"; 
    } else {
      console.log(helpNeeded+" | "+alreadySolved+" | "+firstTimeWrong);
        
      //send values in url
      $state.go('result', {param1: helpNeeded, param2: alreadySolved, param3: firstTimeWrong});
      helpNeeded = 0;
      alreadySolved = 0;
      firstTimeWrong = 0;
    }
  };

  function showResultScreen() {
    console.log("showresultscreen");
    var resultPopup;
    if(solved) {

      //input correct
      if(checkNumber(inputTextValue)) {
        resultPopup = $ionicPopup.show({
          title: toBeProcessed,
          subTitle: "<h1>korrekt!</h1>",
          buttons: [{
            text: 'Nächstes Wort',
            type: 'button-positive',
            onTap: function(e) {
              generateNumber();
            }
          }]
        });  
      } else {
        resultPopup = $ionicPopup.show({
          title: '<div id="resultWord">'+toBeProcessed+'</div>',
          subTitle: "<h1>korrekt!</h1><p>Wort ins Wörterbuch?</p>",
          buttons: [{
            text: 'Ja',
            type: 'button-positive',
            onTap: function(e) {
              toDictionary();
            }
          },
          {
            text: 'Nein',
            type: 'button-positive',
            onTap: function(e) {
              generateNumber();
            }
          }]
        });
      }
    } else {

      //input incorrect
      resultPopup = $ionicPopup.show({
        title: toBeProcessed,
        subTitle: "Leider Falsch!",
        buttons: [{
          text: "Nochmal versuchen",
          type: 'button-positive',
          onTap: function(e) {
            firstTimeRight = false;
          }
        }]
      });
    }
    toBeProcessed = "";
  };

  function checkNumber(input) {

    for(var j=0; j<$scope.singleArray[0].length; j++) {
      console.log("in checknumber: "+$scope.singleArray[0][j]);
      if($scope.singleArray[0][j].localeCompare(input) == 0) {
        console.log("already exists");
        return true;
      }
    }
    return false;
  }
})

//Dicitionary-Controller
.controller('DictionaryCtrl', function ($scope, Words) {
  $scope.wordsArray = Words.all();
})

//Numbertable-Controller
.controller('NumbertableCtrl', function ($scope, $stateParams) {
  var param = $stateParams.param1;
  var numbertable_back = document.getElementById("numbertable_back");

  if(param == 1) {
    numbertable_back.setAttribute("href","#/game");
  } else {
    numbertable_back.setAttribute("href","#/home");
  }
})

//Result-Controller
.controller('ResultCtrl', function ($scope, $stateParams) {
  var result_helpNeeded = document.getElementById("result_helpNeeded");
  var result_alreadySolved = document.getElementById("result_alreadySolved");
  var result_firstTimeWrong = document.getElementById("result_firstTimeWrong");

  //get url parameters
  result_helpNeeded.innerHTML = $stateParams.param1;
  result_alreadySolved.innerHTML = $stateParams.param2;
  result_firstTimeWrong.innerHTML = $stateParams.param3;
})

//Home-Controller
.controller('HomeCtrl', function ($scope, Startup, $ionicPopup, $http, $cordovaFile, Words) {
  Startup.setInitialRun(true);

  //detect initial start
  if(Startup.isInitialRun()) {
    Startup.setInitialRun(false);
    var words = [];

    //get initial data from application-folder (only read)
    $http.get('two_digit_words.json').then(
      function (result) {
        for (var i = 0; i < result.data.length; i++) {
          words.push(result.data[i]);
        }
      }
    );
    var alertPopup = $ionicPopup.alert({
      title: "die Anleitung hilft dir das Mastersystem zu verstehen"
    });
    if(ionic.Platform.isAndroid()) {
      ionic.Platform.ready(
        function() {

          //write initial data to dataDirectory (read and write)
          $cordovaFile.writeFile(cordova.file.dataDirectory, "two_digit_words.json", JSON.stringify(words), true).then(
            function(success) {
              console.log("success saveWord");
            }, function(error) {
              console.log("error saveWord");
            }
          );
        }
      );
    }
  }
})

//Settings-Controller
.controller('SettingsCtrl', function () {

});
