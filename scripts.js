var isEditVisible = false

window.onload = function () {
    $('#addMovieForm').hide()
    $('.btn-delete').hide()
    document.getElementById("editButton").addEventListener("click", editButtonClick)
    document.getElementById('add-movie-button').addEventListener('click', addButtonClick)
    document.getElementById('searchbutton').addEventListener('click', searchButtonClick)
    $("#searchfield").keyup(function(event){
    if(event.keyCode == 13){
        $("#searchbutton").click();
    }
});
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

function addButtonClick() {
    var field = document.getElementById('new-movie-name-field')
    var req = new XMLHttpRequest()
    req.open('POST', '/add', true)
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    req.addEventListener("load", function() {
        field.value = ''
        getMovieList()
    })
    req.send('movie='+field.value)
}

function deleteButtonClick(button) {
    var req = new XMLHttpRequest()
    req.open('POST', '/delete', true)
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    req.addEventListener("load", getMovieList)
    req.send('movie='+button.value)
}

function getMovieList() {
    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        handleNewMovieList(req)
    }
    req.open('GET', '/list')
    req.send()
}

function handleNewMovieList(req) {
    if (req.readyState !== XMLHttpRequest.DONE)
        return
    if (req.status === 200)
    {
        var list = document.getElementById('movie-list')
        list.innerHTML = req.responseText
    }
}

function searchButtonClick() {
    var searchfield = document.getElementById('searchfield')
    var req = new XMLHttpRequest()
    req.open('POST', '/ajaxsearch', true)
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    req.onreadystatechange = function() {
        handleNewMovieList(req)
        $('.btn-delete').hide()
        var currentLocation = document.createElement('a');
        currentLocation.href = window.location.href
        currentLocation.pathname = '/search'
        currentLocation.search = '?searchterm=' + searchfield.value
        history.pushState({}, $(document).find("title").text(), currentLocation.href)
    }
    req.send('query='+searchfield.value)
}