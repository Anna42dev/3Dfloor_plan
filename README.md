# 3DFP - A 3D Floorplan

I am working on a project to implement an interactive 3D floorplan for Home Assistant. The plan is to be able to, in one dashboard, see a complete overview of my smart home and to easily control basic functionality such as turning on lights and appliances in an intuitive way.

The 3D model is built with babylon js, http://babylonjs.com and the connection to Home Assistant is through a websocket, to receive events and send service calls to monitor and control entities. 

Currently, I can show and control lights and other entities and use color as an indictor if for instance a window or the fridge door is open. There are also signs to display the current temperature or other info for a room.

