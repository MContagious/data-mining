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
			$scope.update_chart_dates_prog_count ($scope.chartData,
									 			  'chart_dates_prog_count',
									 			  'Datewise Unique Program-ID count');
		}).
		error (function () {
			//debugger;
			$scope.clients = {};
		});

	$scope.update_chart_dates_prog_count = update_chart_dates_prog_count;

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
	$scope.date_wise_call_cnt = [];
	$scope.widgets = {
		'database':{'status':true, 'icon':'icon-arrow-up', 'classTrue':'icon-arrow-up', 'classFalse':'icon-arrow-down'},		
		'graph':{'status':true, 'icon':'icon-arrow-up', 'classTrue':'icon-arrow-up', 'classFalse':'icon-arrow-down'},		
		'depgraph':{'status':true, 'icon':'icon-arrow-up', 'classTrue':'icon-arrow-up', 'classFalse':'icon-arrow-down'},
		'variables':{'status':false, 'icon':'icon-arrow-down','classTrue':'icon-arrow-up', 'classFalse':'icon-arrow-down'}
	};

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

	$http ({method:'JSON', url:'/cgi-bin/RESTfull/api/client/' + 
								$routeParams.clientCode +
								'/reports/graph/program_deps/' + 
								$scope.program + 
								'/date_wise_call_cnt/' + 
								$scope.program}).
		success (function (data){
			$scope.dates = data.dates;
			
			$scope.Gdata = data.program_dep_graph;
			plot_graph ($scope.Gdata, '#graph_progdeps');

			$scope.date_wise_call_cnt = data.date_wise_call_cnt;
			$scope.update_chart_dates_prog_count ($scope.date_wise_call_cnt, 'graph_callcnt');
		}).
		error (function () {
			//debugger;
			$scope.Gdata = {};
			$scope.date_wise_call_cnt = [[]];
		});

	$scope.update_chart_dates_prog_count = update_chart_dates_prog_count;


	$scope.sortByArrayLen = function (db) {
		return db.vars.length*-1;
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
		// debugger;
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
	$http ({method:'JSON', url:'/cgi-bin/RESTfull/api/client/'+$scope.clientCode+'/reports/graph/program_deps/all'}).
		success (function (data){			
			$scope.Gdata = data;
			plot_graph (data, '#graph');
		}).
		error (function () {
			//debugger;
			$scope.Gdata = [];
		});
}

function plot_graph (root, graphTarget)
{
	var tree = d3.layout.tree();
	//debugger;
	var margin = {top: 20, right: 120, bottom: 20, left: 120},
	    width = 1300 - margin.right - margin.left,
	    height = tree.nodes(root).length*20 - margin.top - margin.bottom;
	    
	var i = 0,
	    duration = 750;

	tree = d3.layout.tree()
		    	 .size([height, width]);

	var diagonal = d3.svg.diagonal()
	    			 .projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select('#graph_progdeps').append("svg")
			    .attr("width", width + margin.right + margin.left)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	root.x0 = height / 2;
	root.y0 = 0;

	//root.children.forEach(collapse);
	update(root);
	d3.select(self.frameElement).style("height", (tree.nodes(root).length*20) + "px");
	
	function collapse(d) {
	  if (d.children) {
	    d._children = d.children;
	    d._children.forEach(collapse);
	    d.children = null;
	  }
	}

	function update(source) {

	  // Compute the new tree layout.
	  //debugger;
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
	      .text(function(d) { return d.name; });
//	      .style("fill-opacity", 1e-6);

	  // Transition nodes to their new position.
	  var nodeUpdate = node.transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	  nodeUpdate.select("circle")
	      .attr("r", 4.5)
	      .style("fill", color);

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

	function color(d) {
  		return d._children ? "steelblue" : d.children ? "lightblue" : 
                                              d.name.indexOf("Not found") == -1 ?
                                              	d.name.indexOf("Variable") == -1 ? "lightgreen" : "yellow" :
                                              		"lightcoral";
    }
}

 function update_chart_dates_prog_count (cData, plotTarget, gTitle){
		   	  var s1 = cData;
		   	  //debugger;
			  // $.each(cData, function (prop, val) {
			  // 	s1.push ([prop, val]);
			  // });

			  var plot3 = $.jqplot(plotTarget, [s1], {
			    title: gTitle,
			    seriesDefaults: {
			        pointLabels: { 
			        	show: true,
			         	edgeTolerance: -15,
			         	hideZeros: false			         	
			         }
			    },
			    series:[{renderer:$.jqplot.BarRenderer}],

			    axesDefaults: {
			        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
			        // tickOptions: {
			        //   angle: 60
			        // }
			    },
			    axes: {
			      xaxis: {
			        renderer: $.jqplot.CategoryAxisRenderer,
			        tickOptions: {
			          labelPosition: 'start',
			          angle: 60
			        }
			      },
			      yaxis: {
			        autoscale:true,
			        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
			        tickOptions: {
			          labelPosition: 'middle',
			          angle : 0
			        }
			      }
			    }
			  });
	};