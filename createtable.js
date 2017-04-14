$('#key_table').hide();

Mousetrap.bind('alt+h', function(e){
    $('#key_table').toggle();
});

function tabl(keyword_data) {
    var table = document.getElementById('key_table');
    console.log(keyword_data);
    console.log('inside tabl()');
    $.each(keyword_data, function(key, value) {
        var tr = document.createElement('tr');
        table.appendChild(tr);
        var td1 = document.createElement('td');
        td1.innerHTML = key;
        tr.appendChild(td1);
        var td2 = document.createElement('td');
        td2.innerHTML = value;
        tr.appendChild(td2);
    });
}