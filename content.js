var dataContainer = new Array();
var i = 0;

$("table").each(function(){
    var $table = $(this);
    var data = new Array();
	var trCount = 0;

    $(this).after("<div class='button-div-"+i+" dontshow'><br><button class='spreadsheet-button dontshow spreadsheet-"+ i +"' index='" + i + "'>Get me Back!</button><br><br></div>");
    $(this).after("<div class='spreadsheet-container spreadsheet-"+ i +" dontshow'></div>");

    //
    $(this).addClass("spreadsheet-" + i);
    $(this).attr("index", i);
	
	//adding the hover function
	$(this).dblclick(function(){
        if($(this).attr("parsed") != 'true'){
            $(this).attr("parsed", 'true');
            $(this).find("tr").each(function(){
                console.log($(this));
                console.log("entering tr for " + $(this).attr("class"));
                var row = []
                $(this).children().each(function(){
                    console.log("entering td for " + $(this).attr("class"));
                    row.push($(this).text());
                    console.log($(this).html());
                    console.log(row);
                });
                data[trCount] = row;
                trCount++;
                console.log("data:" + data);
            });
            dataContainer[i] = data;

            var $spreadsheet = $('div.spreadsheet-'+ $(this).attr("index"));
            $('div.spreadsheet-'+ $(this).attr("index")).handsontable({
                data: data,
                colHeaders: true,
                contextMenu: true,
                manualColumnResize: true,
                rowHeaders: true,
                minSpareCols:1,
                minSpareRows: 1,
                onChange: function(changes){
                    if(changes != null){
                        console.log("changes:" + changes);
                        var newVal = changes[0][3];
                        console.log("newVal:" + newVal);
                        if(newVal.charAt(0) == "="){
                            var finalVal = computeVal(newVal.substring(1), data);
                            console.log(finalVal);
                            console.log("row:" + changes[0][0]);
                            console.log($(this));
                            var td = $spreadsheet.handsontable('getCell', changes[0][0], changes[0][1]);
                            $(td).text(finalVal);
                        }
                    }
                }
            });
        }

		console.log(i);
        $('div.spreadsheet-'+ $(this).attr("index")).removeClass("dontshow");
		$("button.spreadsheet-" + $(this).attr("index")).removeClass("dontshow");
        $(".button-div-" + $(this).attr("index")).removeClass("dontshow");
        $(this).hide();
	});
    i++;
});

$(".spreadsheet-button").each(function(){
    var className = $(this).attr("cname"); 
	var index = $(this).attr("index");       
    $(this).click(function(){
        $(this).addClass("on");
        $(this).addClass("dontshow");
        $(".button-div-" + index).addClass("dontshow");
		console.log(dataContainer[index]);
		if($(this).hasClass("on")){
			$(this).removeClass("on");
			$('div.spreadsheet-'+ index).addClass("dontshow");
            $("")
			$("table.spreadsheet-" + index).show();				
		}else{
			$(this).addClass("on");
			$("table.spreadsheet-" + index).hide();
			$('div.spreadsheet-'+ index).show();
		}
    });
});

$("button.spreadsheet-calbutton").click(function(){
    var index = $(this).parents().find("table:first").attr("index");
    console.log(index);
});

function computeVal(expression, data){
    var x = expression

    var separators = [' ', '\\\+', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?'];
    console.log(separators.join('|'));
    var tokens = x.split(new RegExp(separators.join('|'), 'g'));
    console.log(tokens);
    $(tokens).each(function(){
        console.log($(this));
        var col = $(this)[0][0].toLowerCase().charCodeAt()-97;
        var row = $(this)[0][1];
        var str = $(this)[0][0] + $(this)[0][1];
        if(isNaN(parseFloat(str))){
            try{
                var value = data[row][col];
                if(isNaN(parseFloat(value))){
                    expression = "error";
                }
            }catch(e){
                expression = "error";
            }
            var str = $(this)[0][0] + $(this)[0][1];
            console.log(value);
            console.log(str);
            expression = expression.replace(str, value);
            console.log(expression);
        }
    });
    if(expression != 'error'){
        return(eval(expression));
    }else{
        return expression;
    }
}

