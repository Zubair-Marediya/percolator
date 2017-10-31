$(document).ready(function(){
	$("#buttonAddFriends").click(function(e) {
		name = $("#addFriendsName").val();
		friends = $("#addFriendsFriends").val();
		data = 
		{
			"Name" : name,
			"Friends" : friends
		};
		$.post( "/addFriends", data, function(data) {
	        $("#addFriendsResults").text(data['message']);
		}, "json");
	});

	$("#buttonGetFriends").click(function(e) {
		name = $("#getFriendsName").val();
		url = "/getFriends?Name=" + name;
	    $.get(url, function(data, status){
	        $("#getFriendsResults").text(data['Friends']);
	    });	    
	});

	$("#buttonDeleteFriendsTable").click(function(e) {
	    $.get("/deleteFriendsTable", function(data, status){
	        $("#deleteFriendsTableResults").text(data['message']);
	    });	 	
	});

	$("#buttonGetFriends").click(function(e) {
	});

	$("#buttonGetFriends").click(function(e) {
	});

	$("#buttonGetFriends").click(function(e) {
	});			



});