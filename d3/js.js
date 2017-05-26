window.onload = function() {
	const GoldenSeg = 1.618;
	const GoldenCut = 0.382;
	const node_radius = 40;
	var tmp_nodes;
	var tmp_links;
	var bg_opened = 0;
    var margin = parseInt(d3.select("body").style("margin"));
    var currentlevel = 1;

    const client_width = document.body.clientWidth;
    const client_height = document.body.clientHeight;

	var node_original = {
		createNew :function(){
			var a ={
			name : null,
			level: null,
			sub_nodes : [],
			links : [],
			bg_url : null,
			status : {
				spread : 0,
				}
			}
		return a;
		}
	};

	function new_node(n){
		var a = node_original.createNew();
		a.name = n;
		return a;
	}

	function links_to(a,b){
		var obj = {
			source:a,
			target:b
		}
		return obj;
	}

	function add_img(obg,img){
		obg.bg_url = img;
	}

	var TouchMe = new_node('touch me');

	var Google = new_node('Google');
	Google.links = [links_to(TouchMe,Google)];
	var coco = new_node('coco');
	coco.links = [links_to(TouchMe,coco)];
	var kenny = new_node('kenny');
	kenny.links = [links_to(TouchMe,kenny)];
	var chris = new_node('chris');
	chris.links = [links_to(TouchMe,chris)];
	TouchMe.sub_nodes = [Google,coco,kenny,chris];


	var dota = new_node('dota');
	dota.links = [links_to(chris,dota)];
	add_img(dota,'1.jpg');
	var netbar = new_node('netbar');
	netbar.links = [links_to(chris,netbar)];
	add_img(netbar,'2.jpg');
	var picasl = new_node('picasl');
	picasl.links = [links_to(chris,picasl)];
	add_img(picasl,'3.jpg');

	chris.sub_nodes = [dota,netbar,picasl];


	var chrome = new_node('chrome');
	chrome.links = [links_to(Google,chrome)];
	add_img(chrome,'4.jpg');
	var android = new_node('android');
	android.links = [links_to(Google,android)];
	add_img(android,'5.jpg');
	var Gmail = new_node('Gmail');
	Gmail.links = [links_to(Google,Gmail)];
	add_img(Gmail,'6.jpg');

	Google.sub_nodes = [chrome,android,Gmail];


	var PA = new_node('PA');
	PA.links = [links_to(coco,PA)];
	add_img(PA,'7.jpg');

	var AM = new_node('AM');
	AM.links = [links_to(coco,AM)];
	add_img(AM,'8.jpg');

	var LOA = new_node('LOA');
	LOA.links = [links_to(coco,LOA)];
	add_img(LOA,'9.jpg');

	coco.sub_nodes = [PA,AM,LOA];

	var nodes = [TouchMe];
	var links = [];




	var svg = d3.select("svg")
	            .attr("id","menu")
	            .attr("width",client_width)
	            .attr("height",client_height);

	    width = +svg.attr("width"),
	    height = +svg.attr("height"),
	    color = d3.scaleOrdinal(d3.schemeCategory10);



	function spread_out(d){
		for(var tmp in d.sub_nodes){
			nodes.push(d.sub_nodes[tmp]);
			for (let i = d.sub_nodes[tmp].links.length - 1; i >= 0; i--) {
				links.push(d.sub_nodes[tmp].links[i]);
			}
		}
		restart();
		restart();
		d.status.spread = 1;		
	}

	function revoke(d){ //收回
		let del_node = [];
		for(let tmp in d.sub_nodes){
			if( d.sub_nodes[tmp].sub_nodes.length !== 0 && d.sub_nodes[tmp].status.spread === 1 ){
				revoke(d.sub_nodes[tmp]);
			}

			del_node.push(d.sub_nodes[tmp].name);

			for (let i = d.sub_nodes[tmp].links.length - 1; i >= 0; i--) {
				for (let j in links){
					if (links[j].source.name === d.sub_nodes[tmp].links[i].source.name && links[j].target.name === d.sub_nodes[tmp].links[i].target.name ){
						links.splice(j,1);
						continue;
					}
				}
			}					
		}

		for (let a in del_node) {
			for (var i = nodes.length - 1; i >= 0; i--) {
				if(nodes[i].name === del_node[a]){
					nodes.splice(i,1);
					continue;
				}
			}
		}

		restart();
		restart();
		d.status.spread = 0;
	}


	function open_bg(d){
	if ( d.bg_url!==null){
		tmp_nodes = nodes.slice();
		nodes = [d];
		tmp_links = links.slice();
		links = [];

	    var div = d3.select("div")
	                .append("img")
	                .attr("id",d.name)
	                .attr("width",width)
	                .attr("height",height)
	                .style("opacity",0);

		d3.select("#"+d.name)
		  .transition()
		  .duration(2000)
          .style("background-image","url(img/"+ d.bg_url +")")
          .style("background-size","cover")
		  .style("opacity",1);

		simulation.force("x", d3.forceX(width/2.2))
		          .force("y", d3.forceY(height/2.2));
		restart();
		restart();
		bg_opened = 1;

		}
	}


	function close_bg(){
		nodes = tmp_nodes.slice();
		links = tmp_links.slice();
		d3.selectAll("img")
		  .transition()
		  .duration(2000)
		  .style("opacity",0)
		  .remove();
		simulation.force("x", d3.forceX(0))
		            .force("y", d3.forceY(0));
		restart();
		restart();
		bg_opened = 0;
	}



	var simulation = d3.forceSimulation(nodes)
	    .force("charge", d3.forceManyBody().strength(-3000))  //连接强度 排斥力
	    .force("link", d3.forceLink(links).distance(node_radius/GoldenCut*1.5)) //连接距离
	    .force("x", d3.forceX())
	    .force("y", d3.forceY())
	    .alphaTarget(1)
	    .on("tick", ticked);



	var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"),
	    link = g.append("g").attr("stroke", "#999").attr("stroke-width", node_radius*GoldenCut/GoldenSeg).selectAll(".link"),
	    node = g.append("g").attr("stroke", "#fff").attr("stroke-width", node_radius*GoldenCut).selectAll(".node");
	    text = g.append("g").attr("fill", "red").attr("font-size", "20px").selectAll(".text");

	restart();
	restart();

	function restart() {
		// Apply the general update pattern to the nodes.
		node = node.data(nodes, function(d){
		                return d.name;
		               });
		node.exit().remove();
		node = node.enter().append("circle")
	         .attr("fill", function(d) {
	            return color(d.name);})
	         .attr("r", node_radius)
			 .call(d3.drag()
	         .on("start", dragstarted)
	         .on("drag", dragged)
	         .on("end", dragended))
			 .on('mouseout',function(d){
				d3.select(this)
				.transition()
				.duration(500)
				.attr("stroke",'white');
				/* 鼠标悬浮时出现一个气泡 
				if(comment === 1){
					d3.select(".comment").remove();
					comment = 0;
				}
				*/
			})
			.on('mouseover',function(d){
				d3.select(this)
				.transition()
				.duration(500)
				.attr("stroke","#999");
				/* 鼠标悬浮时出现一个气泡 
					if(comment === 0){
					var img = d3.select("svg").append("svg")
					            .attr("class","comment")
					            .attr("width","50px")
					            .attr("x",d3.event.clientX-25+6)
					            .attr("y",d3.event.clientY-height/2-25-margin)
					            .append("use")
					            .attr("xlink:href","#si-evil-comment")
					            .append("text")
					            .text("hello");
					comment = 1;
				}
				*/
			})
			.on('click',function(d){
				if(d.sub_nodes.length !== 0 && d.status.spread === 0){
					// console.log(" name is " + d.name +",index is "+ d.index );
					// console.log(d);
					spread_out(d);
				}
				else if(d.sub_nodes.length !== 0 && d.status.spread === 1){
					// console.log("a");
					// console.log(nodes);
					revoke(d);
				}
				else if( d.sub_nodes.length === 0 && bg_opened === 0){
					open_bg(d);
				}
				else if( d.sub_nodes.length === 0 && bg_opened === 1)
				{
					close_bg();
				}
			})
			.merge(node);


	    // Apply the general update pattern to the links.
	    link = link.data(links, function(d) {
	    	return d.source.id + "-" + d.target.id; 
		});
		link.exit().remove();
		link = link.enter().append("line").merge(link);

		// Apply the general update pattern to the texts.
		text = text.data(nodes,function(d){
			return d.name;
		})
		.attr("dy",".35em")
		.style("fill","white")
		.text(function(d){
			return d.name;
		})
		.style("font-size",function(d){
			return Math.min(2 * node_radius/GoldenSeg ,( 2 * node_radius/GoldenSeg - 8 ) / this.getComputedTextLength() * 24 )+ "px";
		});

		text.exit().remove();	
		text = text.enter().append("text").merge(text);

		// Update and restart the simulation.
		simulation.nodes(nodes);
		simulation.force("link").links(links);
		simulation.alpha(1).restart();
	}

	function ticked() {
	  node.attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });

	  text.attr("x", function(d) { return d.x; })
	      .attr("y", function(d) { return d.y; });

	  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });
	}

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    } 
}