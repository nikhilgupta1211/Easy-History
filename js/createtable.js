$('#key_table').hide();

if (navigator.appVersion.indexOf("Mac") != -1) {
    Mousetrap.bind('command+b', function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            // internet explorer
            e.returnValue = false;
        }
        $('#key_table').toggle();
    });

} else {
    Mousetrap.bind('ctrl+b', function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            // internet explorer
            e.returnValue = false;
        }
        $('#key_table').toggle();
    });
}

function tabl(keyword_data) {
    document.getElementById('key_table').innerHTML = ""
    var table = document.getElementById('key_table');
    var tr = document.createElement('tr');
    table.appendChild(tr);
    var th = document.createElement('th');
    tr.appendChild(th);
    th.innerHTML = 'Keyword';
    var th1 = document.createElement('th');
    tr.appendChild(th1);
    th1.innerHTML = 'URL';
    $.each(keyword_data, function(key, value) {
        var tr = document.createElement('tr');
        table.appendChild(tr);
        var td1 = document.createElement('td');
        td1.innerHTML = key;
        $(td1).attr({class:"tdcent"});
        tr.appendChild(td1);
        var td2 = document.createElement('td');
        td2.innerHTML = value;
        tr.appendChild(td2);
    });
}
