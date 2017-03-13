var locations = [
    [
        "Bibliocafe",
        48.463417, 
         -123.309940
    ],
    [
    		"MacLaurin Building",
        48.462781,
        -123.313481
    ],    
    [
        "Cinacenta",
        48.465357,
         -123.308224
    ],
]

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: new google.maps.LatLng(48.463152,  -123.311588),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2], locations[i][3]),
        map: map
      });

    var count = 0;

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
           if (locations[i][1]) {
            alert("Latitude,Longitude: 48.463417,-123.309940");
            alert(count++);
        } else if (locations[i][2]) {
            alert("Latitude,Longitude: 48.462781,-123.313481" + count);
            alert(count++);
        } else {
            alert("Latitude,Longitude: 48.465357,-123.308224" + count)
            alert(count++);
        };
        }
      })(marker, i));
    }


///////////////////////


//Test for browser compatibility
if (window.openDatabase) {
    //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("cars_db", "0.1", "A Database of Cars I Like", 1024 * 1024);

    //create the cars table using SQL for the database using a transaction
    mydb.transaction(function(t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY ASC, make TEXT, model TEXT)");
    });



} else {
    alert("WebSQL is not supported by your browser!");
}

//function to output the list of cars in the database

function updateCarList(transaction, results) {
		console.log(transaction);
    console.log(results);
    //initialise the listitems variable
    var listitems = "";
    //get the car list holder ul
    var listholder = document.getElementById("carlist");

    //clear cars list ul
    listholder.innerHTML = "";

    var i;
    //Iterate through the results
    for (i = 0; i < results.rows.length; i++) {
        //Get the current row
        var row = results.rows.item(i);

        listholder.innerHTML += "<li>" + row.make + " - " + row.model + " (<a href='javascript:void(0);' onclick='deleteCar(" + row.id + ");'>Delete Car</a>)";
    }

}

//function to get the list of cars from the database

function outputCars() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function(t) {
            t.executeSql("SELECT * FROM cars", [], updateCarList);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

//function to add the car to the database

function addCar() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //get the values of the make and model text inputs
        var make = document.getElementById("carmake").value;
        var model = document.getElementById("carmodel").value;

        //Test to ensure that the user has entered both a make and model
        if (make !== "" && model !== "") {
            //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
            mydb.transaction(function(t) {
                t.executeSql("INSERT INTO cars (make, model) VALUES (?, ?)", [make, model]);
                outputCars();
            });
        } else {
            alert("You must enter a make and model!");
        }
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}


//function to remove a car from the database, passed the row id as it's only parameter

function deleteCar(id) {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function(t) {
            t.executeSql("DELETE FROM cars WHERE id=?", [id], outputCars);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

outputCars();