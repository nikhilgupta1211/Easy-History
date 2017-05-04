chrome.storage.sync.get('theme_select', function(item) {
    if (item.theme_select == "light") {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: "css/light.css"
        }).appendTo("head");
    } else {
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: "css/dark.css"
        }).appendTo("head");
    }
});

var li;
var liSelected;
hist = [];
keyword_data = {};

datafetch();

function check_for_view_option() {
    chrome.storage.sync.get('options_select', function(item) {
        if (item.options_select == "view") {
            hist = quickSort(hist, 0, hist.length - 1);
        } else {
            return;
        }
    });
}

/* Empty the div if there is no input in the search box*/
function empty() {
    if (document.getElementById("in1").value == "") {
        document.getElementById("nice").innerHTML = "";
    }
}

function datafetch() {
    chrome.storage.sync.get(null, function(items) {
        keyword_data = items;
        tabl(keyword_data);
    })
}

skd = [];

// Search Function
$('#in1').keyup(function(event) {
    if (event.keyCode <= 36 || event.keyCode >= 41) {
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
            if (hist[i][0] != "") {
                if (hist[i][0].toLowerCase().includes(key)) {
                    dd.push(hist[i]);
                } else {
                    if (hist[i][1].includes(key)) {
                        dd.push(hist[i]);
                    }
                }
            } else {
                if (hist[i][1].includes(key)) {
                    dd.push(hist[i]);
                }
            }
        }

        window.displayBoxIndex = -1;
        // var t0 = performance.now();
        buildPopupDom("nice", dd.slice(0, 250));
        // var t1 = performance.now();
        // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
        empty();
    }
});

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
        a.innerHTML = data[i][1].slice(0, 80);
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

// Fetch the history
function buildTypedUrlList() {
    // To look for history items visited in the last 100 days,
    var microsecondsBack = 1000 * 60 * 60 * 24 * 100;
    var startTime = (new Date).getTime() - microsecondsBack;
    var numRequestsOutstanding = 0;
    chrome.history.search({
            'text': '',
            'maxResults': 15000,
            'startTime': startTime
        },
        function(historyItems) {
            for (var i = 0; i < historyItems.length; ++i) {
                var url = historyItems[i].url;
                var title = historyItems[i].title;
                var visitCount = historyItems[i].visitCount;
                hist.push([title, url, visitCount]);
            }
            check_for_view_option();
        });
}

document.addEventListener('DOMContentLoaded', function() {
    buildTypedUrlList();
});

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

$(document).on('keydown', function(e) {
    if (e.keyCode == 13) {
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

Mousetrap.bind('esc', function(e) {
    window.close();
});

// Sort the history according to the visits
function quickSort(arr, left, right) {
    var len = arr.length,
        pivot,
        partitionIndex;


    if (left < right) {
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right);

        quickSort(arr, left, partitionIndex - 1);
        quickSort(arr, partitionIndex + 1, right);
    }
    return arr;
}


function partition(arr, pivot, left, right) {
    var pivotValue = arr[pivot][2],
        partitionIndex = left;

    for (var i = left; i < right; i++) {
        if (arr[i][2] > pivotValue) {
            swap(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
}


function swap(arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

if (navigator.appVersion.indexOf('Mac') != -1) {
    $('.instructions').text("Use 'Command+Shift+K' to add a keyword, 'Up/Down' arrows to navigate and 'Command+B' to show the Keywords");
    $('#shrt_save').text('Command+S or');
} else {
    $('.instructions').text("Use 'Ctrl+Shift+K' to add a keyword, 'Up/Down' arrows to navigate and 'Ctrl+B' to show the Keywords");
    $('#shrt_save').text('Ctrl+S or');
}
