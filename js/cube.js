function Cube(containerId){
	var _containerId = containerId;

	function init(){
		cont = $(_containerId);
		
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
		0:{
			'left':[1,'top'],
			'top':[4,'top'],
			'right':[3,'top'],
			'bottom':[2,'top']
		},
		1:{
			'left':[4,'right'],
			'top':[0,'left'],
			'right':[2,'left'],
			'bottom':[5,'left']
		}	
	};
	
	this.getSuccessorState = function(action){
		
	};
	
}

function CubeState(){
	var faces = [
		[['red','red'],['red','red']],
		[['blue','blue'],['blue','blue']],
		[['orange','orange'],['orange','orange']],
		[['white','white'],['white','white']],
		[['green','green'],['green','green']],
		[['yellow','yellow'],['yellow','yellow']]
	];
	
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
	
	this.show=function(state){
		
		var cellXY = function(dataArray){
			faceNum = dataArray[0];
			col = dataArray[1];
			row = dataArray[2];
			color = dataArray[3];
			var faceX = faceMatrix[faceNum][0];
			var faceY = faceMatrix[faceNum][1];
			_x = faceX*((cellWidth+cellPadding)*2)+col*(cellWidth+cellPadding);
			_y = faceY*((cellWidth+cellPadding)*2)+row*(cellWidth+cellPadding);
			var result ={
				x : _x, y: _y 
			};
			return result;
		};
		
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

}