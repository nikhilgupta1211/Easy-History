$('#opt_msg').hide();
$('#tcl').hide();
$('#tcd').hide();

$('#opt_sub').click(function() {
    var val = document.querySelector('input[name="tp"]:checked').value;
    chrome.storage.sync.set({ options_select: val }, function() {
        $('#opt_msg').show().fadeOut(2000);
    });
});

chrome.storage.sync.get('options_select', function(item) {
    if (item.options_select == "view") {
        $("input[value = 'view']").attr({ checked: 'checked' });
    } else {
        $("input[value = 'time']").attr({ checked: 'checked' });
    }
});

$('#dk').click(function() {
    $('#tcl').hide();
    $('#tcd').show();
    chrome.storage.sync.set({ theme_select: 'dark' }, function() {
        console.log('Dark theme set');
    });
});


$('#lg').click(function() {
    $('#tcd').hide();
    $('#tcl').show();
    chrome.storage.sync.set({ theme_select: 'light' }, function() {
        console.log('Light theme set');
    });
});;

chrome.storage.sync.get('theme_select', function(item) {
    if (item.theme_select == "light") {
        $('#tcl').show();
    } else {
        $('#tcd').show();
    }
});
