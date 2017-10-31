//This file injects javascript into the page itself
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(request.message);
		if(request.message === "make-annotations") {
			console.log("ABSBASKBASJLBDKJASB");
			//this section allows annotation to appear
			var my_awesome_script = document.createElement('script');
			my_awesome_script.setAttribute('async','async');
			my_awesome_script.setAttribute('src','//genius.codes');
			document.body.appendChild(my_awesome_script);
			chrome.runtime.sendMessage({"message": "annotations allowed"});
		}
	}
);

// function httpGetAsync(theUrl, callback)
// {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() { 
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
//             callback(xmlHttp.responseText);
//     }
//     xmlHttp.open("GET", theUrl, true); // true for asynchronous 
//     xmlHttp.send(null);
// }

// httpGetAsync('http://localhost:3000/pythonTest', console.log)

$.get('https://localhost/pythonTest', function(data, status){
	text = document.body.innerText; //this gets the text on the website
	address = window.location.toString(); //this gets the url
	console.log("tryna make a get request");
	console.log(data);
});
