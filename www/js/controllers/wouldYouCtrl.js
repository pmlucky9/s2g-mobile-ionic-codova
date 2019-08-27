angular.module('app.controllers')

// Controller for the left-menu button
.controller('wouldYouCtrl', function($scope, $filter, $state, $stateParams, $ionicModal, S2gApi, UserService, $ionicSlideBoxDelegate, $ionicLoading, WouldYouStorage) {
  'use strict';
  /*
   * MANAGING THE STATE OF WOULD YOU
   *
   * $scope.state is set to a string based on the user's situation
   * and to ensure that only one state is active at a time
   *
   * 'showIntro' -> User first enters Would You? pages, check do not ask
   * 'showQuestions' -> Present questions to user for session
   * 'setComplete' -> User completed a round of 15 questions
   * 'endOfQuestions' -> User has answered ALL neighborhood questions
   * 'autoCreate' -> User can auto-create items
  */
  $scope.state = "showIntro";
  var storage, questions, interestItems, newQuestions = [], questionIndex, calledGetQuestions;
  $scope.questionsLoaded = false;
  calledGetQuestions = false;
  var type = $scope.type = $stateParams.type;
  $scope.neighborhood = UserService.neighborhoodObj.name;

  $scope.logo = "http://cdn2.business2community.com/wp-content/uploads/2013/10/neighborhood.jpg.jpg";
  $scope.victoryImage = 'http://media.asicdn.com/images/jpgo/5460000/5463689.jpg';

  function startSession() {
    storage = WouldYouStorage.get();
    setQuestions( storage[type].questions );
    setQuestionIndex( storage[type].questionIndex );
    $scope.interestItems = interestItems = storage[type].interestItems;
    $scope.skipIntro = !storage[type].showIntro;

    if (questions.length && questions[questionIndex].end_of_questions) {
      showLoading();
      getQuestions( function () {
        if (!newQuestions[0].end_of_questions) {
          resetQuestions();
        } else {
          $scope.state = 'endOfQuestions';
        }
        hideLoading();
      });
    } else {
      // Check if user previously answered all questions
      if (questionIndex - 1 >= questions.length) {
        console.log('All questions answered');
        setQuestions( [] );
        setQuestionIndex( 0 );
        saveSession();
      }

      if ($scope.skipIntro === true) {
        $scope.state = 'showQuestions';
      }

      if (storage[type].questions.length === 0) {
        calledGetQuestions = true;
        getQuestions( function () {
          if (questions[0].end_of_questions) {
            $scope.state = 'endOfQuestions';
          }
        });
      } else {
        $scope.questionsLoaded = true;
      }
    }
  };

  // Persist session to localstorage
  function saveSession() {
    WouldYouStorage.store(storage);
  };

  // Set question index
  function setQuestionIndex(i) {
    $scope.questionIndex = questionIndex = storage[type].questionIndex = i;
  };

  // Update all pointers to questions
  function setQuestions(qs) {
    questions = $scope.questions = storage[type].questions = qs;
    if (questions.length && questions[questions.length - 1].end_of_questions) {
      $scope.slideCount = questions.length - 1;
    } else {
      $scope.slideCount = questions.length;
    }
    $scope.questionsLoaded = true;
  };

  // Reset interest items
  function resetInterestItems(items) {
    $scope.interestItems = interestItems = storage[type].interestItems = items;
  };

  // Start the Would You? session on load
  startSession();

  // Handle user preference to skip intro
  $scope.exitIntro = function () {
    if ($scope.skipIntro === false) {
      storage[type].showIntro = false;
      saveSession();
    }
    $scope.state = 'showQuestions';
    $ionicSlideBoxDelegate.update();
  };

  // Request new questions from server (default === 15)
  function getQuestions( callback ) {
    if (!callback) {
      callback = function () {};
    }
    var exclude = [], query;
    for (var i = 0, length = questions.length; i < length; ++i) {
      if (questions[i].id) {
        exclude.push(questions[i].id);
      }
    }
    // Exclude any questions the user already has
    if (exclude.length) {
      query = {
        exclude: exclude.join()
      };
    }

    S2gApi
      .getWouldyou(UserService, type, query)
      .then( function (response) {
        console.log(response);
        // The API finds new questions based off of what the user has not
        // responded to and a relevance algorithm. However, if this controller
        // has questions that the user has not submitted a response to yet,
        // the API does not know that and may return those questions again until
        // pagination is fully supported on service. Until pagination is fully 
        // supported, we will manually need to make sure that we're not adding
        // duplicates to $scope.questions
        // TODO Handle this more elegantly
        if (questions.length) {
          newQuestions = response.data;
        } else {
          setQuestions(response.data);
          saveSession();
          $ionicSlideBoxDelegate.update();
        }
        calledGetQuestions = false;
        callback( null );
      }, function (reason) {
        // TODO Need to handle error
        console.log(reason);
        callback( reason );
      });
  };
  
  //-- NAVIGATE SLIDES 
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };

  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  $scope.answer = function(response, index){
    $scope.questions[index].response = response;
    // Save all samples where user responded 'yes'
    // If lend, user will have opportunity to auto-create items
    // If borrow, saved for future functionality
    if (response) {
      var sample = $scope.questions[index].sample;
      sample.save = true;
      sample.question = $scope.questions[index].id;
      sample.inventory = $scope.questions[index].itemInventory;
      interestItems.push( sample );
    }
    console.log('advancing slide');
    if (index === questions.length - 1) {
      setQuestionIndex( index + 1 );
      if (!newQuestions.length && !calledGetQuestions) {
        getQuestions();
        calledGetQuestions = true;
      }
      if (type === 'lend' && interestItems.length) {
        $scope.state = 'autoCreate';
      } else {
        $scope.state = 'setComplete';  
      }
    } else {
      $ionicSlideBoxDelegate.next();
    }
    saveSession();

    S2gApi
      .saveWouldyouResponse(UserService, type, $scope.questions[index].id, response)
      .then( function(response) {
        console.log(response);
      }, function(reason) {
        // TODO Handle error case
        console.log(reason);
      });
  };

  $scope.completeSet = function () {
    if (questionIndex === 0) {
      $scope.state = 'setComplete';
    } else if (questions[questionIndex].end_of_questions) {
      $scope.state = 'endOfQuestions';
    } else {
      $scope.closeWouldYou();
    }
  };

  $scope.slideChanged = function(index) {
    // If user used slider as response, set response to false
    if (questions[index - 1] && questions[index - 1].response === undefined) {
      var response = questions[index - 1].response = false;
      saveSession();

      S2gApi
        .saveWouldyouResponse(UserService, type, questions[index - 1].id, response)
        .then( function(response) {
          console.log(response);
        }, function(reason) {
          // TODO Handle error case
          console.log(reason);
        });
    }
    //we load more when we get n away from the end and only if going forward
    var n = 5;
    if ($scope.questions[index].end_of_questions) {
      if (type === 'lend' && interestItems.length) {
        $scope.state = 'autoCreate';
      } else {
        $scope.state = 'endOfQuestions';
      }
    } else if ( $scope.slideCount - index <= n && !calledGetQuestions && !newQuestions.length){
      getQuestions();
      calledGetQuestions = true;
    } 
    console.log('slide changed');
    setQuestionIndex( index );
    saveSession();
    $ionicSlideBoxDelegate.update();
  };
  
  //-- MANAGE QUESTIONS
  $scope.finishQuestions = function () {
    // $scope.slideCount = $scope.questions.length;
    // $ionicSlideBoxDelegate.update();
    if (interestItems.length > 0 && type === 'lend') {      
      $scope.state = 'autoCreate';
    } else {
      $scope.closeWouldYou();
    }
  };

  // User wants to continue anwering questions, so we load them
  $scope.loadMoreQuestions = function () {
    if (newQuestions.length) {
      resetQuestions();
    } 
    // If getQuestions has been called be the user has not received the
    // results, wait until they're back.
    else if (calledGetQuestions) {
      waitForQuestions();
    }
    // Otherwise, call getQuestions and prepare them for user
    else {
      getQuestions(resetQuestions);
      calledGetQuestions = true;
    }
  };

  // Set questions to newQuestions and save to localStorage
  function resetQuestions(err) {
    if (err) {
      return console.log(err);
    }
    setQuestions( newQuestions );
    newQuestions = [];
    setQuestionIndex( 0 );
    saveSession();
    $ionicSlideBoxDelegate.update();
    $scope.state = 'showQuestions';
  };

  // Wait until questions have been loaded from the server, and then
  // move those questions to the current questions
  function waitForQuestions() {
    var interval = window.setInterval( function () {
      if (newQuestions.length) {
        resetQuestions();
        window.clearTimeout(interval);
      }
    }, 100);
  };

  // Go to auto create screen
  $scope.goAutoCreate = function () {
    console.log(interestItems);
    $scope.state = 'autoCreate';
  };

  $scope.setToggle = true;
  $scope.toggleAll = function() {
    var items = $scope.interestItems;
    if($scope.setToggle){
      $scope.setToggle = false;
    } else {
      $scope.setToggle = true;
    }
    for (var i = 0, length = items.length; i < length; ++i) {
      items[i].save = $scope.setToggle;
    }
  }

  $scope.deselectItem = function(index){
    var response = $scope.interestItems[index].save;
    if (response === false) {
      $scope.interestItems[index].save = true;
    } else {
      $scope.interestItems[index].save = false;
    }
  }

  // Create items based on samples
  $scope.autoCreateItems = function() {
    var newItems = [];
    for (var i = 0, length = interestItems.length; i < length; ++i) {
      if (interestItems[i].save && interestItems[i].inventory < 1) {
        interestItems[i].description = 'Sample Description';
        newItems.push( interestItems[i] );
      }
    }

    if (newItems.length) {
      S2gApi.saveItemList({
        username: UserService.username,
        token: UserService.token,
        item: newItems
      }).then(
        function(response) {
          console.log(response);
        },
        function(reason) {
          // TODO Handle error case
          console.log("error", reason);
        });
    } 
    resetInterestItems([]);
    saveSession();
     
    //TODO should put in success function when bulk save is delivered
    $scope.completeSet();
  };

  //---- CLOSE ACTION
  $scope.closeWouldYou = function (clearQuestions) {
    // If user finished a set, wipe questions and index for
    // the next time around.
    if (clearQuestions) {
      setQuestions([]);
      setQuestionIndex(0);
      if (type === 'borrow') {
        storage.borrow.interestItems = [];
      }
      saveSession();
    }
    //TODO clear out data;
    $state.go('main.items', { type: (type === 'lend' ? 'mine' : 'all') });
  };

  //---- LOADING UTILITY
  function showLoading() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };

  function hideLoading(){
    $ionicLoading.hide();
  };

});


