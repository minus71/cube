var layout;
var problem;

function bindClick(){
    d3.selectAll('.cellRect').on('click',function(d){
        var nodeData = d3.select(this).datum();
        var state = problem.getState();
        console.info(nodeData);
        var actions =  problem.getActions();
        var faceNum = nodeData[0];
        var action = actions [faceNum];
        var newState = problem.getSuccessorState(state,action);
        problem = new CubeProblem(newState);
        layout.show(newState);
        bindClick();
    });
}


$(document).ready(function(){
	var btn = $('#ok_btn').button();
	layout = new CubeLayout('#fooz');
    problem = new CubeProblem();
	layout.show(problem.getState());
    bindClick();
    btn.click(function(){
        problem = new CubeProblem();
        layout.show(problem.getState());
        bindClick();
    });
    var solve = $('#solve_btn').button();
    var ecounter = $('.expandCounter');
    solve.click(function(){
        var search = new Search();
        
        var strategy = new BFStrategy();
        //var strategy = new UCStrategyRBT();
        //var strategy=new AStarStrategy();
        var result = search.search(problem,strategy);
        var strOut = "<";
        for(var r in result){
            strOut+=result[r];
            strOut+=',';
        }
        strOut=strOut.substr(0,strOut.length-1);
        strOut+='>\n';
        $('.result').text(strOut);
        var expanded = search.getExpandedNodes();
        ecounter.text(expanded);

    });
});