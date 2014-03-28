var dataContainer = new Array();
$("table").each(function(){
    var i = 0;

    var data = new Array();
	var trCount = 0;


    $(this).after("<button class='spreadsheet-button dontshow spreadsheet-"+ i +"' index='" + i + "'>Get me Back!</button>");
    $(this).after("<div class='spreadsheet-container spreadsheet-"+ i +"'></div>");
	$('div.spreadsheet-'+ i).addClass("dontshow");
	//console.log("finaL data:" + data);

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
                    row.push($(this).html());
                    console.log($(this).html());
                    console.log(row);
                });
                data[trCount] = row;
                trCount++;
                console.log("data:" + data);
            });
            dataContainer[i] = data;

            $('div.spreadsheet-'+ $(this).attr("index")).handsontable({
                data: data,
                colHeaders: true,
                contextMenu: true,
                manualColumnResize: true,
                rowHeaders: true,
                minSpareCols:4,
                minSpareRows:4
            });
        }

		console.log(i);
        $('div.spreadsheet-'+ $(this).attr("index")).removeClass("dontshow");
		$("button.spreadsheet-" + $(this).attr("index")).removeClass("dontshow");
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
		console.log(dataContainer[index]);
		if($(this).hasClass("on")){
			$(this).removeClass("on");
			$('div.spreadsheet-'+ index).addClass("dontshow");
			$("table.spreadsheet-" + index).show();				
		}else{
			$(this).addClass("on");
			$("table.spreadsheet-" + index).hide();
			$('div.spreadsheet-'+ index).show();
		}
    });
});

