$(function() {

    function validateField(field) {
        if( field.val().trim().length == 0 || field.val().trim() == '') {
            field.parent().addClass('has-error');
        }
    }

    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var nameField = $("input#name");
            validateField(nameField);
            var emailField = $("input#email");
            var phoneField = $("input#phone");
            var messageField = $("#message");

            var name = nameField.val();
            var email = emailField.val();
            var phone = phoneField.val();
            var message = messageField.val();
            
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            $.ajax({
                url: "//formspree.io/contact@byrocketscience.com",
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: {
                    name: name,
                    phone: phone,
                    email: email,
                    message: message
                },
                cache: false,
                success: function() {
                    // Success message
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<strong>Your message has been sent. </strong>");
                    $('#success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
                error: function() {
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!");
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
            });
            $.ajax({
                url: "https://rocketsci.bitrix24.com/crm/configs/import/lead.php",
                type: "GET",
                crossDomain: true,
                dataType: "json",
                data: {
                    TITLE: name,
                    PHONE_MOBILE: phone,
                    EMAIL_WORK: email,
                    COMMENTS: message,
                    LOGIN: 'jmateo6@outlook.com',
                    PASSWORD: 'NotRocketScience'

                },
                cache: false,
                success: function() {
                    console.log("success lead api call");
                },
                error: function(error) {
                    console.log(error);
                    console.log("error lead api");
                }
            });
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
