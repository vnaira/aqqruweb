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

    $("#single-select-object .answer-btn").on('click', function () {
        $(this).toggleClass('active');
        var ans = $(this).closest('.object-name').children('input');
        var ro = ans.prop('readonly');
        ans.prop('readonly', !ro).focus();
        ans.toggleAttribute("readonly");
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


    $("#button-send").click(function(event) {
        var form = $("#chat-form");
        if (form[0].checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
            $('.invalid-feedback').css('display','block');
        }else {
            $('.invalid-feedback').css('display','none');
        }
    });


    function arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele != value;
        });
    }
    $('.children').on('click', function () {
        $(this).parents('.btn-toolbar').find('.children').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr('data-name');
        console.log(id)
        if(id === "one-child"){
            $('.child-age').css('display','none');
            $('.child-ages').find("[data-id='one-child']").css('display','block');
        }else {
            $('.child-age').css('display','block');
        }
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


