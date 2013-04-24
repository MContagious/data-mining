'use strict';

/* Controllers */

function homeCtrl ($scope, NavMenu, $http) {
	$scope.menuItems = NavMenu.menuItems;
	$scope.clients = [];

	$http ({method:'JSON', url:'/cgi-bin/RESTfull/api/clients/all'}).
		success (function (data){
			$scope.clients = data;
		}).
		error (function () {
			//debugger;
			$scope.clients = [{'code':'Error', 'name':'Ajax failed to retrieve data'}];
		});
}

function dashboardCtrl ($scope, NavMenu, $http, $routeParams) {
	$scope.menuItems = NavMenu.menuItems;
	$scope.client = $routeParams.clientCode;
	$scope.widgets = {'programs':{'status':true, 'icon':'icon-minus-sign', 'classTrue':'icon-minus-sign', 'classFalse':'icon-plus-sign'}};	
	$scope.programNames = [{'name':'loading....'}];
	$scope.programsOrderBy = 'name';
	$http ({method:'JSON', url:'/cgi-bin/RESTfull/api/client/' + 
								$routeParams.clientCode +
								'/programNames/withdates'}).
		success (function (data){
			$scope.programNames = data.programs;
			$scope.dates = data.dates;
			$scope.chartData = data.charting;
			$scope.update_chart_dates_prog_cout ($scope.chartData, 'chart_dates_prog_count');
		}).
		error (function () {
			//debugger;
			$scope.clients = {};
		});

	$scope.update_chart_dates_prog_cout = function (cData, plotTarget){
		   	  var s1 = [];
		   	  debugger;
			  $.each(cData, function (prop, val) {
			  	s1.push ([prop, val]);
			  });

			  var plot3 = $.jqplot(plotTarget, [s1], {
			    title: 'Datewise Unique Program-ID count',
			    series:[{renderer:$.jqplot.BarRenderer}],
			    axesDefaults: {
			        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
			        tickOptions: {
			          angle: -60
			        }
			    },
			    axes: {
			      xaxis: {
			        renderer: $.jqplot.CategoryAxisRenderer,
			        tickOptions: {
			          labelPosition: 'middle'
			        }
			      },
			      yaxis: {
			        autoscale:true,
			        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
			        tickOptions: {
			          labelPosition: 'start'
			        }
			      }
			    }
			  });
	};

	$scope.toggle = function (e){
		e.status = !(e.status);
		if (e.status)
		{
			e.icon = e.classTrue;
		}
		else
		{
			e.icon = e.classFalse;
		}
	};

	$scope.dateFilter = function (item)
	{
		//debugger;

		if ($scope.byDateFilter === undefined || $scope.byDateFilter.length == 0)
		{
			return true;
		}	

		for (var i in $scope.byDateFilter){			
			
			for (var j in item.dates)
			{
				if (item.dates[j] == $scope.byDateFilter[i])
				{
					return true;
				}
			}
		}

		return false;
	};
}

function repsCtrl ($scope, NavMenu) {
	$scope.menuItems = NavMenu.menuItems;
}

function menuCtrl ($scope, NavMenu) {
	$scope.menuItems = NavMenu.menuItems;

	$scope.setMenuItemActive = function ($event, name)
	{
		NavMenu.menuItems.forEach (function (element, index, array){			
			if (element.name == name)
			{
				element.state = 'active';
			}
			else
			{
				element.state = '';
			}
		});
	}
}

function programCtrl ($scope, NavMenu, $http, $routeParams)
{
	$scope.menuItems = NavMenu.menuItems;
	$scope.client 	 = $routeParams.clientCode;
	$scope.program 	 = $routeParams.programCode;
	$scope.programDbData = [];

	$http ({method:'JSON', url:'/cgi-bin/RESTfull/api/database/all/client/' + 
								$routeParams.clientCode +
								'/program/' +
								$scope.program}).
		success (function (data){			
			$scope.programDbData = data;
		}).
		error (function () {
			//debugger;
			$scope.programDbData = [];
		});

	$scope.sortByArrayLen = function (db) {
		return db.vars.length*-1;
	};
}

