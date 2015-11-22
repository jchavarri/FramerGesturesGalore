exports.createLayer = ->
	
	mainLayer = new Layer
		width: Screen.width
		height: Screen.height
		backgroundColor: "#28affa"
	mainLayer.title = "Pan"
	
	# Create layer
	panDirection = new Layer
		superLayer: mainLayer
		x: 20
		y: 108
		width: mainLayer.width - 40
		height: 180
		backgroundColor: "#fff"
		borderRadius: 8
	
	panDirection.style =
		textAlign: "center",
		fontSize: "40px",
		color: "black",
		fontWeight: "bold",
		lineHeight: "85px"
		
	# Create layer
	layerA = new Layer
		superLayer: mainLayer
		x: 20
		y: 308
		width: mainLayer.width - 40
		height: mainLayer.height - 328
		backgroundColor: "#fff"
		borderRadius: 8
	
	layerA.style =
		textAlign: "center",
		fontSize: "40px",
		color: "black",
		fontWeight: "bold",
		lineHeight: "#{layerA.height}px"
		
	layerA.html = "Pan in any direction"
	
	getParams = (ev) ->
		return ", Dist:" + ev.distance.toFixed(2) + "px, Vel:" + ev.velocity.toFixed(2) + "px/sec<br/>Time:" + ev.deltaTime.toFixed(2) + "sec"

	layerA.on Events.PanLeft, (ev) ->
		panDirection.html = "Left" + getParams(ev)
	
	layerA.on Events.PanRight, (ev) ->
		panDirection.html = "Right" + getParams(ev)
	
	layerA.on Events.PanUp, (ev) ->
		panDirection.html = "Up" + getParams(ev)
	
	layerA.on Events.PanDown, (ev) ->
		panDirection.html = "Down" + getParams(ev)
	
	return mainLayer

