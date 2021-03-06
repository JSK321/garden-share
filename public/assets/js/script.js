// Wait until page has loaded to run everything within this function
$(function () {
    console.log("Connected to script.js")
    $("#emailBtn").on("click", function(event){
        event.preventDefault();
        console.log("Email Body: " + $("[name=emailBody").val())
        $.ajax({
            url: "/email",
            type: "POST",
            data: {
                gardenId: $("[name=gardenId]").val(),
                emailBody: $("[name=emailBody").val()
            }
        }).then(response=>{
            alert(response)
            window.location.href = "/map"
        }).fail(err=>{
            alert("Email failed to send!")
        })
        $.ajax({
            url: "/requests",
            type: "POST",
            data: {gardenId: $("[name=gardenId]").val()}
        }).then(response=>{
            console.log(response)
        })
    })
});