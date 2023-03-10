jQuery.noConflict();
(function ($) {

    // add patients
    let other_gender_val = $('#Gender-Other-value');
    other_gender_val.detach();
    $('body').on('change', '[name=patient_gender]', function () {
        if ($('#Gender-Other').is(':checked')) {
            $(this).parent().parent().append(other_gender_val);
        }
        else {
            other_gender_val.detach();
        }
    });
    $("#add-patient").closest('form').attr('id', 'patient-form');
    $('#patient-form input,#patient-form select ').addClass("patient_field");
    let required = $('.patient_field:required').toArray();
    for (let index = 0; index < required.length; index++) {
        $(required[index]).addClass('required');

    }
    let required_field = $('.required').toArray();
    $('body').on('click', '#add-patient', function (event) {
        event.preventDefault();
        let this_btn = $(this);
        let form = $(this).closest('form');
        let form_data = $(form).serializeArray();

        let $post = new Object();
        for (let k = 0; k < form_data.length; k++) {
            let name = form_data[k]['name'];
            let value = form_data[k]['value'];
            let is_required;
            // if ($('[name=' + name + ']').attr('type') === 'radio' ) {
            //     is_required = $('[name=' + name + ']').is(':checked');
            // }
            // else {
            //     is_required = $('[name=' + name + ']').is(':required');
            // }
            if ($('[name=' + name + ']').hasClass('.required')) {
                is_required = $('[name=' + name + ']').is(':checked');
            }
            // else {
            //     is_required = $('[name=' + name + ']').is(':required');
            // }
            // console.log(name, is_required);
            $post[name] = value;
        }
        for (let i = 0; i < required_field.length; i++) {
            let name = $(required_field[i]).attr('name');
            let val = $("[name=" + name + "]").val();
            // console.log($(required_field[i]));
            if ($(required_field[i]).val() !== "") {
                // console.log($(required_field[i]).attr('type'));
                switch ($(required_field[i]).attr('type')) {
                    case "radio":
                        let radio_name = $(required_field[i]).attr('name');
                        let radios = $('[name=' + radio_name + ']').toArray();
                        for (let r = 0; r < radios.length; r++) {
                            if ($(radios[r]).is(':checked')) {
                                // console.log($(radios[r]).val());
                                $post[$(radios[r]).attr('name')] = $(radios[r]).val();
                            }

                        }
                        break;
                    default:
                        $post[$(required_field[i]).attr('name')] = $(required_field[i]).val();
                }


            }
            else {
                if ($(required_field[i]).parent().children('.validation-message').length === 0) {
                    $("<div class='validation-message'></div>").insertAfter(required_field[i]);
                    $(required_field[i]).parent().children('.validation-message').hide().fadeIn(3000);
                    $(required_field[i]).next('.validation-message').append("<p>mandatory</p>");
                    setTimeout(() => {
                        $(required_field[i]).next('.validation-message').remove()
                    }, 5000);
                }

            }

        }

        console.log($post);
        let $post_length = Object.keys($post).length;

        $ajax_Arr = new Array();
        for (const key in $post) {
            if ($post[key] === '') {
                // console.error($post[key])
                const req = isRequired(key);
                if (req === true) {
                    $ajax_Arr.push(1);
                    // console.log('cannot send to ajax');
                }
                else {
                    $ajax_Arr.push(0);
                    // console.log('send to ajax');
                }
            }
            else {
                $ajax_Arr.push(0);
                // console.log('send to ajax');
            }
        }
        // console.log($ajax_Arr);
        if ($post_length === $ajax_Arr.length) {
            const value0 = $ajax_Arr.reduce((a, b) => a + b, 0);
            // console.log(value0);
            if (value0 === 0) {
                ajax_call($post, this_btn);
                alert('calling ajax');
            }
        }
    })

    let isRequired_flag = false;
    function isRequired(key) {
        let required = $('[name=' + key + ']').attr('required');
        if (typeof required !== 'undefined' && required !== false) {
            // console.warn($('[name=' + key + ']'));
            isRequired_flag = true;
        }
        else {
            // console.error($('[name=' + key + ']'));
            isRequired_flag = false;
        }
        return isRequired_flag;
    }

    function ajax_call($post, this_btn) {

        // console.log(this_btn);
        let data = {
            'post': $post
        }
        $.ajax({
            url: '../backend/actions/patients/add-patient.php',
            type: 'POST',
            data: data,
            success: function (data) {
                console.log(data);
                let success_html = '<div class="alert alert-success alert-dismissible fade show mt-5" role="alert"> ';
                success_html += '<strong>Patient added Sucessfully!</strong><a href="#">View patients</a>  ';
                success_html += '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> '
                success_html += '</div>'
                if (data === "success") {
                    $(this_btn).parent().append(success_html);
                    setTimeout(() => {
                        $(this_btn).closest('form')[0].reset();
                        $(other_gender_val).detach();
                        $('[data-row^=row]').detach()
                        console.log($(this_btn).parent().find('.alert').remove());
                    }, 2000);
                }
                else {

                }
            },
            error: function (error) {
                window.alert(error);
            }
        });
    }


    //disable future dates
    var dtToday = new Date();
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month < 10)
        month = '0' + month.toString();
    if (day < 10)
        day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;
    $('#DOB').attr('max', maxDate);

    //disable previous days
    var dtToday_ = new Date();
    var month_ = dtToday_.getMonth() + 1;
    var day_ = dtToday_.getDate() + 1;
    var year_ = dtToday_.getFullYear();
    if (month_ < 10)
        month_ = '0' + month_.toString();
    if (day_ < 10)
        day_ = '0' + day_.toString();
    var minDate = year_ + '-' + month_ + '-' + day_;
    $('#previous-dates').attr('min', minDate);

    $('body').on('click', '#add-patient', function (event) {

    });

    //add class to fieldset
    let $allfieldset = $('fieldset');
    for (let index = 0; index < $allfieldset.length; index++) {
        $($allfieldset[index]).addClass("fieldset filedset-" + [index]);
    }
    let parent_ele = $('.duplicate-row').closest('.flex-container');
    for (let index = 0; index < parent_ele.length; index++) {
        $(parent_ele[index]).attr('data-row', 'row-' + [index]);
    }

    $('body').on('click', '.duplicate-row', function (e) {
        e.preventDefault();
        let html = $(this).closest('[data-row]').children().toArray();
        // console.log(html[0]);
        // console.warn(html);
        let parent_to_insert_after = $(this).closest('[data-row]').attr('data-row');
        $('[data-row=' + parent_to_insert_after + ']').append("<div class='d-flex flex-100 gap-20 align-items-center apended-row'>" + html[0].innerHTML + "</div>");
        $('.apended-row button.btn-primary').replaceWith("<button class='btn btn-danger w-100 remove-duplicate-row'>Remove</button>");
        let this_field = $('[data-row=' + parent_to_insert_after + '] .form-field');
        for (let index = 0; index < this_field.length; index++) {
            if ($(this_field[index]).attr('name') !== undefined || $(this_field[index]).attr('name') !== "") {
                $(this_field[index]).attr('name', $(this_field[index]).attr('name') + "_" + [index]);
            }

        }
    });
    $("body").on('click', '.remove-duplicate-row', function (e) {
        e.preventDefault();
        $(this).closest('.apended-row').remove();
        $(this).closest('.appended-row-medicine').remove();
    });

    let treatment_container = $('#treatment-container').detach();
    let surgery_container = $('#surgery-container').detach();
    $('body').on('change', '.medical-history-check', function () {
        let value = $(this).val();
        console.log("#" + value);
        if ($(this).is(':checked')) {
            if (value === 'treatment-container') {
                jQuery('.filedset-1').children().last().children().append(treatment_container);
            }
            else if (value === 'surgery-container') {
                jQuery('.filedset-1').children().last().children().append(surgery_container);

            }
        }
        else {
            if (value === 'treatment-container') {
                $(treatment_container).remove();
            }
            else {
                $(surgery_container).remove();
            }
        }

    })



    // regular checkup
    $('body').on('click', '.update-regular-checkup', function (event) {
        event.preventDefault();
        let this_btn = $(this);
        let form = $(this).closest('form');
        let form_data_ = $(form).serializeArray();
        let form_data = [];
        for (let k = 0; k < form_data_.length; k++) {
            let name = form_data_[k]['name'];
            let value = form_data_[k]['value'];
            console.log($('[name=' + name + ']'));
            if ($('[name=' + name + ']').is(':required') && value === '') {
                if ($('[name=' + name + ']').parent().children('.validation-message').length === 0) {
                    $('[name=' + name + ']').parent().append('<p class="validation-message">mandatory</p>');
                    setTimeout(() => {
                        $('[name=' + name + ']').next('.validation-message').remove()
                    }, 5000);

                }
            }
            else {
                form_data.push({ [name]: value });

            }
        }
        console.log(form_data);
        let data = {
            'form_data': form_data
        };
        $.ajax({
            url: '../backend/actions/patients/update-daily-checkup.php',
            type: 'POST',
            data: data,
            success: function (data) {
                if (data === 'success') {
                    window.location.reload()
                }
            },
            error: function (error) {
                window.alert(error);
            }
        });

    });

    // form treatment 
    $('body').on('click', '.add-medicine', function (event) {
        event.preventDefault();
        let parent_container = $(this).parentsUntil('#treatment-container-medicine').toArray();
        let to_append = parent_container.pop();
        console.log(to_append)
        $('#treatment-container-medicine').append('<div class="d-flex flex-wrap gap-10 py-3 appended-row-medicine">' + to_append.innerHTML + '</div>');
        $('.appended-row-medicine button.btn-primary').replaceWith("<button class='btn btn-danger w-60 remove-duplicate-row'>Remove</button>");
    });

    //remove code works from line number 215


    //save-and-pdf
    $('body').on('click', '.save-and-pdf, .symptom-btn', function (event) {
        event.preventDefault();
        let patient_id = $('#patient-id').val();
        let this_form = $(this).closest('form');
        let count_children_inside_container = $(this_form).find('.treatment-container').children();
        for (let index = 0; index < count_children_inside_container.length; index++) {
            $(count_children_inside_container[index]).attr('data-obj', 'data_obj_' + [index]);

        }
        let values__ = new Array();
        let names__ = new Array();
        let all_inputs = $(this_form).find('.form-field');
        for (let index = 0; index < all_inputs.length; index++) {
            let obj = $(all_inputs[index]).closest('[data-obj^=data_obj_]').attr('data-obj');
            let required = $(all_inputs[index]).is(':required');
            let value = $(all_inputs[index]).val();
            let name = $(all_inputs[index]).attr('name');
            let type = $(all_inputs[index]).attr('type');
            console.log(type);
            names__.push(name);
            if (required === true && type !== 'checkbox') {
                if (value === '') {
                    if ($(all_inputs[index]).next('.validation-message').length === 0) {
                        $(all_inputs[index]).parent().append('<div class="validation-message">Mandatory</div>');
                        setTimeout(() => {
                            $(all_inputs[index]).next('.validation-message').remove()
                        }, 5000);
                    }
                }
                else {
                    console.log(name, value);
                    values__.push({ "name": name, "value": value });
                }
            }
            else if (required === false && type === 'checkbox') {
                if ($(all_inputs[index]).is(':checked')) {
                    values__.push({ "name": name, "value": value });
                }
            }
            else {
                values__.push({ "name": name, "value": value });

            }

        }
        // console.log(values__);
        const map = new Map(values__.map(({ name, value }) => [name, { name, value: [] }]));
        for (let { name, value } of values__) map.get(name).value.push(...[value].flat());
        const merged_array = [...map.values()];
        console.log(merged_array);
        console.log(patient_id);
        const unique_names = [... new Set(names__)];
        let data = {
            'merged_array': merged_array,
            'unique_names': unique_names,
            'patient_id': patient_id

        };
        if ($(this).hasClass('save-and-pdf')) {
            $.ajax({
                url: '../backend/actions/patients/medicine.php',
                type: 'POST',
                data: data,
                success: function (data) {
                    console.log(data);
                },
                error: function (error) {
                    window.alert(error);
                }
            });
        }
        else if ($(this).hasClass('symptom-btn')) {
            console.log($(this));
            $.ajax({
                url: '../backend/actions/patients/symptom.php',
                type: 'POST',
                data: data,
                success: function (data) {
                    console.log(data);
                },
                error: function (error) {
                    window.alert(error);
                }
            });
        }
    });

    $('body').on('click', '.print_pdf', function (e) {
        window.print();
    })




 

})(jQuery);

