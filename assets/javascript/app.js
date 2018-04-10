$(document).ready(function () {

  // Initialize Firebase
  // Database website: https://console.firebase.google.com/project/train-scheduler-4905a/database/train-scheduler-4905a/data/
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

  // SEND FORM INPUT TO DATABASE ===============================================================================
  // Click event that pushes added trains to Firebase when the submit button is clicked, push creates new records each time a submission is entered
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
    // Resets form inputs to blank after the submit button is clicked
    $("input").val("");
  });

  database.ref().on("child_added", function (childSnapshot) {

    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var frequency = childSnapshot.val().frequency;

    console.log(name);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    // TIME CALCULATIONS
    // =========================================================================================

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(childSnapshot.val().firstTrainTime, "HH:mm").subtract(1, "years");
    console.log("first time converted: " + firstTimeConverted);

    // Current time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between current time and first train time (converted)
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minutes until next train
    var minsTillNextTrain = frequency - tRemainder;
    console.log("MINUTES TILL NEXT: " + minsTillNextTrain);

    // Next train time
    var nextTrainTime = moment().add(minsTillNextTrain, "minutes")
    console.log("ARRIVAL TIME: " + moment(nextTrainTime).format("HH:mm"));
    
    // Formatted nextTrainTime to AM/PM time format
    var nextArrival = moment(nextTrainTime).format("HH:mm");

    // APPEND TO TABLE =============================================================================
    // Appending a new row of table data - using ES6 syntax (templating) - when there is a child added to the root of our firebase database
    $(".table").append(
      `
    <tr>
      <td>${name}</td>
      <td>${destination}</td>
      <td>${frequency}</td>
      <td>${nextArrival}</td>
      <td>${minsTillNextTrain}</td>
    </tr>
    `
    )

    // Handle any errors
  }, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);

  });

});