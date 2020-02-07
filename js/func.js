$(document).ready(function () {
    "use strict";

    $(".sent_msg").on('click', function () {
        $(this).parent().find('.edit_delete').toggleClass('active');
    });

    $(".answer-btn").on('click', function () {
        $('#outgoing_value').val();
        $('#outgoing_value').val($(this).text());

    });

});
