/* Initially hide the Input keyword div and Message paragraph.*/
$('#key-div').hide();
$('#msg').hide();

/*To show the add keyword option.*/
Mousetrap.bind('ctrl+shift+k', function(e) {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        document.getElementById("weburl").defaultValue = tabs[0].url;
        document.getElementById("weburl").setAttribute('title', tabs[0].url);
    });
    $('#key-div').toggle();

});

$('#sub').click(function() {
    save();
});

Mousetrap.bind(['ctrl+s', 'meta+s'], function(e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        // internet explorer
        e.returnValue = false;
    }
    save();
});

function save() {
    var url = $('#weburl').val();
    var keyword = $('#in2').val();
    if (url != "" && keyword != "") {
        chrome.storage.sync.set({
            [keyword]: url
        }, function() {
            $('#key-div').hide();
            $('#msg').text('Keyword Saved').show().fadeOut(1000);
            datafetch();
        });
    } else {
        if (url == "") {
            $('#msg').text("URL can't be empty").show().fadeOut(1000);
        } else {
            $('#msg').text("Keyword can't be empty").show().fadeOut(1000);
        }
    }
}
