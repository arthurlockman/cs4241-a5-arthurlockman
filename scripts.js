var isEditVisible = false

window.onload = function () {
    $('#addMovieForm').hide()
    $('.btn-delete').hide()
    document.getElementById("editButton").addEventListener("click", editButtonClick)
}

function editButtonClick() {
    if (isEditVisible == true) {
        $('#addMovieForm').hide()
        $('.btn-delete').hide()
        isEditVisible = false
        $("#editButton").html('Edit')
    } else {
        $('#addMovieForm').show()
        $('.btn-delete').show()
        isEditVisible = true
        $("#editButton").html('Cancel')
    }
}

function deleteButtonClick(button) {
    post('/delete', {movie: button.value})
}

function post(path, parameters) {
    //From http://stackoverflow.com/questions/133925/javascript-post-request-like-a-form-submit
    var form = $('<form></form>');

    form.attr("method", "post");
    form.attr("action", path);

    $.each(parameters, function(key, value) {
        var field = $('<input></input>');

        field.attr("type", "hidden");
        field.attr("name", key);
        field.attr("value", value);

        form.append(field);
    });

    $(document.body).append(form);
    form.submit();
}