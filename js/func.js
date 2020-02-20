$(document).ready(function () {
    "use strict";

    $(".sent_msg").on('click', function () {
        $('.msg_history').find('.active').removeAttribute('class', 'active');
        console.log($('.msg_history').find('.active'));
        $(this).parent().find('.edit_delete').toggleClass('active');
    });

    $("#single-select .answer-btn").on('click', function () {
        $('#single-select').find('.active').removeClass('active');
        $('#outgoing_value').val();
        $('#outgoing_value').val($(this).text());
        if ($('#outgoing_value').val() == $(this).text()) {
            $(this).addClass('active');
        }
    });


    $("#multiselect .answer-btn").on('click', function () {
        let answer = $('#outgoing_value').val();
        $(this).toggleClass('active');

        if ($(this).hasClass('active')) {
            if (answer !== '') {
                if ($(this).text() == 'Other:') {
                    $('#outgoing_value').focus();
                    answer += ',';
                } else
                    answer += ',' + $(this).text();
            } else {
                if ($(this).text() == 'Other:') {
                    $('#outgoing_value').focus();
                } else
                    answer += $(this).text();
            }
        } else {
            let currentVal = ($('#outgoing_value').val()).split(',');
            var result = arrayRemove(currentVal, $(this).text());
            answer = result.join(',');
        }

        $('#outgoing_value').val(answer);
    });


    function arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele != value;
        });
    }
    $('.children').on('click', function () {
        $(this).toggleClass('active');
        var id = $(this).attr('data-name');
        $('.child-age').attr('disabled',true);
        $('.type_msg').find("[data-id='"+ id +"']").attr('disabled', function(_, attr){ return !attr});
    });

    $('.context-menu').on('click', function(e) {
        var offset = $( this ).offset();
        var top = offset.top + 20;
        var left = offset.left - 10;
        $("#context-menu").css({
            top: top,
            left: left,
            display: 'block'
        }).addClass("show");
        return false;
    });

    $("#context-menu a").on("click", function() {
        $(this).parent().removeClass("show").hide();
    });


});


