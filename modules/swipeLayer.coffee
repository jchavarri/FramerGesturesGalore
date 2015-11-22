exports.createLayer = ->
	
	mainLayer = new Layer
		width: Screen.width
		height: Screen.height
		backgroundColor: "#28affa"
	mainLayer.title = "Swipe"
	
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
		
	layerA.html = "Swipe in any direction"
	mainLayer.perspective = 1250
	layerA.force2d = false

	animateBack = ->
		layerA.animate
			properties:
				rotationX: 0
				rotationY: 0
			curve: "spring(300, 40, 0)"
	
	animateLayer = (layer, properties) ->
		animationA = new Animation
			layer: layer
			properties: properties
			curve: "spring(300, 40, 0)"
		animationA.on(Events.AnimationEnd, animateBack)
		animationA.start()

	layerA.on Events.SwipeLeft, (ev) ->
		animateLayer layerA, {rotationY: -60}
	
	layerA.on Events.SwipeRight, (ev) ->
		animateLayer layerA, {rotationY: 60}
	
	layerA.on Events.SwipeUp, (ev) ->
		animateLayer layerA, {rotationX: 60}
	
	layerA.on Events.SwipeDown, (ev) ->
		animateLayer layerA, {rotationX: -60}

	return mainLayer

