/**
 * Created by mcardenas on 27/09/16.
 */

addEventListener("load", function () {
    setTimeout(hideURLbar, 0);
}, false);
function hideURLbar() {
    window.scrollTo(0, 1);
}

$(function () {
    $('#supported').text('Supported/allowed: ' + !!screenfull.enabled);
    if (!screenfull.enabled) {
        return false;
    }
    $('#toggle').click(function () {
        screenfull.toggle($('#container')[0]);
    });
});

$(function () {

    Tipped.create('.tooltip_', {skin: 'red'});

    $('.agile-bottom-grid').draggable({
        opacity: 0.35,
        zIndex: 1
    });

    $('.agile-Updating-grids').draggable({
        opacity: 0.35,
        zIndex: 1
    });

    $('.area-grids').draggable({
        opacity: 0.35,
        zIndex: 1
    });
});

var theme = 'default';
$('body').removeClass(function (index, css) {
    return (css.match(/\btheme-\S+/g) || []).join(' ');
});
if (theme !== 'default')
    $('body').addClass(theme);


var caption_data = {};
var video1 = document.getElementById("Video1");
var video2 = document.getElementById("Video2");
var video3 = document.getElementById("Video3");
var video4 = document.getElementById("Video4");

var video_1 = videojs('Video1');
var video_2 = videojs('Video2');
var video_3 = videojs('Video3');
var video_4 = videojs('Video4');

