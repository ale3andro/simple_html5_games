var debugging = true;
var metadata = [];
var draggables = [];
var droppables = [];

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
    var jqxhr = $.getJSON("matching/" + getUrlParams('id') + ".json", function(data) {
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
        var draggables_count = 0;
        var droppables_count = 0;
           
       metadata[0] = data['metadata']['title'];
       metadata[1] = data['metadata']['class'];
       metadata[2] = data['metadata']['answer'];
        $.each(data['draggables'], function(index, value) {
            draggables[draggables_count] = value;
            draggables_count++;  
        });
        console.log(draggables);
        $.each(data['droppables'], function(index, value) {
            droppables[droppables_count] = value;
            droppables_count++;  
        });
        console.log(droppables);
        console.log(metadata);

        if (draggables_count!=droppables_count) {
            if (debugging) { console.log("Ο αριθμός των draggables δεν είναι ίδιος με τον αριθμό των droppables"); }
            alert("Fatal error #001");
            return -1;
        }
        if (draggables_count>5) {
            if (debugging) { console.log("Δεν μπορείς να έχεις περισσότερα από 5 στοιχεία σε κάθε άσκηση αντιστοίχισης"); }
            alert("Fatal error #002");
            fail;
            return -2;
            
        }
        return 1;
    }   
}

function setup_matching() {
    $("#alx_draggables").html("");
    for (var i=0; i<draggables.length; i++) {
        $("#alx_draggables").html($("#alx_draggables").html() + draggables[i]['value']);
    }

}

$( function() {

    if (!('id' in getUrlParams())) {
        if (debugging) { console.log("TODO Δεν ορίστηκε το id του quiz - Πρέπει να τερματιστεί η εφαρμογή"); }
        alert('Δεν ορίστηκε id');
        return; 
    }
    

    if (get_data_from_server()<0) {
        if (debugging) { console.log("Σφάλμα στην ανάγνωση του json");}
        return;
    }
    
    setup_matching();

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