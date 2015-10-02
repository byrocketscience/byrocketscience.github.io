var minQuotePrice = 1500;
var maxQuotePrice = 50000;

var sendForm = function(name, email, phone, message, budget, service) {
    $.ajax({
        url: "//formspree.io/contact@byrocketscience.com",
        type: "POST",
        crossDomain: true,
        dataType: "json",
        data: {
            name: name,
            phone: phone,
            email: email,
            budget: budget,
            service: service,
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
            $('.help-block').fadeOut();

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
};
// $(function() {
//     $("input,textarea, select").not("[type=submit]").jqBootstrapValidation({
//         preventSubmit: true,
//         submitError: function($form, event, errors) {
//             // additional error messages or events
//         },
//         submitSuccess: function($form, event) {
//             event.preventDefault(); // prevent default submit behaviour
//             // get values from FORM
//             var nameField = $("input#name");
//             var emailField = $("input#email");
//             var phoneField = $("input#phone");
//             var messageField = $("#message");
//             var budgetField = $("select#budget");

//             var name = nameField.val();
//             var email = emailField.val();
//             var phone = phoneField.val();
//             var message = messageField.val();
//             var budget = budgetField.val();

//             var firstName = name; // For Success/Failure Message
//             // Check for white space in name for Success/Fail message
//             if (firstName.indexOf(' ') >= 0) {
//                 firstName = name.split(' ').slice(0, -1).join(' ');
//             }

//             $.ajax({
//                 url: "//formspree.io/contact@byrocketscience.com",
//                 type: "POST",
//                 crossDomain: true,
//                 dataType: "json",
//                 data: {
//                     name: name,
//                     phone: phone,
//                     email: email,
//                     budget: budget,
//                     message: message
//                 },
//                 cache: false,
//                 success: function() {
//                     // Success message
//                     $('#success').html("<div class='alert alert-success'>");
//                     $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
//                         .append("</button>");
//                     $('#success > .alert-success')
//                         .append("<strong>Your message has been sent. </strong>");
//                     $('#success > .alert-success')
//                         .append('</div>');

//                     //clear all fields
//                     $('#contactForm').trigger("reset");
//                 },
//                 error: function() {
//                     // Fail message
//                     $('#success').html("<div class='alert alert-danger'>");
//                     $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
//                         .append("</button>");
//                     $('#success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!");
//                     $('#success > .alert-danger').append('</div>');
//                     //clear all fields
//                     $('#contactForm').trigger("reset");
//                 },
//             });
//             $.ajax({
//                 url: "https://rocketsci.bitrix24.com/crm/configs/import/lead.php",
//                 type: "GET",
//                 crossDomain: true,
//                 dataType: "json",
//                 data: {
//                     TITLE: name,
//                     PHONE_MOBILE: phone,
//                     EMAIL_WORK: email,
//                     COMMENTS: message,
//                     LOGIN: 'jmateo6@outlook.com',
//                     PASSWORD: 'NotRocketScience'

//                 },
//                 cache: false,
//                 success: function() {
//                     console.log("success lead api call");
//                 },
//                 error: function(error) {
//                     console.log(error);
//                     console.log("error lead api");
//                 }
//             });
//         },
//         filter: function() {
//             return $(this).is(":visible");
//         }
//     });

//     $("a[data-toggle=\"tab\"]").click(function(e) {
//         e.preventDefault();
//         $(this).tab("show");
//     });
// });

function recalcBudget(minPrice) {
    $("#budget option").each(function(){
        var budget = $(this);
        if (budget.data().minValue && budget.data().minValue < minPrice) {
            budget.fadeOut();
        } else {
            budget.fadeIn();
        }
    });
}

$("#service").on('change', function(e) {
    var element = $("option:selected", this);
    if (element.data().lowestPrice) {
        recalcBudget(element.data().lowestPrice);
    };
});

$('#submitFormButton').click(function(event){
    event.preventDefault();

    var nameField = $("#name");
    var emailField = $("#email");
    var phoneField = $("#phone");
    var messageField = $("#message");
    var budgetField = $("#budget");
    var serviceField = $("#service");

    var name = nameField.val();
    var email = emailField.val();
    var phone = phoneField.val();
    var message = messageField.val();
    var budget = budgetField.val();
    var service = serviceField.val();
    var errors = false;

    var toCheckTextInputs = [nameField, emailField, messageField, budgetField, serviceField];
    toCheckTextInputs.forEach(function(input){
        if (input.val().trim() === '' && input.prop('required')) {
            input.siblings('.help-block').html(input.data().validationRequiredMessage);
            input.fadeIn();
            errors = true;
        } else {
            input.siblings('.help-block').fadeOut();
        }
    });

    if (!errors) {
        sendForm(name, email, phone, message, budget, service);
    };
});


// $(function(){
//     var getCheckboxHtml = function(element) {
//         return '<li class="checkbox"><label><input type="checkbox" value="' + element.val() +'">' + element.html() + '</label></li>';
//     };
//     var servicesSelect = $("#service");
//     var servicesList = $("#servicesList");
//     $("#service option").each(function(){
//         var element = $(this);
//         if(element.val() !== '') {
//                         element.click(function(){
//                 console.log($(this));
//                 if (element.checked) {

//                 } else {

//                 }
//             });
//             servicesList.append(getCheckboxHtml(element));
//         }
//     });

// });

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
