/**
 * Created by mcardenas on 27/09/16.
 */

$(function () {
    var text = "Do you use -NAV- as your web browser? We are sorry! For this site to function properly, you must use Firefox."
    if (navigator.userAgent.indexOf('MSIE') !=-1) {
        text = text.replace('-NAV-', 'Internet Explorer');
    } else if (navigator.userAgent.indexOf('Firefox') !=-1) {
        text = "";
    } else if (navigator.userAgent.indexOf('Chrome') !=-1) {
        text = text.replace('-NAV-', 'Chrome');
    } else if (navigator.userAgent.indexOf('Opera') !=-1) {
        text = text.replace('-NAV-', 'Opera');
    } else {
        text = "For this site to function properly, you must use Firefox.";
    }

    if (text != ''){
        document.write(text);
    }
});
