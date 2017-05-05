$('#opt_msg').hide();
$('#tcl').hide();
$('#tcd').hide();
$('#ttcl').hide();
$('#vtcd').hide();

$('#time').click(function() {
    $('#ttcl').show();
    $('#vtcd').hide();
    chrome.storage.sync.set({ options_select: 'time' }, function() {});
});


$('#visit').click(function() {
    $('#vtcd').show();
    $('#ttcl').hide();
    chrome.storage.sync.set({ options_select: 'view' }, function() {});
});;

$('#dk').click(function() {
    $('#tcl').hide();
    $('#tcd').show();
    chrome.storage.sync.set({ theme_select: 'dark' }, function() {});
});


$('#lg').click(function() {
    $('#tcd').hide();
    $('#tcl').show();
    chrome.storage.sync.set({ theme_select: 'light' }, function() {});
});;

chrome.storage.sync.get(['theme_select', 'options_select'], function(item) {
    if (item.theme_select == "light") {
        $('#tcl').show();
    } else {
        $('#tcd').show();
    }
    if (item.options_select == "time") {
        $('#ttcl').show();
    } else {
        $('#vtcd').show();
    }
});

$('#back').hide();

chrome.tabs.getCurrent(function(tab) {
    if (tab == undefined) {
        if (navigator.appVersion.indexOf("Mac") != -1) {
            Mousetrap.bind('command+o', function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    // internet explorer
                    e.returnValue = false;
                }
                window.open("popup.html", "_self");
            });
        } else {
            Mousetrap.bind('ctrl+o', function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    // internet explorer
                    e.returnValue = false;
                }
                window.open("popup.html", "_self");
            });
        }
        $('#back').show();
    }
})
