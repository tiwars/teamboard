function handleClick(id){
	setClipboard(document.getElementById(id).innerHTML.trim().replace(/<br>/gm,'\n'));
}

function setClipboard(value) {
    var tempInput = document.createElement("textarea");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value;//'.replace(/<br>/gm,'\n');'
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

function setClipboard2(node){
    var selection = getSelection();
    selection.removeAllRanges();
    var range=document.createRange();
    range.selectNodeContents(node);
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges()
}

function deletePost(id){

	$.ajax({

    url : "/"+id,
    type : 'DELETE',
    dataType:'json',
    success : function(data) {              
        window.location = window.location.href;
    	},
    error : function(request,error){
        window.location = window.location.href;
    	}
	});
}

function submitPost(data){

	$.ajax({

    url : '/',
    type : 'POST',
    data : data,
    dataType:'json',
    success : function(data) {         
         window.location = window.location.href;
    	},
    error : function(request,error){
         window.location = window.location.href;
    	}
	});
}

$(function() {
    $( "#notes li" ).droppable();
    $( "#notes li" ).draggable();
});

function submitPoint(value){
    $.ajax({

    url : '/points',
    type : 'POST',
    data : ({feedback:value,user:$.cookie('name')}),
    dataType:'json',
    success : function(data) {
         window.location = window.location.href;
        },
    error : function(request,error){
         window.location = window.location.href;
        }
    });
}
