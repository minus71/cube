function Queue(){
    var data =[];
    
    this.push =function(element){
        data.push(element);
    }
    
    this.pop =function(){
        return data.shift();
    }
    
    this.peek =function(){
        return data.peek();
    }
    
    this.isEmpty = function(){
        return data.length === 0;
    }
}

(function() {
  /**
   * @private
   */
  var prioritySortLow = function(a, b) {
    return b.priority - a.priority;
  };

  /**
   * @private
   */
  var prioritySortHigh = function(a, b) {
    return a.priority - b.priority;
  };
    



  /*global PriorityQueue */
  /**
   * @constructor
   * @class PriorityQueue manages a queue of elements with priorities. Default
   * is highest priority first.
   *
   * @param [options] If low is set to true returns lowest first.
   */
  PriorityQueue = function(options) {
    var contents = [];

    var sorted = false;
    var sortStyle;

    if(options && options.low) {
      sortStyle = prioritySortLow;
    } else {
      sortStyle = prioritySortHigh;
    }

    /**
     * @private
     */
    var sort = function() {
      contents.sort(sortStyle);
      sorted = true;
    };

    var self = {
      /**
       * Removes and returns the next element in the queue.
       * @member PriorityQueue
       * @return The next element in the queue. If the queue is empty returns
       * undefined.
       *
       * @see PrioirtyQueue#top
       */
      pop: function() {
        if(!sorted) {
          sort();
        }

        var element = contents.pop();

        if(element) {
          return element.object;
        } else {
          return undefined;
        }
      },

      /**
       * Returns but does not remove the next element in the queue.
       * @member PriorityQueue
       * @return The next element in the queue. If the queue is empty returns
       * undefined.
       *
       * @see PriorityQueue#pop
       */
      top: function() {
        if(!sorted) {
          sort();
        }

        var element = contents[contents.length - 1];

        if(element) {
          return element.object;
        } else {
          return undefined;
        }
      },

      /**
       * @member PriorityQueue
       * @param object The object to check the queue for.
       * @returns true if the object is in the queue, false otherwise.
       */
      includes: function(object) {
        for(var i = contents.length - 1; i >= 0; i--) {
          if(contents[i].object === object) {
            return true;
          }
        }

        return false;
      },

      /**
       * @member PriorityQueue
       * @returns the current number of elements in the queue.
       */
      size: function() {
        return contents.length;
      },

      /**
       * @member PriorityQueue
       * @returns true if the queue is empty, false otherwise.
       */
      empty: function() {
        return contents.length === 0;
      },

      /**
       * @member PriorityQueue
       * @param object The object to be pushed onto the queue.
       * @param priority The priority of the object.
       */
      push: function(object, priority) {
        contents.push({object: object, priority: priority});
        sorted = false;
      }
    };
    self.peek = self.top;
    return self;
    
  };
})();

function Set(){
    var data = {};

    this.add = function(element){
        data[element]=true;
    }
    
    this.contains = function(element){
        return data[element];
    }
    
}


function Search(){
    var expandedNodes = 0;
    this.getExpandedNodes=function(){
        return expandedNodes;  
    };

    this.fireExpandNode=function(node){
        if(this.onExpandNode){
            this.onExpandNode(node);
        }
    }
    
    this.maxExpandNodes=50000;

    this.search= function(problem,strategy){
        var node = {state:problem.getState(),plan:[]};
        var actions = problem.getActions();
        strategy.fringe.push(node);
        var closedSet = new Set();
        while(true){
            if(strategy.fringe.isEmpty()){
                return undefined;
            }
            
            var node = strategy.fringe.pop();
            var state = node.state;
            var plan = node.plan;
            // console.info(planToString(plan));
            if(problem.isGoal(state)){
                return plan;
            }else{
                if(!closedSet.contains(state)){
                    expandedNodes++;
                    if(expandedNodes>this.maxExpandNodes){
                        return ["too many nodes"];
                    }
                    this.fireExpandNode(node)
                    closedSet.add(state);
                    for(var idx in actions){
                        var action = actions[idx];
                        var newState = problem.getSuccessorState(state,action);
                        var newNode = {state:newState,plan:plan.slice(0)};
                        newNode.plan.push(action);
                        strategy.fringe.push(newNode);
                    }
                }
            }
        }
    }
}
function planToString(plan){
    var out="";
    for(var idx in plan){
        out+=','+plan[idx][0];
    }
    out = out.substr(1);
    return out;
}