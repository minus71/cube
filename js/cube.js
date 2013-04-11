function Cube(containerId){
	var _containerId = containerId;

	function init(){
		var cont = $(_containerId);
	}
	init();
	
}


function CubeProblem(initialState){
	
	var m_initialState;
	if(initialState){
		m_initialState = initialState;
	}else{
		m_initialState = new CubeState();
	}
	
	var currentState = m_initialState;
	
	
	this.getState=function (){
		return currentState;
	};
	
	this.getActions = function(){
		var actions = [];
		for(var i=0;i<6;i++){
			for(var r=1;r<=3;r++){
				var action = [i,r];
				actions.push(action);
			}
		}
		return actions;
	};
	
	var facesMatrix = {
        //     From     To
        0:[ // Face 0
            [[0,0,0],[0,1,0]],
            [[0,0,1],[0,1,1]],
            [[0,1,1],[0,0,1]],
            [[0,1,0],[0,0,0]],
            // Face 1
            [[1,0,1],[4,0,1]],
            [[1,1,1],[4,1,1]],
            // Face 2
            [[2,0,1],[1,0,1]],
            [[2,1,1],[1,1,1]],
            // Face 3
            [[3,0,1],[2,0,1]],
            [[3,1,1],[2,1,1]],
            // Face 4
            [[4,0,1],[3,0,1]],
            [[4,1,1],[3,1,1]],
        ]
	};
	
	this.getSuccessorState = function(state, action){
		var currentMatrix = state.getMatrix();
        var newState = state.clone();
        var newMatrix = newState.getMatrix();
        var transformMatrix = facesMatrix[action[0]];
        for(var i in transformMatrix){
            var xformCell = transformMatrix[i];
            var fromCell = xformCell[0];
            var toCell = xformCell[1];
            newMatrix[toCell[0]][toCell[1]][toCell[2]] =  currentMatrix[fromCell[0]][fromCell[1]][fromCell[2]];
        }
        return newState;
	};
	
}

function CubeState(state_matrix){
    
    
	var faces = [
		[['red','red'],['red','red']],
		[['blue','blue'],['blue','blue']],
		[['orange','orange'],['orange','orange']],
		[['white','white'],['white','white']],
		[['green','green'],['green','green']],
		[['yellow','yellow'],['yellow','yellow']]
	];

    if(state_matrix){
        for(var f = 0;f<6;f++){
			for(var x=0;x<2;x++){
				for(var y=0;y<2;y++){
                    faces[f][x][y]=state_matrix[f][x][y];
				}
			}
        }
    }


	this.faceToString = function(faceNumber){
		var selected_face = faces[faceNumber];
		var result = "";
		for(var x=0;x<2;x++){
			for(var y=0;y<2;y++){
				result+=selected_face[x][y][0].toUpperCase();
			}
			result+="\n";
		}
		return result;
	};

	this.toArray = function(){
		var result = [];
		for(var faceNum = 0;faceNum<6;faceNum++){
			for(var x=0;x<2;x++){
				for(var y=0;y<2;y++){
					result.push([faceNum,x,y,faces[faceNum][x][y]]);
				}
			}
		}
		return result;
	};
	
	this.getMatrix = function(){
		return faces;
	};
	
    this.clone = function(){
        var newState = new CubeState(faces);
        return newState;
    }
}

function CubeLayout(cont){
	var container = cont;
	var faceMatrix = [
        [1,0],
        [0,1],
        [1,1],
        [2,1],
        [3,1],
        [1,2]
    ];
    var cellWidth = 20;
    var cellPadding = 2;

    var init=function(){
        var svg = d3.select(container);
        var facesArray = [[0],[1],[2],[3],[4],[5]];
        var x=function(dataArray){
            var faceNum = dataArray[0];
        	var faceX = faceMatrix[faceNum][0];
            var _x = faceX*((cellWidth+cellPadding)*2+cellPadding*3);
            return _x;
        };
        var y=function(dataArray){
            var faceNum = dataArray[0];
    		var faceY = faceMatrix[faceNum][1];    	
		    var _y = faceY*((cellWidth+cellPadding)*2+cellPadding*3);
            return _y;
        };

        svg.data(facesArray)
            .selectAll('.faceRect')
            .data(facesArray)
            .attr('class','face_'+function(d){return d[0]}+" faceRect")
            .enter()
                .append('rect')
                .attr('class','face_'+function(d){return d[0]}+" faceRect")
                .attr("width",cellWidth*2+cellPadding*3)
                .attr("height",cellWidth*2+cellPadding*3)
                .attr("rx","6")
                .attr("ry","6")
                .attr("x",x)
                .attr("y",y);
        svg.append
    }
    

    var cellXY = function(dataArray){
		var faceNum = dataArray[0];
		var col = dataArray[1]?dataArray[1]:0;
	    var row = dataArray[2]?dataArray[2]:0;
		// var color = dataArray[3];
		var faceX = faceMatrix[faceNum][0];
		var faceY = faceMatrix[faceNum][1];
		var _x = faceX*((cellWidth+cellPadding)*2+cellPadding*3)+col*(cellWidth+cellPadding)+cellPadding;
		var _y = faceY*((cellWidth+cellPadding)*2+cellPadding*3)+row*(cellWidth+cellPadding)+cellPadding;
		var result ={
			x : _x, y: _y 
		};
		return result;
	};
	
	this.show=function(state){
		
		
		var x=function(dataArray){return cellXY(dataArray).x;};
		var y=function(dataArray){return cellXY(dataArray).y;};
		
		
		var cube = d3.select(container);
		cube
			.selectAll('.cellRect')
			.data(state.toArray())
			.attr('class',function(d){return d[3]+"_face cellRect";})
			.enter()
				.append('rect')
				.attr('class',function(d){return d[3]+"_face cellRect";})
				.attr("width","20")
				.attr("height","20")
				.attr("rx","4")
				.attr("ry","4")
				.attr("x",x)
				.attr("y",y);
	};
    
    init();
}