exports.createLayer = ->
	
	mainLayer = new Layer
		width: Screen.width
		height: Screen.height
		backgroundColor: "#28affa"
	mainLayer.title = "Remove all listeners"
	
	# Create layer
	eventNameLayer = new Layer
		superLayer: mainLayer
		x: 20
		y: 108
		width: mainLayer.width - 40
		height: 180
		backgroundColor: "#fff"
		borderRadius: 8
	
	eventNameLayer.style =
		textAlign: "center",
		fontSize: "40px",
		color: "black",
		fontWeight: "bold",
		lineHeight: "85px"

	eventNameLayer.html = "All listeners will be removed after 10s"

		
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
		
	layerA.html = "Swipe, Pinch, Press, DoubleTap or Rotate"
	
	showEvent = (eventName) ->
		eventNameLayer.html = eventName
		eventNameLayer.animateStop()
		eventNameLayer.opacity = 1
		eventNameLayer.animate
			properties:
				opacity: 0
			curve: "spring(300, 40, 0)"

	eventsToListen = [
		Events.SwipeLeft,
		Events.SwipeRight,
		Events.SwipeUp,
		Events.SwipeDown,
		Events.Pinch,
		Events.Press,
		Events.DoubleTap,
		Events.Rotate
	]

	for ev in eventsToListen
		layerA.on ev, (ev) ->
			showEvent(ev.type)

	# Remove all listeners after 10 seconds
	Utils.delay 10.0, ->
		for ev in eventsToListen
			layerA.removeAllListeners()
		eventNameLayer.animateStop()
		eventNameLayer.html = "All listeners have been removed"
		eventNameLayer.opacity = 1.0
	
	return mainLayer

