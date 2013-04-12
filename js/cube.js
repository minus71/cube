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
        for(var i=0;i<3;i++){
            for(var r=1;r<=1;r++){
                var action = [i,r];
                actions.push(action);
            }
        }
		return actions;
	};
	
	var facesMatrix = {
        //     From     To
        0:[ // Face 0
            [[0,0,1],[0,0,0]],
            [[0,0,0],[0,1,0]],
            [[0,1,0],[0,1,1]],
            [[0,1,1],[0,0,1]],
            // Face 1
            [[1,0,0],[4,0,0]],
            [[1,1,0],[4,1,0]],
            // Face 2
            [[2,0,0],[1,0,0]],
            [[2,1,0],[1,1,0]],
            // Face 3
            [[3,0,0],[2,0,0]],
            [[3,1,0],[2,1,0]],
            // Face 4
            [[4,0,0],[3,0,0]],
            [[4,1,0],[3,1,0]]
        ],
        1:[ // Face 1
            [[1,0,1],[1,0,0]],
            [[1,0,0],[1,1,0]],
            [[1,1,0],[1,1,1]],
            [[1,1,1],[1,0,1]],
            // Face 0
            [[0,0,1],[2,0,1]],
            [[0,0,0],[2,0,0]],
            // Face 2
            [[2,0,0],[5,0,0]],
            [[2,0,1],[5,0,1]],
            // Face 5
            [[5,0,0],[4,1,1]],
            [[5,0,1],[4,1,0]],
            // Face 4
            [[4,1,0],[0,0,1]],
            [[4,1,1],[0,0,0]]
        ],
        2:[ // Face 2
            [[2,0,1],[2,0,0]],
            [[2,0,0],[2,1,0]],
            [[2,1,0],[2,1,1]],
            [[2,1,1],[2,0,1]],
            // Face 1
            [[1,1,1],[0,0,1]],
            [[1,1,0],[0,1,1]],
            // Face 0
            [[0,0,1],[3,0,0]],
            [[0,1,1],[3,0,1]],
            // Face 3
            [[3,0,0],[5,1,0]],
            [[3,0,1],[5,0,0]],
            // Face 5
            [[5,1,0],[1,1,1]],
            [[5,0,0],[1,1,0]]
        ]

	};
	

    
    /**
     *  getSuccessorState(state,action)
     */
	this.getSuccessorState = function(state, action){
		var currentMatrix = state.getMatrix();
        var newState = state.clone();
        var newMatrix = newState.getMatrix();
        var actionIdx = action[0];
        var repeat = action[1];
        
        var transformMatrix = facesMatrix[actionIdx];
        for(var r =0;r<repeat;r++){
            for(var i in transformMatrix){
                var xformCell = transformMatrix[i];
                var fromCell = xformCell[0];
                var toCell = xformCell[1];
                newMatrix[toCell[0]][toCell[1]][toCell[2]] =  currentMatrix[fromCell[0]][fromCell[1]][fromCell[2]];
            }
            currentMatrix = newState.clone().getMatrix();
        }
        return newState;
	};
	
    this.isGoal=function(state){
        return state.entropy()===0;
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

    function initFaces(){
        var i = 0;
        var newFaces = []
        for(var f = 0;f<6;f++){
            var rowlist = []
            newFaces.push(rowlist)
        	for(var x=0;x<2;x++){
                var collist = [];
                rowlist.push(collist);
    			for(var y=0;y<2;y++){
                    newFaces[f][x][y]={};
                    newFaces[f][x][y].color = faces[f][x][y];
                    newFaces[f][x][y].id = i;
                    i++;
    			}
    		}
        }
        faces = newFaces;
    }

    initFaces();

    if(state_matrix){
        for(var f = 0;f<6;f++){
			for(var x=0;x<2;x++){
				for(var y=0;y<2;y++){
                    faces[f][x][y].color = state_matrix[f][x][y].color;
                    faces[f][x][y].id = state_matrix[f][x][y].id;
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
			result+="|";
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
    };
    
    this.entropy=function(face){
        if(typeof face !== "undefined"){
            var aFace = faces[face];
            var colorSet = [];
            for(var x in aFace){
                var row = aFace[x];
                for(var y in row){
                    var color = aFace[x][y].color;
                    if (colorSet.indexOf(color)<0){
                        colorSet.push(color)
                    }
                }
            }
            return colorSet.length-1;
        }else{
            var value=0;
            for(var f=0;f<6;f++){
                value = Math.max(value,this.entropy(f));
            }
            return value;
        }
    };
}

CubeState.prototype.toString = function(){
    var result = "";
    for(var f=0;f<6;f++){
        var selected_face = this.getMatrix()[f];
    	for(var x=0;x<2;x++){
    		for(var y=0;y<2;y++){
    			result+=selected_face[x][y].color[0].toUpperCase();
    		}
    		result+="|";
    	}
    }
    return result;
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
            .attr('class',function(d){return 'face_'+d[0]+' faceRect'})
            .enter()
                .append('rect')
                .attr('class',function(d){return 'face_'+d[0]+' faceRect'})
                .attr("width",cellWidth*2+cellPadding*3)
                .attr("height",cellWidth*2+cellPadding*3)
                .attr("rx","6")
                .attr("ry","6")
                .attr("x",x)
                .attr("y",y);
        
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
		
		var data = state.toArray();
		var cube = d3.select(container);
		var enter = cube
			.selectAll('.cellRect')
			.data(data)
            .datum(function(d){return d;})
			.attr('class',function(d){return d[3].color+"_face cellRect";})
			.enter();
            
            if(false){
                cube
        		    .selectAll('.node_id')
                    .data(data)
                    .text(function(d){return d[3].id;});
            }            
            enter
				.append('rect')
                .datum(function(d){return d;})
				.attr('class',function(d){return d[3].color+"_face cellRect";})
				.attr("width","20")
				.attr("height","20")
				.attr("rx","4")
				.attr("ry","4")
				.attr("x",x)
				.attr("y",y);
            if(false){
                enter
                    .append('text')
        			.attr("x",function(d){return x(d)+8;})
    				.attr("y",function(d){return y(d)+15;})
                    .append('tspan')
                    .attr('class','node_id')
                    .text(function(d){return d[3].id;});
            }
	};
    
    init();
}


function UCStrategy(){
    var data = new PriorityQueue({'low':true});


    this.fringe = {
        push: function(node) {
            data.push(node,this.cost(node));
        },
        pop: function() {
            var node = data.pop();
            // console.info('Popping node (fringe size:'+data.size() +'):'+planToString(node.plan)+' (value is = '+this.cost(node)+')');
            return node;
        },
        isEmpty: function() {
            return data.empty();
        },
        cost:function(node){
            return node.plan.length;
        },
        toString:function(){
            return data.toString();
        }

    }
}

function UCStrategyRBT(){
    var data = new RedBlackTree();


    this.fringe = {
        push: function(node) {
            data.add(new SearchNode(node.state,node.plan));
        },
        pop: function() {
            var node = data.min();
            data.remove(node);
            return node;
        },
        isEmpty: function() {
            return data.isEmpty();
        },
        cost:function(node){
            return node.plan.length;
        },
        toString:function(){
            
            return data.toString();
        }

    }
}

function BFStrategy(){
    var data = [];


    this.fringe = {
        push: function(node) {
            data.push(node);
        },
        pop: function() {
            return data.shift();
        },
        isEmpty: function() {
            return data.length===0;
        },
        cost:function(node){
            return 0;
        },
        toString:function(){
            
            return data.toString();
        }

    }
}


function AStarStrategy(){
    var data = new PriorityQueue({'low':true});
    this.fringe = {
        push: function(node) {
            data.push(node,this.cost(node)+this.heuristic(node));
        },
        pop: function() {
            var node = data.pop();
            // console.info('Popping node:'+node+' (value is = '+this.cost(node)+')');
            return node;
        },
        isEmpty: function() {
            return data.empty();
        },
        cost:function(node){
            return node.plan.length;
        },
        heuristic:function(node){
          var state = node.state;  
          var entropy = state.entropy;
          return entropy;
        },
        toString:function(){
            return data.toString();
        }
    }
}

function SearchNode(aState,aPlan){
    this.state=aState;
    this.plan=aPlan;
    
    this.cost = this.plan.length;
    
    this.compare = function(other){
        if(this.cost==other.cost){
            for(var i in this.plan){
                if(this.plan[i][0]>other.plan[i][0]){
                    return 1;
                }else if(this.plan[i][0]<other.plan[i][0]){
                    return -1;
                }
            }
            return 0;
        }else if(this.cost>other.cost){
            return 1;
        }else{
            return -1;
        }
    }
    this.toString=function(){
        return planToString(this.plan);
    }
}
