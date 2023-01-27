$(function() {
    var img = $('#img');

    let b = anime({
        targets: '#img',
        width: [0, '40%'],
        autoplay: false
    });

    let c = anime({
        targets: '#x *',
        opacity: [0, 1],
        delay: 200,
        autoplay: false
    });




    let a = anime({
        targets: '#x',
        height: [
            {value: 100, delay: 550, duration: 100}
        ],
        opacity: [
            {value: [0, 1], delay: 500, duration: 100}
        ],
        autoplay: false,
        complete: function() {
            $('#y').append(img);
            b.play();
            c.play();
        }
    });

    $('#y').click(function() {
        a.play();
    });
});
