var budgetOptions = [
    {
        min: 0,
        max: 1000
    },
    {
        min: 1000,
        max: 1500
    },
    {
        min: 1500,
        max: 3000
    },
    {
        min: 3000,
        max: 6000
    },
    {
        min: 6000,
        max: 15000
    },
    {
        min: 15000,
        max: 30000
    },
    {
        min: 30000,
        max: 50000
    },
    {
        min: 50000,
        max: 0
    }
];

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

function moneyString(x) {
    return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getBudgetOption(budget) {
    var option = '<option value="' + budget.min + ':' + budget.max + '">';
    if (budget.min === 0) {
        option += 'Less than ' + moneyString(budget.max);
    } else if( budget.max === 0) {
        option += 'More than '  + moneyString(budget.min);
    } else {
        option += moneyString(budget.min) + " to " + moneyString(budget.max);
    }
    option += '</option>';

    return option;
}

function recalcBudget(minPrice) {
    var budgetSelect = $("#budget");
    budgetSelect.html('<option value="">Select your Budget Range</option>');

    budgetOptions.forEach(function(budget){
        if (budget.min >= minPrice) {
            budgetSelect.append(getBudgetOption(budget));
        }
    });
}

$("#service").on('change', function(e) {
    var element = $("option:selected", this);
    recalcBudget(element.data().lowestPrice);
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


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
