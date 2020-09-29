/**
 * Created by tonypoole on 06/07/2020.
 */

// validate signup form on keyup and submit
$("#page_form").validate(form_options);

// Add Listeners to Each Select list
$('#page_form select').each(
    function(index){
        $( "#"+$(this).attr("id")).change(function() {
            $("#page_form").validate().element('select');
        });
    }

);