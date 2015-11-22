exports.createLayer = ->
	
	mainLayer = new Layer
		width: Screen.width
		height: Screen.height
		backgroundColor: "#28affa"
	mainLayer.title = "Pinch"
	
	# Create layer
	layerA = new Layer
		superLayer: mainLayer
		x: 20
		y: 108
		width: mainLayer.width - 40
		height: mainLayer.height - 128
		backgroundColor: "#fff"
		borderRadius: 8
	
	layerA.style =
		textAlign: "center",
		fontSize: "40px",
		color: "black",
		fontWeight: "bold",
		lineHeight: "#{layerA.height}px"
		
	layerA.html = "Pinch over this layer"
		
	# With draggable true some events are more difficult to trigger, but they work
	initialScale = 1
	layerA.on Events.PinchStart, (ev) ->
		initialScale = layerA.scale
	layerA.on Events.PinchEnd, (ev) ->
		if layerA.scale < 1
			layerA.animate
				properties:
					scale: 1
				curve: "spring(300, 40, 0)"
			layerA.html = "Scale: 1.0"
	
	layerA.on Events.Pinch, (ev) ->
		layerA.animateStop()
		layerA.scale = ev.scale*initialScale
		layerA.html = "Scale: " + ev.scale.toFixed(2)
	
	return mainLayer

