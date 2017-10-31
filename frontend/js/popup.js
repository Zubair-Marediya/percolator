//Javascript logic that manages the popup interactions
/* global chrome */

function annotate() {
  //this is how you specifically send messages to the content page
  console.log("activating annotations now in popup.js");
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {"message": "make-annotations"});
  });
}
var ann = document.getElementById("make-annotations").onclick = annotate;

//this is how you listen to messages from background
if(chrome.runtime.onMessage){
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(request.message)
    }
  );
}

var filledStar = function() {
    box0 = document.getElementsByClassName("check0")[0].style.display;    
    box1 = document.getElementsByClassName("check1")[0].style.display;
    box2 = document.getElementsByClassName("check2")[0].style.display;
    box3 = document.getElementsByClassName("check3")[0].style.display;

    boxcolor0 = document.getElementsByClassName("checkbox0")[0].id;
    boxcolor1 = document.getElementsByClassName("checkbox1")[0].id;
    boxcolor2 = document.getElementsByClassName("checkbox2")[0].id;
    boxcolor3 = document.getElementsByClassName("checkbox3")[0].id;

    boxColors = [boxcolor0, boxcolor1, boxcolor2, boxcolor3];
    boxes = [box0, box1, box2, box3];
    colorSet = new Set();

    for (var i = 0; i < 4; i++) {
        if (boxes[i] != "none") {
            colorSet.add(boxColors[i]);
        }
    }
    console.log(colorSet);
    console.log(colorSet.size)
    if (colorSet.size >= 3) {
        blankStar = document.getElementsByClassName("glyphicon-star-empty")[0];
        blankStar.style.display = "none";
        filledStarElement = document.getElementsByClassName("glyphicon-star")[0];
        filledStarElement.style.display = "inline-block"
    }
};