$(function () {

    var vLength;
    $("#current_time_video_bar").val('0');

    $("#bottom-export-json").on("click", function (e) {
        var dataJson = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(caption_data));
        var downlink = document.getElementById('download');
        var filename = $("#filename").val() || "annotation_" + $.now();
        downlink.setAttribute("href", dataJson);
        downlink.setAttribute("download", filename);
        downlink.click();
    });

    if (video1.canPlayType) {

        $("#play").click(function(){
            loadVideos();
        });

        $("#restart").click(function(){
            setTime(0);
        });

        $("#rew").click(function(){
            setTime(-10);
        });

        $("#fwd").click(function(){
            setTime(10);
        });

        $("#current_time_video_bar").change(function () {
            var ct = parseFloat($(this).val()).toFixed(1);
            $(this).attr('title', "Current Time " + ct);
            setTimeBar(ct);
        });

        $("#volDn").click(function(){
            setVol(-.1);
        });

        $("#volUp").click(function(){
            setVol(.1);
        });

        $("#buttom_load_video").click(function(){
            if(confirm("Do you want to upload videos? This action will erase annotations or tags in unsaved file.")) {
                caption_data = {};
                $("#current_time_video_bar").val('0');
                setFileTags();
            }
        });

        $("#slower").click(function(){
            video1.playbackRate -= .25;
            video2.playbackRate -= .25;
            video3.playbackRate -= .25;
            video4.playbackRate -= .25;
        });

        $("#faster").click(function(){
            video1.playbackRate += .25;
            video2.playbackRate += .25;
            video3.playbackRate += .25;
            video4.playbackRate += .25;
        });

        $("#normal").click(function(){
            video1.playbackRate = 1;
            video2.playbackRate = 1;
            video3.playbackRate = 1;
            video4.playbackRate = 1;
        });

        $("#mute").click(function(){
            if (video1.muted) {
                video1.muted = false;
                video2.muted = false;
                video3.muted = false;
                video4.muted = false;
            } else {
                video1.muted = true;
                video2.muted = true;
                video3.muted = true;
                video4.muted = true;
            }
        });

        video1.addEventListener("timeupdate", function () {
            var vTime = video1.currentTime;
            document.getElementById("curTime").textContent = vTime.toFixed(1);
            document.getElementById("vRemaining").textContent = (vLength - vTime).toFixed(1);
            $("#current_time_video_bar").val(vTime);
            $("#current_time_video_bar").attr('title', "Current Time " + vTime);
        }, false);

        video1.addEventListener("pause", function () {
            document.getElementById("play").innerHTML = "<img alt='&gl;' title='Play' src='images/play-button.png' height='22' width='22'/>";
        }, false);

        video1.addEventListener("playing", function () {
            document.getElementById("play").innerHTML = "<img alt='||' title='Pause' src='images/pause.png' height='22' width='22'/>";
        }, false);

        video1.addEventListener("volumechange", function () {
            if (video1.muted) {
                document.getElementById("mute").innerHTML = "<img alt='Off' src='images/volume-off.png' height='22' width='22'/>"
            } else {
                document.getElementById("mute").innerHTML = "<img alt='On' src='images/high-volume.png' height='22' width='22'/>"
            }
        }, false);

        video1.addEventListener("canplay", function () {
            document.getElementById("buttonbar").style.display = "block";
            document.getElementById("demo-tools-1").style.display = "block";
            document.getElementById("demo-tools-2").style.display = "block";
            document.getElementById("demo-tools-3").style.display = "block";
            document.getElementById("demo-tools-4").style.display = "block";
        }, false);

        video1.addEventListener("loadedmetadata", function () {
            vLength = video1.duration.toFixed(1);
            document.getElementById("vLen").textContent = vLength;
            $("#current_time_video_bar").attr('max', vLength);
        }, false);

        video1.addEventListener("error", function (err) {
            errMessage(err);
        }, true);

    } else {
        errMessage("HTML5 Video is required for this example");
    }

    function setFileTags(callback) {
        var request;
        if (window.XMLHttpRequest){
            request = new XMLHttpRequest();
        } else {
            request = ActiveXObject("Microsoft.XMLHTTP");
        }
        request.overrideMimeType("application/json");
        request.open('GET', 'annotation.json', true);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == "200") {
                caption_data = JSON.parse(request.responseText);
                if (Object.keys(caption_data).length == 4)
                    getVideo();
                else
                    errMessage("Enter a valid video URL for video and file for comments tags");
            }
        }
        request.send(null);
    }

    /**
     * Function load Videos.
     */
    function loadVideos(evt) {
        if (video1.src == "") {
            getVideo();
        }
        if (video1.paused) {
            playVideos();
            document.getElementById("play").innerHTML = "<img alt='||' title='Pause' src='images/pause.png' height='22' width='22'/>";
        } else {
            pauseVideos();
            document.getElementById("play").innerHTML = "<img alt='&gl;' title='Play' src='images/play-button.png' height='22' width='22'/>";
        }
    }

    /**
     * Function get url for video.
     */
    function getVideo() {
        var fileURL1 = document.getElementById("videoFile1").value;
        var fileURL2 = document.getElementById("videoFile2").value;
        var fileURL3 = document.getElementById("videoFile3").value;
        var fileURL4 = document.getElementById("videoFile4").value;

        if (fileURL1 != "" && fileURL2 != "" && fileURL3 != "" && fileURL4 != "") {
            video1.src = fileURL1;
            video1.load();
            video2.src = fileURL2;
            video2.load();
            video3.src = fileURL3;
            video3.load();
            video4.src = fileURL4;
            video4.load();
            document.getElementById("buttonbar").style.display = "block";
            document.getElementById("play").innerHTML = "<img alt='&gl;' title='Play' src='images/play-button.png' height='22' width='22'/>";
            // setFileTags();
            loadSubtitle();
            paintListAll();
        } else {
            errMessage("Enter a valid video URL for video and file for annotation tags");
        }
    }

    /**
     * Function Set Time for all videos.
     */
    function setTime(tValue) {
        try {
            if (tValue == 0) {
                video1.currentTime = tValue;
                video2.currentTime = tValue;
                video3.currentTime = tValue;
                video4.currentTime = tValue;
            } else {
                video1.currentTime += tValue;
                video2.currentTime += tValue;
                video3.currentTime += tValue;
                video4.currentTime += tValue;
            }
        } catch (err) {
            errMessage("Video content might not be loaded");
        }
    }

    /**
     * Function Set Time for all videos.
     */
    function setTimeBar(tValue) {
        try {
            video1.currentTime = tValue;
            video2.currentTime = tValue;
            video3.currentTime = tValue;
            video4.currentTime = tValue;
        } catch (err) {
            errMessage("Video content might not be loaded");
        }
    }

    /**
     * Function Set Volumen for all videos.
     */
    function setVol(value) {
        var vol = video1.volume;
        vol += value;
        if (vol >= 0 && vol <= 1) {
            video1.volume = vol;
            video2.volume = vol;
            video3.volume = vol;
            video4.volume = vol;
        } else {
            video1.volume = (vol < 0) ? 0 : 1;
            video2.volume = (vol < 0) ? 0 : 1;
            video3.volume = (vol < 0) ? 0 : 1;
            video4.volume = (vol < 0) ? 0 : 1;
        }
    }

    /**
     * Function Show error msg for all videos.
     */
    function errMessage(msg) {
        document.getElementById("errorMsg").textContent = msg;
        setTimeout("document.getElementById('errorMsg').textContent=''", 10000);
    }

    /**
     * Function Modify Information of Tags for all videos.
     */
    function modInfoTag(id, title, bottom, text, caption) {
        for (var i=0; i < caption.length; i++) {
            if (caption[i].id == id) {
                caption[i].text = title;
                caption[i].data = bottom;
                caption[i].comment = text;
                caption[i].overlayText = title;
                break;
            }
        }
        return true;
    }

    /**
     * Function loadSubtitle.
     */
    function loadSubtitle() {
        try {
            // Control for video 3
            video_3.markers({
                markerStyle: {
                    'width':'10px',
                    'border-radius': '40%',
                    'background-color': 'blue'
                },
                markerTip:{
                    display: false,
                    text: function(marker) {
                        return marker.text;
                    },
                    time: function(marker) {
                        return marker.time;
                    }
                },
                breakOverlay:{
                    display: true,
                    style:{
                        'width':'100%',
                        'height': '10%',
                        'background-color': 'rgba(0,0,0,0)',
                        'color': 'white',
                        'font-size': '20px'
                    },
                    text: function(marker) {
                        //return marker.text;
                        return '';
                    }
                },
                onMarkerClick: function(marker){
                    //$('.dynamic-demo-events').append('<li class="list-group-item">Marker click: '+marker.time+'</li>');
                },
                onMarkerReached: function(marker){
                    //$('.dynamic-demo-events').append('<li class="list-group-item">Marker reached: '+marker.time+'</li>');
                },
                markers: caption_data["cam-3"].rows
            });
            video_3.caption({
                data: caption_data["cam-3"].rows, setting: {
                    onCaptionChange: function (num_c) {
                        console.log("Show 3: " + num_c + " caption");
                    }
                }
            });

            // Control for video 4
            video_4.markers({
                markerStyle: {
                    'width':'10px',
                    'border-radius': '40%',
                    'background-color': 'blue'
                },
                markerTip:{
                    display: false,
                    text: function(marker) {
                        return marker.text;
                    },
                    time: function(marker) {
                        return marker.time;
                    }
                },
                breakOverlay:{
                    display: true,
                    style:{
                        'width':'100%',
                        'height': '10%',
                        'background-color': 'rgba(0,0,0,0)',
                        'color': 'white',
                        'font-size': '20px'
                    },
                    text: function(marker) {
                        // return marker.text;
                        return '';
                    }
                },
                onMarkerClick: function(marker){
                    //$('.dynamic-demo-events').append('<li class="list-group-item">Marker click: '+marker.time+'</li>');
                },
                onMarkerReached: function(marker){
                    //$('.dynamic-demo-events').append('<li class="list-group-item">Marker reached: '+marker.time+'</li>');
                },
                markers: caption_data["cam-4"].rows
            });
            video_4.caption({
                data: caption_data["cam-4"].rows, setting: {
                    onCaptionChange: function (num_c) {
                        console.log("Show 4: " + num_c + " caption");
                    }
                }
            });

            // Control for video 2
            video_2.markers({
                markerStyle: {
                    'width':'10px',
                    'border-radius': '40%',
                    'background-color': 'blue'
                },
                markerTip:{
                    display: false,
                    text: function(marker) {
                        return marker.text;
                    },
                    time: function(marker) {
                        return marker.time;
                    }
                },
                breakOverlay:{
                    display: true,
                    style:{
                        'width':'100%',
                        'height': '10%',
                        'background-color': 'rgba(0,0,0,0)',
                        'color': 'white',
                        'font-size': '20px'
                    },
                    text: function(marker) {
                        // return marker.text;
                        return '';
                    }
                },
                onMarkerClick: function(marker){
                    //$('.dynamic-demo-events').append('<li class="list-group-item">Marker click: '+marker.time+'</li>');
                },
                onMarkerReached: function(marker){
                    //$('.dynamic-demo-events').append('<li class="list-group-item">Marker reached: '+marker.time+'</li>');
                },
                markers: caption_data["cam-2"].rows
            });
            video_2.caption({
                data: caption_data["cam-2"].rows, setting: {
                    onCaptionChange: function (num_c) {
                        console.log("Show 2: " + num_c + " caption");
                    }
                }
            });

            // Control for video 1
            video_1.markers({
                markerStyle: {
                    'width':'10px',
                    'border-radius': '40%',
                    'background-color': 'blue'
                },
                markerTip:{
                    display: false,
                    text: function(marker) {
                        return marker.text;
                    },
                    time: function(marker) {
                        return marker.time;
                    }
                },
                breakOverlay:{
                    display: true,
                    style:{
                        'width':'100%',
                        'height': '10%',
                        'background-color': 'rgba(0,0,0,0)',
                        'color': 'white',
                        'font-size': '20px'
                    },
                    text: function(marker) {
                        // return marker.text;
                        return '';
                    }
                },
                onMarkerClick: function(marker){
                    //$('.dynamic-demo-events').append('<li class="list-group-item">Marker click: '+marker.time+'</li>');
                },
                onMarkerReached: function(marker){
                    //$('.dynamic-demo-events').append('<li class="list-group-item">Marker reached: '+marker.time+'</li>');
                },
                markers: caption_data["cam-1"].rows
            });
            video_1.caption({
                data: caption_data["cam-1"].rows, setting: {
                    onCaptionChange: function (num_c) {
                        console.log("Show 1: " + num_c + " caption");
                    }
                }
            });
        } catch(err) {
            console.log("No refresh object videos: " + err)
        }

    }

    /**
     * Function get cam video.
     */
    function getCamVideo(cam){
        var video = '';
        switch(parseInt(cam)) {
            case 1:
                video = video_1;
                break;
            case 2:
                video = video_2;
                break;
            case 3:
                video = video_3;
                break;
            case 4:
                video = video_4;
                break;
        }
        return video;
    }

    /**
     * Function prev tag.
     */
    function prevTagVideos(){
        video_1.markers.prev();
        video_2.markers.prev();
        video_3.markers.prev();
        video_4.markers.prev();
    }

    /**
     * Function Next tag.
     */
    function nextTagVideos(){
        video_1.markers.next();
        video_2.markers.next();
        video_3.markers.next();
        video_4.markers.next();
    }

    /**
     * Function get cam video.
     */
    function getCaption(cam){
        var cam_index = "cam-" + cam;
        var caption = caption_data[cam_index];
        return caption;
    }

    /**
     * Function move tags 1 seconds.
     */
    function shiftTags(cam, increment){
        var data = getCamVideo(cam).caption.getCaptionData();
        for (var i = 0; i < data.length; i++) {
            var startTime = data[i].startTime;
            if (startTime >= 0){
                startTime += increment;
                if (startTime < 0) {
                    data[i].startTime = 0;
                    data[i].endTime = 2000;
                    errMessage('You can not move the tag on the video ' + cam);
                } else {
                    data[i].startTime += increment;
                    data[i].endTime += increment;
                    errMessage('Move the tag 1 seconds on the video ' + cam);
                }
            } else {
                errMessage('You can not move the tag on the video ' + cam);
            }
        }
        video_1.caption.updateCaption();
        video_2.caption.updateCaption();
        video_3.caption.updateCaption();
        video_4.caption.updateCaption();
    }

    $(".dynamic-demo-add").click(function () {
        pauseVideos();
        var id_ = $(this).parent().attr('id');
        var cam = id_.slice(-1);
        var currentTime = parseFloat($("#ct_" + cam).val());
        var tag_input = $("#bottom_text_tag_" + cam);
        var text_input = $("#text_tag_" + cam);
        var ed_sn = $("#ed_" + cam);
        var bottom = tag_input.val();
        var text = text_input.val();
        var title = '';
        var sn = ed_sn.val();
        var id_input = $("#id_" + cam);

        if (currentTime != '' && bottom != '') {
            var id = parseInt(id_input.val());
            if (sn == 'S') {
                // update caption and markers
                var cam_index = "cam-" + cam;
                modInfoTag(id, title, bottom, text, caption_data[cam_index].rows);
            } else {
                id_input.val('');
                var ctempa = {};
                var caption_ = getCaption(cam);
                var num_tags = caption_.rows.length;
                num_tags += 1;
                var tm = currentTime * 1000;
                ctempa.startTime = tm;     // time in miliseconds
                ctempa.endTime = tm + 2000;
                ctempa.position = "HB";
                ctempa.data = bottom;
                ctempa.alignment = "C";
                ctempa.comment = text;
                ctempa.id = num_tags;
                ctempa.text = title;
                ctempa.time = currentTime;

                caption_.rows.push(ctempa);
                caption_.total = num_tags.toString();
                caption_.records = num_tags.toString();

                var ctempb = $.extend({}, ctempa);
                ctempb.text = '';
                ctempb.data = '';
                ctempb.comment = '';

                switch(parseInt(cam)) {
                    case 1:
                        caption_data["cam-2"].rows.push(ctempb);
                        caption_data["cam-2"].total = num_tags.toString();
                        caption_data["cam-2"].records = num_tags.toString();
                        caption_data["cam-3"].rows.push(ctempb);
                        caption_data["cam-3"].total = num_tags.toString();
                        caption_data["cam-3"].records = num_tags.toString();
                        caption_data["cam-4"].rows.push(ctempb);
                        caption_data["cam-4"].total = num_tags.toString();
                        caption_data["cam-4"].records = num_tags.toString();
                        break;
                    case 2:
                        caption_data["cam-1"].rows.push(ctempb);
                        caption_data["cam-1"].total = num_tags.toString();
                        caption_data["cam-1"].records = num_tags.toString();
                        caption_data["cam-3"].rows.push(ctempb);
                        caption_data["cam-3"].total = num_tags.toString();
                        caption_data["cam-3"].records = num_tags.toString();
                        caption_data["cam-4"].rows.push(ctempb);
                        caption_data["cam-4"].total = num_tags.toString();
                        caption_data["cam-4"].records = num_tags.toString();
                        break;
                    case 3:
                        caption_data["cam-2"].rows.push(ctempb);
                        caption_data["cam-2"].total = num_tags.toString();
                        caption_data["cam-2"].records = num_tags.toString();
                        caption_data["cam-1"].rows.push(ctempb);
                        caption_data["cam-1"].total = num_tags.toString();
                        caption_data["cam-1"].records = num_tags.toString();
                        caption_data["cam-4"].rows.push(ctempb);
                        caption_data["cam-4"].total = num_tags.toString();
                        caption_data["cam-4"].records = num_tags.toString();
                        break;
                    case 4:
                        caption_data["cam-2"].rows.push(ctempb);
                        caption_data["cam-2"].total = num_tags.toString();
                        caption_data["cam-2"].records = num_tags.toString();
                        caption_data["cam-3"].rows.push(ctempb);
                        caption_data["cam-3"].total = num_tags.toString();
                        caption_data["cam-3"].records = num_tags.toString();
                        caption_data["cam-1"].rows.push(ctempb);
                        caption_data["cam-1"].total = num_tags.toString();
                        caption_data["cam-1"].records = num_tags.toString();
                        break;
                }

                video_1.markers.add([{
                    time: currentTime,
                    text: title,
                    overlayText: title
                }]);

                video_2.markers.add([{
                    time: currentTime,
                    text: title,
                    overlayText: title
                }]);

                video_3.markers.add([{
                    time: currentTime,
                    text: title,
                    overlayText: title
                }]);

                video_4.markers.add([{
                    time: currentTime,
                    text: title,
                    overlayText: title
                }]);
            }
            paintListAll();

            tag_input.val('');
            text_input.val('');
            $("#textOver_" + cam).val('');
            ed_sn.val('N');
        } else {
            alert("Please, play Video and enter the tag information for Video Camera " + cam);
        }
        tag_input.attr('disabled', 'disabled');
        text_input.attr('disabled', 'disabled');
        ed_sn.val('N');
        $("#ct_" + cam).val('');
        video_1.caption.updateCaption();
        video_2.caption.updateCaption();
        video_3.caption.updateCaption();
        video_4.caption.updateCaption();
        video_1.markers.updateTime();
        video_2.markers.updateTime();
        video_3.markers.updateTime();
        video_4.markers.updateTime();
        playVideos();
    });

    $(".dynamic-demo-cancel").click(function () {
        var id_ = $(this).parent().attr('id');
        cancelEdit(id_.slice(-1));
    })

    $(".dynamic-demo-add-tag").click(function () {
        pauseVideos();
        var id_ = $(this).parent().attr('id');
        var cam = id_.slice(-1);
        var ct = parseFloat(getCamVideo(cam).currentTime()).toFixed(2);
        var text_input = $("#bottom_text_tag_" + cam);
        text_input.prop('disabled', false);
        text_input.focus();
        $("#text_tag_" + cam).prop('disabled', false);
        $("#ct_" + cam).val(ct);

    });

    $(".dynamic-demo-prev").click(function(){
        prevTagVideos();
    });

    $(".dynamic-demo-next").click(function(){
        nextTagVideos();
    });

    $(".increase-font").click(function () {
        var id_ = $(this).parent().attr('id');
        getCamVideo(id_.slice(-1)).caption.increaseFontSize();
    });

    $(".decrease-font").click(function () {
        var id_ = $(this).parent().attr('id');
        getCamVideo(id_.slice(-1)).caption.decreaseFontSize();
    });

    $(".dynamic-demo-shift-r").click(function () {
        var id_ = $(this).parent().attr('id');
        shiftTags(id_.slice(-1), 1000)
    });

    $(".dynamic-demo-shift-l").click(function () {
        var id_ = $(this).parent().attr('id');
        shiftTags(id_.slice(-1), -1000)
    });

    /**
     * Functoin paint list in Web.
     * @param cam
     * @param caption
     */
    function paintList(cam, caption) {
        // insert marker list
        $("#marker-list-" + cam).empty();
        for (var i = 0; i < caption.length; i++) {
            var item = '';
            if (caption[i].data != '') {
                item = $("<li class='list-group-item' style='padding: 1px 1px;' data-index='" + i +
                    "' ><b>" +
                    "<input type='hidden' id='current_time_" + cam + i +  "' name='current_time_" + cam + i + "' value='" + caption[i].time + "' />" +
                    "<input type='hidden' id='ed_" + cam + i + "' name='ed_" + cam + i + "' value='S' />" +
                    "<input type='hidden' id='id_" + cam + i + "' name='id_" + cam + i + "' value='" + caption[i].id + "' />" +
                    "<input type='text' disabled='disabled' size='70' maxlength='70' name='tag_text_save_" + cam + i + "' id='tag_text_save_" + cam + i + "' value='Time: " + caption[i].time  + " seg. - Tags: " + caption[i].data + "' class='tooltip_' title='" + caption[i].comment + "'/> "  +
                    "</b>" +
                    "&nbsp;<img src='images/preview.png' class='li-prev tooltip_' width='18' height='18' alt='Preview' title='Preview Tag on Video' id='goto_tag_" + i +
                    cam + "' onclick='javascript: goTag(" + cam + ", " + i + ");'/> " +
                    "&nbsp;<img src='images/rename.png' class='li-rename tooltip_' width='18' height='18' alt='Edit' title='Edit Tag Text' id='edit_tag_" + i +
                    cam + "' onclick='javascript: editTag(" + cam + ", " + i + ");'/> " +
//                            "&nbsp;<img src='images/left-arrow.png' class='li-left-time' width='18' height='18' alt='Move Left' title='Move Left Time Tag' id='move_left_tag_" + i +
//                            cam + "' onclick='javascript: moveLeftTag(" + cam + ", " + i + ");'/> " +
//                            "&nbsp;<img src='images/right-arrow.png' class='li-right-time' width='18' height='18' alt='Move Right' title='Move Right Time Tag' id='move_right_tag_" + i +
//                            cam + "' onclick='javascript: moveRightTag(" + cam + ", " + i + ");'/> " +
                    "</li>");
                // $("#marker-list-" + cam).append(item);
            } else{
                item = $("<li class='list-group-item' style='padding: 1px 1px;display: none;' data-index='" + i + "' ></li>");
            }
            $("#marker-list-" + cam).append(item);
        }
        $("#marker-list-" + cam).append("<script>$(function(){ Tipped.create('.tooltip_', {skin: 'red'} ); });<\/script>");
    }

    // paintListAll();

    /**
     * Function Paint All list on video.
     */
    function paintListAll(){
        paintList(1, caption_data["cam-1"].rows);
        paintList(2, caption_data["cam-2"].rows);
        paintList(3, caption_data["cam-3"].rows);
        paintList(4, caption_data["cam-4"].rows);
    }

});

