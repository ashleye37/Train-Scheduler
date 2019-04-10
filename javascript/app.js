$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDCrrns6tXQZrvWRF20RdzJ6TotNtPnAkQ",
        authDomain: "train-scheduler-436c6.firebaseapp.com",
        databaseURL: "https://train-scheduler-436c6.firebaseio.com",
        projectId: "train-scheduler-436c6",
        storageBucket: "train-scheduler-436c6.appspot.com",
        messagingSenderId: "893183482435"
    };
    firebase.initializeApp(config);

    //Defining my firebase database.
    var database = firebase.database();

    //Global variables
    var trainName = "";
    var destination = "";
    var trainTime = 0;
    var frequency = 0;
    var minutesAway = 0;
    var nextArrival = 0;
    var convertedArrival = [];

    //On click event that will take the data input in the "Add Train" container and runs the needed math in order to calculate the numbers needed, then pushing the calculated data to the database and then finally clearing all the input fields.
    $("#submit").on("click", function (event) {
        event.preventDefault();

        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        trainTime = $("#trainTime").val().trim();
        frequency = $("#frequency").val().trim();

        var convertedTime = moment(trainTime, "HH:mm").subtract(1, "years");
        var currentTime = moment();
        var timeDifference = moment().diff(moment(convertedTime), "minutes");
        var timeRemaining = timeDifference % frequency;

        minutesAway = frequency - timeRemaining;
        nextArrival = moment().add(minutesAway, "minutes");
        convertedArrival = moment(nextArrival).format('LT');

        var newTrain = {
            trainName,
            destination,
            frequency,
            convertedArrival,
            minutesAway
        };

        database.ref().push(newTrain);

        $("#trainName").val("");
        $("#destination").val("");
        $("#trainTime").val("");
        $("#frequency").val("");
    });

    
    database.ref().on("child_added", function (childSnapshot) {

        trainName = childSnapshot.val().trainName;
        destination = childSnapshot.val().destination;
        frequency = childSnapshot.val().frequency;
        nextArrival = childSnapshot.val().convertedArrival;
        minutesAway = childSnapshot.val().minutesAway;

        var newTrainRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(convertedArrival),
            $("<td>").text(minutesAway),
        );

        $("#trainTable").append(newTrainRow);
    });
});
