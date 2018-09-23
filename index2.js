var debugging = true;

/** FROM https://www.kevinleary.net/javascript-get-url-parameters/
 * JavaScript Get URL Parameter
 * 
 * @param String prop The specific URL parameter you want to retreive the value for
 * @return String|Object If prop is provided a string value is returned, otherwise an object of all properties is returned
 */
function getUrlParams( prop ) {
    var params = {};
    var search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ) );
    var definitions = search.split( '&' );

    definitions.forEach( function( val, key ) {
        var parts = val.split( '=', 2 );
        params[ parts[ 0 ] ] = parts[ 1 ];
    } );

    return ( prop && prop in params ) ? params[ prop ] : params;
}

function get_data_from_server(){
    if (getUrlParams('id')==undefined) {
        if (debugging)
            console.log("TODO - Δεν υπάρχει τεστ με αυτό το id - Να τερματιστεί η εφαρμογή");
    }
    $.ajaxSetup({
        async: false
    });
    var jqxhr = $.getJSON("quizes/" + getUrlParams('id') + ".json", function(data) {
        if (debugging)
            console.log("Η φόρτωση του json από τον server ολοκληρώθηκε με επιτυχία");
            parse_quiz(data);
    })
    .fail(function() {
        if (debugging) {
            console.log( "Αδυναμία φόρτωσης του json αρχείου από τον server" );
            console.log(jqxhr);
        }
    });
    
    function parse_quiz(data) {
        var read_type="question"; // Διαβάζει ερώτηση του quiz
        var read_type="metadata"; // Διαβάζει metadata του quiz
        var read_type="0";
        var question = '';
        var question_count=0;
        var metadata = '';
    
        $.each(data, function(index, value) {
            read_type = "0"; // Πριν αρχίσει το διάβασμα το ρυθμίζω σε μηδέν
            question = '';
            $.each(value, function(key, valu) {
                if (read_type=="0") {
                    if (key=="id") {
                        read_type="metadata";
                    } else {
                        read_type="question";
                    }   
                }
                if (read_type=="question") {
                    if (question=='')
                        question = valu;
                    else    
                        question = question + divider + valu;
                } else {
                    if (metadata=='')
                        metadata=valu;
                    else
                        metadata = metadata + divider + valu;
                }
            });
            if (read_type=="question") {
                sessionStorage.setItem("question" + question_count, question);
                /*
                    status=0 --> not answered yet
                    status=1 --> correct answer
                    status=2 --> wrong answer
                */
                sessionStorage.setItem("question" + question_count + "_status", 0);
                question_count+=1; 
            } else
                sessionStorage.setItem("metadata", metadata);
        });
        sessionStorage.setItem("numQuestions", question_count);
    }   
}


$( function() {
    if (!('id' in getUrlParams())) {
        if (debugging)
            console.log("TODO Δεν ορίστηκε το id του quiz - Πρέπει να τερματιστεί η εφαρμογή");
        //return;
    }
    console.info("test");
    $( "#draggable0" ).draggable();
    $( "#draggable1" ).draggable();
    $( "#draggable2" ).draggable();
    $( "#draggable3" ).draggable();
    $( "#draggable4" ).draggable();
    $( "#droppable0" ).droppable({
        drop: function( event, ui ) { $("#droppable0span").text(ui.draggable.attr("value")); }
    });
    $( "#droppable1" ).droppable({
        drop: function( event, ui ) { $("#droppable1span").text(ui.draggable.attr("value")); }
    });
    $("#alxtest").click(function() {
        window.alert($("#droppable1span").text());
    });
  });