/**
 * Function Pause All videos
 */
function pauseVideos(){
    video1.pause();
    video2.pause();
    video3.pause();
    video4.pause();
}

/**
 * Function Play All videos
 */
function playVideos(){
    video1.play();
    video2.play();
    video3.play();
    video4.play();
}

/**
 * Function Go Tags index preview.
 * @param cam
 * @param index_tag
 */
function goTag(cam, index_tag){
    pauseVideos();
    var cam_index = "cam-" + cam;
    var ct = caption_data[cam_index].rows[index_tag].time;
    video_1.currentTime(ct);
    video_2.currentTime(ct);
    video_3.currentTime(ct);
    video_4.currentTime(ct);
    playVideos();
}

/**
 * Function Edit Text in Tag.
 * @param cam
 * @param index_tag
 */
function editTag(cam, index_tag){
    pauseVideos();
    goTag(cam, index_tag);
    var cam_index = "cam-" + cam;

    var text = caption_data[cam_index].rows[index_tag].text;
    var bottom = caption_data[cam_index].rows[index_tag].data;
    var comment = caption_data[cam_index].rows[index_tag].comment;
    var id = caption_data[cam_index].rows[index_tag].id;

    var tag_input = $("#bottom_text_tag_" + cam);
    var text_input = $("#text_tag_" + cam);

    $("#top_text_tag_" + cam).val(text);
    tag_input.val(bottom);
    text_input.val(comment);
    tag_input.prop('disabled', false);
    text_input.prop('disabled', false);
    $("#textOver_" + cam).val(text);
    $("#id_" + cam).val(id);
    $("#ed_" + cam).val('S');
}

/**
 * Function Cancel Edition on Tag.
 * @param cam
 */
function cancelEdit(cam){
    var tag_input = $("#bottom_text_tag_" + cam);
    var text_input = $("#text_tag_" + cam);
    $("#top_text_tag_" + cam).val('');
    tag_input.val('');
    text_input.val('');
    $("#id_" + cam).val('');
    $("#ed_" + cam).val('N');
    $("#textOver_" + cam).val('');
    tag_input.attr('disabled', 'disabled');
    text_input.attr('disabled', 'disabled');
    $("#ct_" + cam).val('');
}
