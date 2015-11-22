exports.createLayer = ->
	
	mainLayer = new Layer
		width: Screen.width
		height: Screen.height
		backgroundColor: "#28affa"
	mainLayer.title = "Tap"
	
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
		
	layerA.html = "Tap to scale up, double tap down"
		
	layerA.on Events.Tap, (ev) ->
		layerA.animate
			properties:
				scale: 1.0
			curve: "spring(300, 40, 0)"
	
	layerA.on Events.DoubleTap, (ev) ->
		layerA.animate
			properties:
				scale: 0.5
			curve: "spring(300, 40, 0)"
		
	return mainLayer

