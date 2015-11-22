exports.createLayer = ->
	
	mainLayer = new Layer
		width: Screen.width
		height: Screen.height
		backgroundColor: "#28affa"
	mainLayer.title = "Draggable+DoubleTap"
	
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
		lineHeight: "100px",
		paddingTop: "300px"
		
	layerA.html = "Drag the layer, or double tap<br/>to scale up and down"
	
	layerA.draggable.enabled = true

	layerA.on Events.DoubleTap, (ev) ->
		layerA.animate
			properties:
				scale: if layerA.scale == 0.5 then 1.0 else 0.5
			curve: "ease"
			time: 0.5
		
	return mainLayer

