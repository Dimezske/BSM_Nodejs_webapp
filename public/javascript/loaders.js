var spinner_loader = document.getElementById('spinner');

function showSpinner() {
    var timer = window.setTimeout(function() {
        $('form').submit();
    }, 3500);
}
$(document).ready(function(){
    $('form').on('submit', function(e) {
        e.preventDefault();
        $('#spinner').show(function(){
            showSpinner();
            $('#spinner').hide();
        })    
    });
});