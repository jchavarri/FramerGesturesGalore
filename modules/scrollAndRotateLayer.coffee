exports.createLayer = ->
	
	mainLayer = new Layer
		width: Screen.width
		height: Screen.height
		backgroundColor: "#28affa"
	mainLayer.title = "Scroll+Rotate"
	
	scroll = new ScrollComponent
		superLayer: mainLayer
		backgroundColor: "rgba(255,255,255,0.2)"
		x: 20
		y: 108
		width: mainLayer.width - 40
		height: mainLayer.height - 128
		scrollHorizontal: false
		borderRadius: 8

	# Add spacing
	scroll.contentInset = 
		top: 10
		bottom: 10

	# Create some layers
	for i in [0..10]
		layer = new Layer
			superLayer: scroll.content
			backgroundColor: "#fff"
			borderRadius: 4
			width: scroll.content.width - 20
			height: 160
			x: 10
			y: 170 * i
			
	initialRotation = 0
	
	scroll.on Events.RotateStart, (ev) ->
		initialRotation = scroll.rotation
	
	scroll.on Events.Rotate, (ev) ->
		scroll.animateStop()
		scroll.rotation = ev.rotation
	
	return mainLayer

