$.getJSON( '/moonshot', function( data ) {
	$.each(data, function(i,v){
		var out = '';
		if(v.media){
			out += ""+
				"<div class='moon-case'>"+
					"<img src='files/"+v.media+"'/>"+
					"<span class='moon-detail'>/moonshot/<b>"+v.moonID+"</b></span>"+
				"</div>"+
			"";
		}

		$("#list").prepend(out);
	})
});

$(document).ready(function(){

	$('#uploadform').submit(function() {
 		$("errmsg").html('');
        $(this).ajaxSubmit({                                                                                                                 
            error: function(xhr) {},
            success: function(response) {
				if(response.code == 200){
					var out = '';
					if(response.media){
						out += ""+
							"<div class='moon-case'>"+
								"<img src='files/"+response.media+"'/>"+
								"<span class='moon-detail'>/moonshot/<b>"+response.moonID+"</b></span>"+
							"</div>"+
						"";

						$("#list").prepend(out);
						$(".ipt-file").val('')
					}
					
				}
				if(response.error.length > 0){
					$(".errmsg").html(response.error);
				}
            }
		});

	return false;
    });


})