function databasesCtrl ($scope, NavMenu, $http, $routeParams)
{
	$scope.menuItems = NavMenu.menuItems;
	$scope.clientCode 	 = $routeParams.clientCode;
	$scope.programCode 	 = $routeParams.programCode;
	$scope.dbCode 		 = $routeParams.dbCode;
	$scope.DbData 	 = [{status:'loading.... Please waite'}];

	$http ({method:'JSON', url:'/cgi-bin/RESTfull/api/database/all/client/' + 
								$routeParams.clientCode +
								'/db/' + $scope.dbCode}).
		success (function (data){			
			$scope.DbData = data;
		}).
		error (function () {
			//debugger;
			$scope.DbData = [];
		});

	$scope.sortByArrayLen = function (db) {
		return db.vars.length*-1;
	};

	$scope.showHide = function (db) {
		debugger;
		if (typeof db.show === 'undefined')
		{
			db.show = true;
		}
		else
		{
			db.show = !db.show;
		}

		if (typeof db.varsS === 'undefined')
		{
			db.varsS = db.vars;
		}
		else
		{
			delete db.varsS;
		}
	};
}

function graphCtrl ($scope, NavMenu, $http, $routeParams)
{
	$scope.menuItems  = NavMenu.menuItems;
	$scope.clientCode = $routeParams.clientCode;
	$scope.Gdata = [];
	var root;
	$http ({method:'JSON', url:'/cgi-bin/RESTfull/api/client/dot/reports/graph/program_deps/all'}).
		success (function (data){			
			$scope.Gdata = data;
			root = data;
			update(root);			
		}).
		error (function () {
			//debugger;
			$scope.Gdata = [];
		});

	var margin = {top: 20, right: 120, bottom: 20, left: 120},
	    width = 1100 - margin.right - margin.left,
	    height = 1250*20 - margin.top - margin.bottom;
	    
	var i = 0,
	    duration = 750;

	var tree = d3.layout.tree()
		    	 .size([height, width]);

	var diagonal = d3.svg.diagonal()
	    			 .projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select("#graph").append("svg")
			    .attr("width", width + margin.right + margin.left)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	root = $scope.Gdata;
	root.x0 = height / 2;
	root.y0 = 0;

	//root.children.forEach(collapse);
	//update(root);
	d3.select(self.frameElement).style("height", "4400px");
	
	function collapse(d) {
	  if (d.children) {
	    d._children = d.children;
	    d._children.forEach(collapse);
	    d.children = null;
	  }
	}

	function update(source) {

	  // Compute the new tree layout.
	  var nodes = tree.nodes(root).reverse(),
	      links = tree.links(nodes);

	  // Normalize for fixed-depth.
	  nodes.forEach(function(d) { d.y = d.depth * 180; });

	  // Update the nodes…
	  var node = svg.selectAll("g.node")
	      .data(nodes, function(d) { return d.id || (d.id = ++i); });

	  // Enter any new nodes at the parent's previous position.
	  var nodeEnter = node.enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	      .on("click", click);

	  nodeEnter.append("circle")
	      .attr("r", 1e-6)
	      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	  nodeEnter.append("text")
	      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
	      .attr("dy", ".35em")
	      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	      .text(function(d) { return d.name; })
	      .style("fill-opacity", 1e-6);

	  // Transition nodes to their new position.
	  var nodeUpdate = node.transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	  nodeUpdate.select("circle")
	      .attr("r", 4.5)
	      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	  nodeUpdate.select("text")
	      .style("fill-opacity", 1);

	  // Transition exiting nodes to the parent's new position.
	  var nodeExit = node.exit().transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	      .remove();

	  nodeExit.select("circle")
	      .attr("r", 1e-6);

	  nodeExit.select("text")
	      .style("fill-opacity", 1e-6);

	  // Update the links…
	  var link = svg.selectAll("path.link")
	      .data(links, function(d) { return d.target.id; });

	  // Enter any new links at the parent's previous position.
	  link.enter().insert("path", "g")
	      .attr("class", "link")
	      .attr("d", function(d) {
	        var o = {x: source.x0, y: source.y0};
	        return diagonal({source: o, target: o});
	      });

	  // Transition links to their new position.
	  link.transition()
	      .duration(duration)
	      .attr("d", diagonal);

	  // Transition exiting nodes to the parent's new position.
	  link.exit().transition()
	      .duration(duration)
	      .attr("d", function(d) {
	        var o = {x: source.x, y: source.y};
	        return diagonal({source: o, target: o});
	      })
	      .remove();

	  // Stash the old positions for transition.
	  nodes.forEach(function(d) {
	    d.x0 = d.x;
	    d.y0 = d.y;
	  });
	}

	// Toggle children on click.
	function click(d) {
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	  update(d);
	}
}