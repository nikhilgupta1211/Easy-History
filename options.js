$('#opt_msg').hide();

$('#opt_sub').click(function() {
    var val = document.querySelector('input[name="tp"]:checked').value;
    chrome.storage.sync.set({ options_select: val }, function() {
        $('#opt_msg').show().fadeOut(2000);
    });
});

chrome.storage.sync.get('options_select', function(item) {
    if (item.options_select == "view") {
        $("input[value = 'view']").attr({checked:'checked'});
    } else {
        $("input[value = 'time']").attr({checked:'checked'});
    }
});
