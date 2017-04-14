/* Initially hide the Input keyword div and Message paragraph.*/
 $('#key-div').hide();
 $('#msg').hide();

 /*To show the add keyword option.*/
 Mousetrap.bind('ctrl+shift+k', function(e) {
     chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
         document.getElementById("weburl").defaultValue = tabs[0].url;
         document.getElementById("weburl").setAttribute('title', tabs[0].url);
     });
     $('#key-div').show();
 });

 $('#sub').click(function() {
     var url = $('#weburl').val();
     var keyword = $('#in2').val();
     console.log(url);
     chrome.storage.sync.set({
         [keyword]: url }, function() {
         $('#key-div').hide();
         $('#msg').text('Keyword Saved').show().fadeOut(1000);
         datafetch();
     });
 });