var insertCheckAndOpenTab = function() {
    var url = this.getAttribute("id")
    var span = (this.getElementsByTagName("span")[0])
    span.style.display = "inline-block";
    checkboxClass = span.getAttribute("class")
    outerCheckbox = document.getElementsByClassName(checkboxClass)[0]
    outerCheckbox.style.display = "inline-block"
    filledStar();

    // Swap current article with the clicked one
    // header = document.getElementsByTagName("div")[0];
    // document.body.insertBefore(header, this);
    // header = document.getElementsByTagName("div")[0];
    // document.body.insertBefore(this, header);
    
    saveState()
    chrome.tabs.create({active: true, url: url});
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Homepage Link Button~~~~~~~~~~~~~~~~~~~~~~~~~~~
var link = document.getElementById("home-button");
var linker = function() {
    // chrome.tabs.create({active: true, url: "https://cs-160-percolator-zmarediya.c9users.io/cs-160-percolator/frontend/discussions.html"});
    chrome.tabs.create({active: true, url: "../discussions.html"});
}
link.addEventListener('click', linker, false);
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Homepage Link Button~~~~~~~~~~~~~~~~~~~~~~~~~~~

var classname = document.getElementsByClassName("article-card");
for (var i = 0; i < classname.length; i++) {
    // url = classname[i].getAttribute("href")
    console.log(classname[i])
    classname[i].addEventListener('click', insertCheckAndOpenTab, false);
}

// chrome.storage.local.set({"test" : "Got it!"}, function() {});
// chrome.storage.local.get("test", function(obj) {console.log(obj)});
// chrome.storage.local.get("testing", function(obj) {console.log(obj)});
var loadState = function() {
    // Load states of stars
    chrome.storage.local.get(["checkbox1", "checkbox2", "checkbox3",
                              "cardCheckbox1", "cardCheckbox2", "cardCheckbox3",
                              "emptyStar", "fullStar"], function(obj) {
                                if (Object.keys(obj).length != 0) {
                                    checkbox1 = document.getElementsByClassName("check1")[0];
                                    checkbox1.style.display = obj["checkbox1"];
                                    checkbox2 = document.getElementsByClassName("check2")[0];
                                    checkbox2.style.display = obj["checkbox2"];
                                    checkbox3 = document.getElementsByClassName("check3")[0];
                                    checkbox3.style.display = obj["checkbox3"];
                                    cardCheckbox1 = document.getElementsByClassName("check1")[1];
                                    cardCheckbox1.style.display = obj["cardCheckbox1"];
                                    cardCheckbox2 = document.getElementsByClassName("check2")[1];
                                    cardCheckbox2.style.display = obj["cardCheckbox2"];
                                    cardCheckbox3 = document.getElementsByClassName("check3")[1];
                                    cardCheckbox3.style.display = obj["cardCheckbox3"];      
                                    emptyStar = document.getElementsByClassName("glyphicon-star-empty")[0]
                                    emptyStar.style.display = obj["emptyStar"]  
                                    fullStar = document.getElementsByClassName("glyphicon-star")[0]
                                    fullStar.style.display = obj["fullStar"]                       
                                }

    });

    // Load states of articles
    // chrome.storage.local.get(["article0", "article1", "article2", "article3"], function(obj) {
    //                             if (Object.keys(obj).length != 0) {
    //                                 article0 = document.getElementsByClassName("article-card")[0];
    //                                 article1 = document.getElementsByClassName("article-card")[1];
    //                                 article2 = document.getElementsByClassName("article-card")[2];
    //                                 article3 = document.getElementsByClassName("article-card")[3];

    //                                 // Convert string html to actual html #hacky
    //                                 var d = document.createElement('div');
    //                                 d.innerHTML = obj["article0"];
    //                                 savedArticle0 =  d.firstChild; 
    //                                 d = document.createElement('div');
    //                                 d.innerHTML = obj["article1"];
    //                                 savedArticle1 =  d.firstChild; 
    //                                 d = document.createElement('div');
    //                                 d.innerHTML = obj["article2"];
    //                                 savedArticle2 =  d.firstChild; 
    //                                 d = document.createElement('div');
    //                                 d.innerHTML = obj["article3"];
    //                                 savedArticle3 =  d.firstChild;                             
    //                                 document.body.replaceChild(savedArticle0, article0);
    //                                 document.body.replaceChild(savedArticle1, article1);
    //                                 document.body.replaceChild(savedArticle2, article2);
    //                                 document.body.replaceChild(savedArticle3, article3);

    //                             }

    // });
};

var saveState = function() {
    checkbox1 = document.getElementsByClassName("check1")[0];
    chrome.storage.local.set({"checkbox1" : checkbox1.style.display}, function() {});

    checkbox2 = document.getElementsByClassName("check2")[0];
    chrome.storage.local.set({"checkbox2" : checkbox2.style.display}, function() {}); 

    checkbox3 = document.getElementsByClassName("check3")[0];                                   
    chrome.storage.local.set({"checkbox3" : checkbox3.style.display}, function() {});

    cardCheckbox1 = document.getElementsByClassName("check1")[1];
    chrome.storage.local.set({"cardCheckbox1" : cardCheckbox1.style.display}, function() {});

    cardCheckbox2 = document.getElementsByClassName("check2")[1];
    chrome.storage.local.set({"cardCheckbox2" : cardCheckbox2.style.display}, function() {});

    cardCheckbox3 = document.getElementsByClassName("check3")[1];
    chrome.storage.local.set({"cardCheckbox3" : cardCheckbox3.style.display}, function() {});

    emptyStar = document.getElementsByClassName("glyphicon-star-empty")[0]
    chrome.storage.local.set({"emptyStar" : emptyStar.style.display}, function() {});

    fullStar = document.getElementsByClassName("glyphicon-star")[0]
    chrome.storage.local.set({"fullStar" : fullStar.style.display}, function() {});

    // article0 = document.getElementsByClassName("article-card")[0];
    // chrome.storage.local.set({"article0" : article0.outerHTML}, function() {});

    // article1 = document.getElementsByClassName("article-card")[1];
    // chrome.storage.local.set({"article1" : article1.outerHTML}, function() {});

    // article2 = document.getElementsByClassName("article-card")[2];
    // chrome.storage.local.set({"article2" : article2.outerHTML}, function() {});

    // article3 = document.getElementsByClassName("article-card")[3];
    // chrome.storage.local.set({"article3" : article3.outerHTML}, function() {});

};


var bookmarkArticle = function() {
    // bookmark = document.getElementsByClassName("bookmark")[0];
    // chrome.storage.local.set({"article0" : article0.outerHTML}, function() {});
    console.log(this);
    article = this.parentElement.parentElement;
    
    chrome.storage.local.set({"article" : article0.outerHTML}, function() {});

}

var bookmarks = document.getElementsByClassName("bookmark");
    for (var i = 0; i < bookmarks.length; i++) {
        bookmarks[i].addEventListener('click', bookmarkArticle, false);
    } 

loadState();

chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
});


