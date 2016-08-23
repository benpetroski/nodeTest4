// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =====
$(document).ready(function() {
    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Update link click
    $('#userList table tbody').on('click', 'td a.linkupdateuser', showUserInfoToUpdate);    

    // Delete user link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    // Add user button click
    $('#btnAddUser').on('click', addUser);

    // Update user button click
    $('#btnUpdateUser').on('click', updateUser);

});

// Functions =====

// Fill table with data
function populateTable() {
    // Empty context string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function(data) {
        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function() {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email +'</td>';
            tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id + '">update</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';            
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show user info
function showUserInfo(event) {
    // Prevent link from firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    // Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
};

// Show user info to update
function showUserInfoToUpdate(event) {
    // Prevent link from firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    // Populate Info Box
    document.getElementById("updateUserID").value = thisUserName;
    document.getElementById("updateUserName").value = thisUserObject.username;
    document.getElementById("updateUserEmail").value = thisUserObject.email;
    document.getElementById("updateUserFullname").value = thisUserObject.fullname;
    document.getElementById("updateUserAge").value = thisUserObject.age;
    document.getElementById("updateUserGender").value = thisUserObject.gender;
    document.getElementById("updateUserLocation").value = thisUserObject.location;
};

// Delete User
function deleteUser(event) {
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {
        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function(response) {
            // Check for a succesful (blank) response
            if (response.msg === '') {
            } else {
                alret('Error: ' + response.msg);
            }

            // Update the table
            populateTable();
        });
    } else {
        // If they said no to the confirm, do nothing
        return false;
    }
};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {
            // Check for successful (blank) response
            if (response.msg === '') {
                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            } else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    } else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields.');
        return false;
    }
};

// Update User
function updateUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#updateUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
        // If it is, compile all user info into one object
        var updateUser = {
            'id': $('#addUser fieldset input#updateUserID').val(),
            'username': $('#updateUser fieldset input#updateUserName').val(),
            'email': $('#updateUser fieldset input#updateUserEmail').val(),
            'fullname': $('#updateUser fieldset input#updateUserFullname').val(),
            'age': $('#updateUser fieldset input#updateUserAge').val(),
            'location': $('#updateUser fieldset input#updateUserLocation').val(),
            'gender': $('#updateUser fieldset input#updateUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'PUT',
            data: updateUser,
            url: '/users/putuser', //'/' + $('#updateUser fieldset input#updateUserID').val(),
            dataType: 'JSON'
        }).done(function( response ) {
            // Check for successful (blank) response
            if (response.msg === '') {
                // Clear the form inputs
                $('#updateUser fieldset input').val('');

                // Update the table
                populateTable();

            } else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    } else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields.');
        return false;
    }
};