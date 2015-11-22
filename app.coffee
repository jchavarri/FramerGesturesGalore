PinchLayer = require "pinchLayer"
RotateLayer = require "rotateLayer"
PinchAndRotateLayer = require "pinchAndRotateLayer"
PressLayer = require "pressLayer"
TapLayer = require "tapLayer"
PanLayer = require "panLayer"
SwipeLayer = require "swipeLayer"
DraggableAndDoubleTapLayer = require "draggableAndDoubleTapLayer"
ScrollAndRotateLayer = require "scrollAndRotateLayer"
RemoveAllListenersLayer = require "removeAllListenersLayer"
NavigationComponent = (require "navigationComponent").NavigationComponent

# Set background
bg = new BackgroundLayer backgroundColor: "#28affa"

################
#	ROOT VIEW  #
################

rootLayer = new Layer
	width: Screen.width
	height: Screen.height
	backgroundColor: "#28affa"
rootLayer.title = "Framer gestures"

# Create ScrollComponent
menuScroll = new ScrollComponent
	superLayer: rootLayer
	y: 160
	width: Screen.width - 100
	height: Screen.height - 260
	scrollHorizontal: false
	backgroundColor: "rgba(255,255,255,0.2)"
	contentInset:
		top: 10
		bottom: 10
	borderRadius: 8

# Center ScrollComponent
menuScroll.center()

# Menu items
menuItems = [
	{
		title: "Pinch",
		layerGenerator: PinchLayer.createLayer
	},
	{
		title: "Rotate",
		layerGenerator: RotateLayer.createLayer
	},
	{
		title: "Pinch+Rotate",
		layerGenerator: PinchAndRotateLayer.createLayer
	},
	{
		title: "Long press",
		layerGenerator: PressLayer.createLayer
	},
	{
		title: "Tap",
		layerGenerator: TapLayer.createLayer
	},
	{
		title: "Pan",
		layerGenerator: PanLayer.createLayer
	},
	{
		title: "Swipe",
		layerGenerator: SwipeLayer.createLayer
	},
	{
		title: "Mashup:Draggable+DoubleTap",
		layerGenerator: DraggableAndDoubleTapLayer.createLayer
	},
	{
		title: "Mashup:Scroll+Rotate",
		layerGenerator: ScrollAndRotateLayer.createLayer
	},
	{
		title: "Remove all listeners",
		layerGenerator: RemoveAllListenersLayer.createLayer
	}
]

# Create layers for each menu item
for i in [0..menuItems.length - 1]
	menuItemLayer = new Layer
		width: menuScroll.width - 20, height: 180
		x: 10, y: 200 * i 
		backgroundColor: "#fff"
		superLayer: menuScroll.content
		borderRadius: 4
		html: menuItems[i].title
	menuItemLayer.style =
	    textAlign: "center",
	    fontWeight: "bold",
	    fontSize: "40px",
	    color: "black",
	    lineHeight: "#{menuItemLayer.height}px"
	do (i) ->
		menuItemLayer.on Events.Click, ->
			if not menuScroll.isDragging and menuItems[i].layerGenerator?
				secondLayer = menuItems[i].layerGenerator()
				navigationComponent.push(secondLayer)

navigationComponent = new NavigationComponent
    rootLayer: rootLayer