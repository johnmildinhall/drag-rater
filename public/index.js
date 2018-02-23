function start(){
  var elem = document.querySelector('.dragger');
  var container = document.querySelector('.container');
  var ID = makeid();
  var draggie = new Draggabilly( elem, {
    
  });
  var config = {
    apiKey: "AIzaSyAVpuazHmoypHPGuUge95p9swwL9gsiQtI",
    authDomain: "drag-rater.firebaseapp.com",
    databaseURL: "https://drag-rater.firebaseio.com",
    projectId: "drag-rater",
    storageBucket: "drag-rater.appspot.com",
    messagingSenderId: "263242634898"
  };
  firebase.initializeApp(config);
  var ref = firebase.database().ref();

  console.log('hello');

  myDragger();
  allDraggers();

  function normalise(x,y){
    var normX = Math.floor((100/window.innerWidth)*x);
    var normY = Math.floor((100/window.innerHeight)*y);
    return [normX, normY];
  }

  function denormalise(x,y){
    var X = x * (window.innerWidth / 100);
    var Y = y * (window.innerHeight / 100);
    return [X,Y];
  }

  function myDragger(){
    draggie.on( 'dragMove', function( event, pointer ) {
      var location = normalise(pointer.pageX, pointer.pageY);

      firebase.database().ref('voting/' + ID).set({
          "x" : location[0]
        , "y" : location[1]
      });

    })
    // Initialize Firebase
  }

  function allDraggers(){

    //get all existing nodes, add new ones
    firebase.database().ref('voting/').on("child_added", function(snapshot) {
      if(snapshot.key!=ID){
        console.log(snapshot.val());
        // var value = snapshot.val();
        var x = snapshot.val().x;
        var y = snapshot.val().y;
        var location = denormalise(x, y);
        var other = document.querySelector('#proto.other').cloneNode(true);
        other.style.display = "inline";
        other.style.left = location[0];
        other.style.top = location[1];
        other.id = snapshot.key;
        container.appendChild(other);         
      }
  
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    //if a node changes
    firebase.database().ref('voting/').on("child_changed", function(snapshot) {
      if(snapshot.key!=ID){
        var x = snapshot.val().x;
        var y = snapshot.val().y;
        var location = denormalise(x, y);
        var dragger = document.querySelector('#'+snapshot.key+'.other');
        dragger.style.left = location[0];
        dragger.style.top = location[1];
      }
    });

  }

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}