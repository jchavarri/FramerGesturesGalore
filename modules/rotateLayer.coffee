exports.createLayer = ->
	
	mainLayer = new Layer
		width: Screen.width
		height: Screen.height
		backgroundColor: "#28affa"
	mainLayer.title = "Rotate"
	
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
		
	layerA.html = "You can rotate this layer"
		
	# With draggable true some events are more difficult to trigger, but they work
	initialRotation = 0
	layerA.on Events.RotateStart, (ev) ->
		initialRotation = layerA.rotation
	layerA.on Events.RotateEnd, (ev) ->
		layerA.animate
			properties:
				rotation: 0;
			curve: "spring(300, 40, 0)"
		layerA.html = "Rotation: 0.0"
	
	layerA.on Events.Rotate, (ev) ->
		layerA.animateStop()
		layerA.rotation = ev.rotation
		layerA.html = "Rotation: " + ev.rotation.toFixed(2)
	
	return mainLayer

