exports.createLayer = ->
	
	mainLayer = new Layer
		width: Screen.width
		height: Screen.height
		backgroundColor: "#28affa"
	mainLayer.title = "Pinch+Rotate"
	
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
		
	layerA.html = "Pinch and rotate this layer"

	pinchRotateEnd = (ev) ->
		scale = ev.scale
		if layerA.scale < 1
			layerA.animate
				properties:
					scale: 1
				curve: "spring(300, 40, 0)"
			scale = 1
		layerA.animate
			properties:
				rotation: 0;
			curve: "spring(300, 40, 0)"
		layerA.html = "Scale: " + scale.toFixed(2) + ", Rot: 0.0"

		
	initialScale = 1
	initialRotation = 0
	
	layerA.on Events.PinchStart, (ev) ->
		initialScale = layerA.scale
	
	layerA.on Events.RotateStart, (ev) ->
		initialRotation = layerA.rotation

	layerA.on Events.Pinch, (ev) ->
		layerA.animateStop()
		layerA.scale = ev.scale*initialScale
		layerA.html = "Scale: " + ev.scale.toFixed(2) + ", Rot: " + layerA.rotation.toFixed(2)
	
	layerA.on Events.Rotate, (ev) ->
		layerA.animateStop()
		layerA.rotation = ev.rotation
		layerA.html = "Scale: " + layerA.scale.toFixed(2) + ", Rot: " + ev.rotation.toFixed(2)
	
	layerA.on Events.PinchEnd, (ev) ->
		pinchRotateEnd(ev)
	
	layerA.on Events.RotateEnd, (ev) ->
		pinchRotateEnd(ev)
	
	
	return mainLayer

