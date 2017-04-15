var li;
var liSelected;
hist = [];
keyword_data = {};

datafetch();
/* Empty the div if there is no input in the search box*/
function empty() {
    if (document.getElementById("in1").value == "") {
        document.getElementById("nice").innerHTML = "";
    }
}

document.getElementById("in1").addEventListener("keyup", srch);

function datafetch() {
    chrome.storage.sync.get(null, function(items) {
        keyword_data = items;
        tabl(keyword_data);
    })
}

skd = [];
/* Search the history*/
function srch() {
    var nn = document.getElementById("nice");
    nn.innerHTML = "";
    dd = [];
    var key = this.value;
    if (keyword_data[key] != undefined) {
        if (!skd.includes(keyword_data[key])) {
            skd.push(keyword_data[key]);
            buildPopupDomKey('search-key', skd);
        }
    } else {
        document.getElementById('search-key').innerHTML = "";
        skd = [];
    }
    for (var i = 0; i < hist.length; i++) {
        if (hist[i][1].includes(key)) {
            dd.push(hist[i]);
        }
    }
    // nn.innerHTML = dd;
    buildPopupDom("nice", dd);
    li = $('li');
    empty();
}

// Event listner for clicks on links in a browser action popup.
// Open the link in a new tab of the current window.
function onAnchorClick(event) {
    chrome.tabs.create({
        selected: true,
        url: event.srcElement.href
    });
    return false;
}
// Given an array of URLs, build a DOM list of those URLs in the
// browser action popup.
function buildPopupDom(divName, data) {
    var popupDiv = document.getElementById(divName);
    var ul = document.createElement('ul');
    popupDiv.appendChild(ul);
    for (var i = 0, ie = data.length; i < ie; ++i) {
        var a = document.createElement('a');
        a.href = data[i][1];
        a.innerHTML = data[i][1];
        a.addEventListener('click', onAnchorClick);
        var li = document.createElement('li');
        var p = document.createElement('p');
        var img = document.createElement('img');
        img.src = 'http://www.google.com/s2/favicons?domain_url=' + data[i][1];
        p.innerHTML = data[i][0];
        if (data[i][0] != "") {
            p.appendChild(img);
            li.appendChild(p);
        }
        li.appendChild(a);
        ul.appendChild(li);
    }
}

function buildPopupDomKey(divName, data) {
    var popupDiv = document.getElementById(divName);
    var ul = document.createElement('ul');
    popupDiv.appendChild(ul);
    for (var i = 0, ie = data.length; i < ie; ++i) {
        var a = document.createElement('a');
        a.href = data[i];
        a.appendChild(document.createTextNode(data[i]));
        a.addEventListener('click', onAnchorClick);
        var li = document.createElement('li');
        li.appendChild(a);
        ul.appendChild(li);
    }
}

// Search history to find up to ten links that a user has typed in,
// and show those links in a popup.
function buildTypedUrlList() {
    // To look for history items visited in the last week,
    // subtract a week of microseconds from the current time.
    var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
    // Track the number of callbacks from chrome.history.getVisits()
    // that we expect to get.  When it reaches zero, we have all results.
    var numRequestsOutstanding = 0;
    chrome.history.search({
            'text': '', // Return every history item....
            'maxResults': 500 // that was accessed less than one week ago.
        },
        function(historyItems) {
            // For each history item, get details on all visits.
            for (var i = 0; i < historyItems.length; ++i) {
                var url = historyItems[i].url;
                var title = historyItems[i].title;
                var visitCount = historyItems[i].visitCount;
                hist.push([title, url, visitCount]);
                // var processVisitsWithUrl = function(url) {
                //     // We need the url of the visited item to process the visit.
                //     // Use a closure to bind the  url into the callback's args.
                //     return function(visitItems) {
                //         processVisits(url, visitItems);
                //     };
                // };
                // chrome.history.getVisits({ url: url }, processVisitsWithUrl(url));
                // numRequestsOutstanding++;
            }
            // if (!numRequestsOutstanding) {
            //   onAllVisitsProcessed();
            // }
            // buildPopupDom(divName, hist);
        });
    // Maps URLs to a count of the number of times the user typed that URL into
    // the omnibox.
    // var urlToCount = {};
    // // Callback for chrome.history.getVisits().  Counts the number of
    // // times a user visited a URL by typing the address.
    // var processVisits = function(url, visitItems) {
    //   for (var i = 0, ie = visitItems.length; i < ie; ++i) {
    //     // Ignore items unless the user typed the URL.
    //     if (visitItems[i].transition != 'typed') {
    //       continue;
    //     }
    //     if (!urlToCount[url]) {
    //       urlToCount[url] = 0;
    //     }
    //     urlToCount[url]++;
    //   }
    //   // If this is the final outstanding call to processVisits(),
    //   // then we have the final results.  Use them to build the list
    //   // of URLs to show in the popup.
    //   if (!--numRequestsOutstanding) {
    //     onAllVisitsProcessed();
    //   }
    // };
    // // This function is called when we have the final list of URls to display.
    // var onAllVisitsProcessed = function() {
    //   // Get the top scorring urls.
    //   urlArray = [];
    //   for (var url in urlToCount) {
    //     urlArray.push(url);
    //   }
    //   // Sort the URLs by the number of times the user typed them.
    //   urlArray.sort(function(a, b) {
    //     return urlToCount[b] - urlToCount[a];
    //   });
    //   buildPopupDom(divName, urlArray.slice(0, 10));
    // };
}

document.addEventListener('DOMContentLoaded', function() {
    buildTypedUrlList();
});

window.displayBoxIndex = -1;
var Navigate = function(diff) {
    displayBoxIndex += diff;
    var oBoxCollection = $("li");
    if (displayBoxIndex >= oBoxCollection.length) {
        displayBoxIndex = 0;
    }
    if (displayBoxIndex < 0) {
        displayBoxIndex = oBoxCollection.length - 1;
    }
    var cssClass = "selected";
    oBoxCollection.removeClass(cssClass).eq(displayBoxIndex).addClass(cssClass);
    oBoxCollection.eq(displayBoxIndex)[0].getElementsByTagName('a')[0].focus();
    $('#in1').focus();
}
$(document).on('keypress keyup', function(e) {
    if (e.keyCode == 13 || e.keyCode == 32) {
        if ($('.selected').length == 0) {
            $('li')[0].getElementsByTagName('a')[0].click();
        } else {
            $('.selected')[0].getElementsByTagName('a')[0].click();
            return false;
        }
    }
    if (e.keyCode == 40) {
        //down arrow
        Navigate(1);
    }
    if (e.keyCode == 38) {
        //up arrow
        Navigate(-1);
    }
});
