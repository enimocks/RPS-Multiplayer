// Initialize Firebase
var config = {
  apiKey: "AIzaSyBjV2zPqqaNybxKX4aSkN0WcC9oCgo7m_8",
  authDomain: "train-scheduler-4905a.firebaseapp.com",
  databaseURL: "https://train-scheduler-4905a.firebaseio.com",
  projectId: "train-scheduler-4905a",
  storageBucket: "",
  messagingSenderId: "164021261126"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();


$(document).on("click", "#submit", function (event) {

  event.preventDefault();


  var name = $("#train-name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrainTime = $("#train-time").val().trim();
  var frequency = $("#frequency").val().trim();

  database.ref().push({
    name: name,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    timeAdded: firebase.database.ServerValue.TIMESTAMP
  });

  $("input").val("");
});

database.ref().on("child_added", function(childSnapshot) {

  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var frequency = childSnapshot.val().frequency;

  console.log(name);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);

  /* Appending a new row of table data - using ES6 syntax (templating) - when there is a child added to the root of our firebase database */
  $(".table").append(
    `
    <tr>
      <td>${name}</td>
      <td>${destination}</td>
      <td>${frequency}</td>
      <td></td>
      <td></td>
    </tr>
    `
  )
  
});