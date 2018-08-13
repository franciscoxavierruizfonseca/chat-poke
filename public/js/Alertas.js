function CrearAlerta(Titulo, Mensaje, Tipo, Tiempo) {
    var alert = document.createElement('div');
    
    switch (Tipo) {
        case 1:
            alert.setAttribute('class', 'alert alert-success alert-dismissable fade');
            break;
        case 2:
            alert.setAttribute('class', 'alert alert-info fade');
            break;
        case 3:
            alert.setAttribute('class', 'alert alert-warning fade');
            break;
        case 4:
            alert.setAttribute('class', 'alert alert-danger fade');
            break;
        case 5:
            alert.setAttribute('class', 'alert notificacion fade');
            break;
    }
    var linkClose = document.createElement('a');
    linkClose.setAttribute('class', 'close cerrar-alerta');
    linkClose.setAttribute('data-dismiss', 'alert');
    linkClose.setAttribute('aria-label', 'close');
    linkClose.addEventListener('click', eliminarAlerta);
    linkClose.innerHTML = "×";
    alert.appendChild(linkClose);
    var H6 = document.createElement('h6');
    H6.innerHTML = "<strong class='strong-alert'>" + Titulo + "</strong> " + Mensaje + " ";
    alert.appendChild(H6);
    
    $('#divAlerta').append(alert);


    window.setTimeout(function () {
        $(alert).addClass('in alerta');
        setTimeout(function () {
            $(alert).fadeOut();
            setTimeout(function () {
                $(alert).remove();
            }, 300);
        }, Tiempo);
    }, 100);
}
function CrearNotificacion(Titulo, Subtitulo, Mensaje, Tipo, Tiempo) {

    var div1 = document.createElement('div');
    div1.setAttribute('class', 'panel panel-default panel-notificacion fade');
    var div2 = document.createElement('div');
    div2.setAttribute('class', 'panel-body');
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'close cerrar-notificacion');
    button.setAttribute('aria-label', 'close');
    button.addEventListener('click', eliminarNotificacion);
    var span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = "×";
    button.appendChild(span);
    var small = document.createElement('strong');
    small.setAttribute('class', 'text-uppercase text-muted');
    small.innerHTML = Titulo;
    var h5 = document.createElement('h6');
    h5.innerHTML = Subtitulo;
    var p = document.createElement('small');
    p.setAttribute('class', 'text-muted');
    p.innerHTML = Mensaje;
    div2.appendChild(button);
    div2.appendChild(small);
    div2.appendChild(h5);
    div2.appendChild(p);
    div1.appendChild(div2);
    $('#divAlerta').append(div1);
    window.setTimeout(function () {
        $(div1).addClass('in alerta');
        setTimeout(function () {
            $(div1).fadeOut();
            setTimeout(function () {
                $(div1).remove();
            }, 300);
        }, Tiempo);
    }, 100);
}
function eliminarNotificacion() {
    var notificacion = $(this).parent().parent();
    $(notificacion).fadeOut();
    setTimeout(function () {
        $(notificacion).remove();
    }, 300);
}
function eliminarAlerta() {
    var alerta = $(this).parent();
    $(alerta).fadeOut();
    setTimeout(function () {
        $(alerta).remove();
    }, 300);
}
$(document).ready(function () {
    $(".cerrar-notificacion").click(function (e) {
        var notificacion = $(this).parent().parent();
        $(notificacion).fadeOut();
        setTimeout(function () {
            $(notificacion).remove();
        }, 300);
    });
    $(".cerrar-alerta").click(function (e) {
        var alerta = $(this).parent();
        $(alerta).fadeOut();
        setTimeout(function () {
            $(alerta).remove();
        }, 300);
    });
});