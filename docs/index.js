function start(){
  var elem = document.querySelector('.dragger');
  var container = document.querySelector('.container');
  var ID = makeid();
  var draggie = new Draggabilly( elem, {
    containment: '.container'
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
    var normX = parseFloat((100/window.innerWidth)*x).toFixed(2);
    var normY = parseFloat((100/window.innerHeight)*y).toFixed(2);
    if (normX < 0){normX = 0};
    if (normY < 0){normY = 0};
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
    
    draggie.on( 'dragEnd', function( event, pointer ) {
      console.log(pointer);
      var parent = pointer.srcElement.parentNode;
      console.log(parent);
      var expander = parent.querySelector('.expander');
      expander.className = "expander tomatoBorder large pulse";
      firebase.database().ref('voting/' + ID).update({
         "placed" : true
      });
      setTimeout(function(){ 
        expander.className = "expander tomatoBorder large";
        firebase.database().ref('voting/' + ID).update({
           "placed" : false
        });
      }, 500);
    })
  }

  function allDraggers(){

    //get all existing nodes, add new ones
    firebase.database().ref('voting/').on("child_added", function(snapshot) {
      if(snapshot.key!=ID){
        console.log(snapshot.val());
        // var value = snapshot.val();
        // var x = snapshot.val().x;
        // var y = snapshot.val().y;
        // var location = denormalise(x, y);
        var other = document.querySelector('#proto.other').cloneNode(true);
        other.style.display = "inline";
        other.style.left = snapshot.val().x+"%";
        other.style.top = snapshot.val().y+"%";
        other.id = snapshot.key;
        container.appendChild(other);         
      }
  
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    //if a node changes
    firebase.database().ref('voting/').on("child_changed", function(snapshot) {
      if(snapshot.key!=ID){
        var dragger = document.querySelector('#'+snapshot.key+'.other');
        dragger.style.left = snapshot.val().x+"%";
        dragger.style.top = snapshot.val().y+"%";

        //animate when other node is placed
        if( snapshot.val().placed === true ){
          var expander = dragger.querySelector('.expander');
          expander.className = "expander blueBorder small pulse";
          setTimeout(function(){ 
            expander.className = "expander blueBorder small";
          },500)
        }
      }
    });

  }

  function makeid() {
    var text = "a";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}
