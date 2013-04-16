function getTestState(actionsIndexes){
    var problem = new CubeProblem();
    var state = problem.getState();
    var actions = problem.getActions();
    for(var idx in actionsIndexes){
        state = problem.getSuccessorState(state,actions[actionsIndexes[idx]]);
    }
    return state;
}

test( "A basic test example", function() {
  var value = "hello";
  equal( value, "hello", "We expect value to be hello" );
});

test("check actions",function(){
    var problem = new CubeProblem();
    var actions = problem.getActions();
    deepEqual(actions,[0,1,2]);
});

test("Check layout is displayed",function(){
    $('#qunit-fixture').append('<svg id="fooz" width="600" height="400"></svg>');
	var layout = new CubeLayout('#fooz');
    var problem = new CubeProblem();
	layout.show(problem.getState());
    var svg = ('#fooz');
// test
    equal($('.cellRect',svg).length,24);
    equal($('.faceRect',svg).length,6);
}); 

test("Check rotation on top face",function() {
    var problem = new CubeProblem();
    var actions = problem.getActions();
    var initialState = problem.getState();
    var action=actions[0];
    var newState = problem.getSuccessorState(initialState,action);
    equal(newState.toString(),"RR|RR|OB|OB|WO|WO|GW|GW|BG|BG|YY|YY|");
});

test("Check rotation on left face",function() {
    var problem = new CubeProblem();
    var actions = problem.getActions();
    var initialState = problem.getState();
    var action=actions[1];
    var newState = problem.getSuccessorState(initialState,action);
    equal(newState.toString(),"GG|RR|BB|BB|RR|OO|WW|WW|GG|YY|OO|YY|");
});

test("Check rotation on center face",function() {
    var problem = new CubeProblem();
    var actions = problem.getActions();
    var initialState = problem.getState();
    var action=actions[2];
    var newState = problem.getSuccessorState(initialState,action);
    equal(newState.toString(),"RB|RB|BB|YY|OO|OO|RR|WW|GG|GG|WY|WY|");
});

test("Check cycle rotation",function() {
    var problem = new CubeProblem();
    var a = problem.getActions();
    var state = problem.getState();
    
    for(var i=0;i<3;i++){
        state = problem.getSuccessorState(state,a[i]);
    }

    equal(state.toString(),"GO|RO|BB|WY|RO|RW|BR|GW|BG|YY|WO|GY|");

    for(var i=2;i>=0;i--){
        for(var r=0;r<3;r++){
            state = problem.getSuccessorState(state,a[i]);
        }
    }
    equal(state.toString(),"RR|RR|BB|BB|OO|OO|WW|WW|GG|GG|YY|YY|");
});

test("Check solution of 3 step problem", function(){
    var testState = getTestState([2]);
    equal(testState.toString(),'RB|RB|BB|YY|OO|OO|RR|WW|GG|GG|WY|WY|');
    var problem = new CubeProblem(testState);
    
    var search = new Search();
    var strategy = new BFStrategy();
    var result = search.search(problem,strategy);

    deepEqual(result,[2,2,2])
});

test("Check plan",function() {
    var actions=[1,2,2,1];
    var plan = new Plan(actions);
    equal(plan.rawActions(),actions);
    deepEqual(plan.aggregated(),[{action:1,repeat:1},{action:2,repeat:2},{action:1,repeat:1}]);
    equal(plan.toString(),'[1, 2x2, 1]');
});

test("Check Problem.playActions",function() {
    var problem = new CubeProblem();
    var state = problem.playActions([1,2,1,0,1]);
    var stateB = getTestState([1,2,1,0,1]);
    equal(state.toString(),stateB.toString());
});


test("Check solution(with problem.solve) of 3 step problem", function(){
    var testState = getTestState([2]);
    equal(testState.toString(),'RB|RB|BB|YY|OO|OO|RR|WW|GG|GG|WY|WY|');
    var problem = new CubeProblem(testState);
    var result = problem.solve();
    
    deepEqual(result,[2,2,2])
});

test("Check bailout of too many nodes.", function(){
    var testState = getTestState([2,2,1,0,1,0,2,1,0,1,0,2]);
    var problem = new CubeProblem(testState);
    var search = new Search();
    var strategy = new BFStrategy();
    search.maxExpandNodes=1000;
    var result = search.search(problem,strategy);
    equal(result,"too many nodes");
});

