var dataContainer = new Array();
var i = 0;

$("table").each(function(){
    var $table = $(this);
    var data = new Array();
	var trCount = 0;

    $(this).after("<div class='button-div-"+i+" dontshow'><br><button class='spreadsheet-button dontshow spreadsheet-"+ i +"' index='" + i + "'>Get me Back!</button><br><br></div>");
    $(this).after("<div class='spreadsheet-container spreadsheet-"+ i +" dontshow'></div>");

    //
    $table.addClass("spreadsheet-" + i);
    $table.attr("index", i);
	
	//adding the hover function
	$table.dblclick(function(){
        var tableIndex = $(this).attr("index");
        var $spreadsheet = $("div.spreadsheet-"+ tableIndex);
        var $button = $("button.spreadsheet-" + tableIndex);
        var $buttondiv = $(".button-div-" + tableIndex);

        if($(this).attr("parsed") != 'true'){
            $(this).attr("parsed", 'true');
            $(this).find("tr").each(function(){
                var row = []
                $(this).children().each(function(){
                    row.push($(this).text());
                });
                data[trCount] = row;
                trCount++;
            });
            dataContainer[i] = data;
            $spreadsheet.handsontable({
                data: data,
                colHeaders: true,
                contextMenu: true,
                manualColumnResize: true,
                rowHeaders: true,
                minSpareCols:1,
                minSpareRows: 1,
                onChange: function(changes){
                    if(changes != null){
                        var newVal = changes[0][3];
                        if(newVal.charAt(0) == "="){
                            var finalVal = computeVal(newVal.substring(1), data);
                            var td = $spreadsheet.handsontable('getCell', changes[0][0], changes[0][1]);
                            $(td).text(finalVal);
                        }
                    }
                }
            });
        }

        $spreadsheet.removeClass("dontshow");
	    $button.removeClass("dontshow");
        $buttondiv.removeClass("dontshow");
        $(this).addClass("dontshow");
	});
    i++;
});

$(".spreadsheet-button").each(function(){
	var index = $(this).attr("index");       
    $(this).click(function(){
        $(this).addClass("dontshow");
        $(".button-div-" + index).addClass("dontshow");
        $('div.spreadsheet-'+ index).addClass("dontshow");
        $("table.spreadsheet-" + index).removeClass("dontshow");
    });
});

function computeVal(expression, data){
    var separators = [' ', '\\\+', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?'];
    var tokens = expression.split(new RegExp(separators.join('|'), 'g'));
    $(tokens).each(function(){
        var col = $(this)[0][0].toLowerCase().charCodeAt()-97;  //a/A/b/B
        var row = "";
        for(var i=1; i<$(this)[0].length; i++){
            var row = row + $(this)[0][i];
        }
        var str = $(this)[0][0] + row;
        if(isNaN(parseFloat(str))){
            try{
                var value = data[row-1][col];
                if(isNaN(parseFloat(value))){
                    expression = "error";
                }
            }catch(e){
                expression = "error";
            }
            expression = expression.replace(str, value);
        }
    });
    if(expression != 'error'){
        return(eval(expression));
    }else{
        return expression;
    }
}

