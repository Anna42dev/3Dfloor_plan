self = this
self.callback_map ={}
self.states = {}
self.tracked_entities = []
self.tracked_entities.push("light.taklampan")
self.tracked_entities.push("light.bordslampor")

self.done = false

//connect_websocket(this)

canvas = document.getElementById("renderCanvas");
engine = null;
engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })}

createScene = function() {
    scene = new BABYLON.Scene(engine);
    lights = []

    camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 4.5), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 40, 0), scene);
    var light2 = new BABYLON.HemisphericLight("hemiLight2", new BABYLON.Vector3(-20, 1, 0), scene);
    var light3 = new BABYLON.HemisphericLight("hemiLight3", new BABYLON.Vector3(20, 1, 0), scene);

    var wallColor = new BABYLON.Color3(0, 0, 0);
    var wallOpacity = 0.8
    var innerwallOpacity = 0.7
    var floorOpacity = 1
    light.intensity = 0.15
    light2.intensity = 0.3
    light3.intensity = 0.3
    
    var wallmat = new BABYLON.StandardMaterial("wallmaterial", scene);
    wallmat.maxSimultaneousLights = 20;
    wallmat.alpha = 1

    wallmat.diffuseTexture = new BABYLON.Texture("img/panel_dark.jpg", scene);
    wallmat.diffuseTexture.uScale = 1
    wallmat.diffuseTexture.vScale = 4

    
    var innerwallmat = new BABYLON.StandardMaterial("innerwallmaterial", scene);
    innerwallmat.alpha = 1
    innerwallmat.maxSimultaneousLights = 20;
    innerwallmat.diffuseColor = new BABYLON.Color3(240/255, 223/255, 203/255);
    var clickColor = new BABYLON.Color3(1, 0,0);

    //Polygon shape in XoZ plane
    var frontWallDataLF = [ 
                new BABYLON.Vector3(5.5, 0, -3), 
                new BABYLON.Vector3(-5.5, 0, -3), 
                new BABYLON.Vector3(-5.5, 0, 0), 
                new BABYLON.Vector3(5.5, 0, 0) 
                ];

    var frontWallDataUF = [ 
                new BABYLON.Vector3(5.5, 0, 3), 
                new BABYLON.Vector3(-5.5, 0, 3), 
                new BABYLON.Vector3(-5.5, 0, 0), 
                new BABYLON.Vector3(5.5, 0, 0) 
                ];
                
    //Holes in XoZ plane
    var frontWindowHoles = [];
        frontWindowHoles[0] = [ 
                new BABYLON.Vector3(-4.78, 0, -2.3),
                new BABYLON.Vector3(-1.58, 0, -2.3),
                new BABYLON.Vector3(-1.58, 0, -0.3),
                new BABYLON.Vector3(-4.78, 0, -0.3)
                ];
        frontWindowHoles[1] = [ 
                new BABYLON.Vector3(1.58, 0, -2.3),
                new BABYLON.Vector3(4.78, 0, -2.3),
                new BABYLON.Vector3(4.78, 0, -0.3),
                new BABYLON.Vector3(1.58, 0, -0.3)
                ];
        frontWindowHoles[2] = [ 
                new BABYLON.Vector3(-4.03, 0, 0.75),
                new BABYLON.Vector3(-2.13, 0, 0.75),
                new BABYLON.Vector3(-2.13, 0, 2.55),
                new BABYLON.Vector3(-4.03, 0, 2.55)
                ]; 
        frontWindowHoles[3] = [ 
                new BABYLON.Vector3(-0.65, 0, 0.75),
                new BABYLON.Vector3(0.65, 0, 0.75),
                new BABYLON.Vector3(0.65, 0, 2.55),
                new BABYLON.Vector3(-0.65, 0, 2.55)
                ];	   
        frontWindowHoles[4] = [ 
                new BABYLON.Vector3(2.13, 0, 0.75),
                new BABYLON.Vector3(4.03, 0, 0.75),
                new BABYLON.Vector3(4.03, 0, 2.55),
                new BABYLON.Vector3(2.13, 0, 2.55)
                ];  

                frontWindowHoles[5] = [ 
                    new BABYLON.Vector3(-0.50, 0, -0.75),
                    new BABYLON.Vector3(0.50, 0, -0.75),
                    new BABYLON.Vector3(0.50, 0, -3),
                    new BABYLON.Vector3(-0.50, 0, -3)
                    ];  
            
    frontWallLF = BABYLON.MeshBuilder.ExtrudePolygon("wall", {shape:frontWallDataLF, depth: 0.15, holes:frontWindowHoles}, scene);
    frontWallUF = BABYLON.MeshBuilder.ExtrudePolygon("wall", {shape:frontWallDataUF, depth: 0.15, holes:frontWindowHoles}, scene);
    frontWallLF.rotation.x = -Math.PI/2;
    frontWallUF.rotation.x = -Math.PI/2;
    frontWallLF.material = wallmat;
    frontWallUF.material = wallmat;
    frontWallUF.visibility = wallOpacity
    frontWallLF.visibility = wallOpacity
        
    var rearWallnb1Data = [ 
                new BABYLON.Vector3(1.4, 0, -3), 
                new BABYLON.Vector3(5.5, 0, -3), 
                new BABYLON.Vector3(5.5, 0, 3), 
                new BABYLON.Vector3(1.4, 0, 3)
                ];
                
    //Holes in XoZ plane
    var rear1WindowHoles = [];
        rear1WindowHoles[0] = [ 
                new BABYLON.Vector3(3.7, 0, -1.8),
                new BABYLON.Vector3(4.5, 0, -1.8),
                new BABYLON.Vector3(4.5, 0, -0.3),
                new BABYLON.Vector3(3.7, 0, -0.3)
                ];
        rear1WindowHoles[1] = [ 
                new BABYLON.Vector3(1.9, 0, 0.75),
                new BABYLON.Vector3(2.7, 0, 0.75),
                new BABYLON.Vector3(2.7, 0, 2.55),
                new BABYLON.Vector3(1.9, 0, 2.55)
                ];
        rear1WindowHoles[2] = [ 
                new BABYLON.Vector3(4.2, 0, 0.75),
                new BABYLON.Vector3(5, 0, 0.75),
                new BABYLON.Vector3(5, 0, 2.55),
                new BABYLON.Vector3(4.2, 0, 2.55)
                ];

    var rearFaceUV = [];
    rearFaceUV[0] = new BABYLON.Vector4(1,0,0, 1);
    rearFaceUV[1] = new BABYLON.Vector4(1, 0, 0, 1);
    rearFaceUV[2] = new BABYLON.Vector4(1, 0, 0, 1);
                                                
    var rearWallnb1 = BABYLON.MeshBuilder.ExtrudePolygon("rearWallnb1", {shape:rearWallnb1Data, depth: 0.1, holes: rear1WindowHoles, faceUV: rearFaceUV}, scene);
    rearWallnb1.isBlocker = true
    rearWallnb1.rotation.x = -Math.PI/2;
    rearWallnb1.position.z = 6.15;	
    rearWallnb1.visibility = wallOpacity
    rearWallnb1.diffuseColor = wallColor
    rearWallnb1.material = wallmat;
    
    var rearWallnb2Data = [ 
                new BABYLON.Vector3(-5.6, 0, -3), 
                new BABYLON.Vector3(1.45, 0, -3), 
                new BABYLON.Vector3(1.45, 0, 3), 
                new BABYLON.Vector3(-5.6, 0, 3)
                ];
                

    var rear2WindowHoles = [];
        rear2WindowHoles[0] = [ 
                new BABYLON.Vector3(-5, 0, -1.8),
                new BABYLON.Vector3(-1.85, 0, -1.8),
                new BABYLON.Vector3(-1.85, 0, -0.3),
                new BABYLON.Vector3(-5, 0, -0.3)
                ];
        rear2WindowHoles[1] = [ 
                new BABYLON.Vector3(-0.8, 0, -1.8),
                new BABYLON.Vector3(0.9, 0, -1.8),
                new BABYLON.Vector3(0.9, 0, -0.3),
                new BABYLON.Vector3(-0.8, 0, -0.3)
                ];	   
        rear2WindowHoles[2] = [ 
                new BABYLON.Vector3(-5, 0, 0.75),
                new BABYLON.Vector3(-1.85, 0, 0.75),
                new BABYLON.Vector3(-1.85, 0, 2.55),
                new BABYLON.Vector3(-5, 0, 2.55)
                ];
        rear2WindowHoles[3] = [ 
                new BABYLON.Vector3(-0.6, 0, 1.75),
                new BABYLON.Vector3(0.7, 0, 1.75),
                new BABYLON.Vector3(0.7, 0, 2.55),
                new BABYLON.Vector3(-0.6, 0, 2.55)
                ];	   
                                                
    var rearWallnb2 = BABYLON.MeshBuilder.ExtrudePolygon("rearWallnb2", {shape:rearWallnb2Data, holes: rear2WindowHoles, depth: 0.1, faceUV: rearFaceUV}, scene);
    rearWallnb2.rotation.x = -Math.PI/2;
    rearWallnb2.position.z = 9.15;
    rearWallnb2.isBlocker = true
    
    rearWallnb2.material = wallmat;
    rearWallnb2.visibility = wallOpacity
    rearWallnb2.diffuseColor = wallColor
    
    var sideWallnb1Data = [ 
            new BABYLON.Vector3(-3.15, 0, -3), 
            new BABYLON.Vector3(3.15, 0, -3), 
            new BABYLON.Vector3(3.15, 0, 3), 
            new BABYLON.Vector3(-3.15, 0, 3)
        ];
    
    var sideWallnb1 = BABYLON.MeshBuilder.ExtrudePolygon("sideWallnb1", {shape:sideWallnb1Data, depth: 0.1}, scene);
    sideWallnb1.rotation.z = -Math.PI/2;
    sideWallnb1.rotation.x = -Math.PI/2;
    sideWallnb1.position.x = 5.6;
    sideWallnb1.position.z = 3.15;
    
    sideWallnb1.material = wallmat;
    sideWallnb1.visibility = wallOpacity
    sideWallnb1.diffuseColor = wallColor
    sideWallnb1.isBlocker = true
    
    var sideWallnb2Data = [ 
            new BABYLON.Vector3(-3.15, 0, -3), 
            new BABYLON.Vector3(6, 0, -3), 
            new BABYLON.Vector3(6, 0, 3), 
            new BABYLON.Vector3(-3.15, 0, 3)
        ];
                                                
    var sideWallnb2 = BABYLON.MeshBuilder.ExtrudePolygon("sideWallnb2", {shape:sideWallnb2Data, depth: 0.1}, scene);
    sideWallnb2.rotation.z = -Math.PI/2;
    sideWallnb2.rotation.x = -Math.PI/2;
    sideWallnb2.position.x = -5.5;
    sideWallnb2.position.z = 3.15;
    
    sideWallnb2.material = wallmat;
    sideWallnb2.visibility = wallOpacity
    sideWallnb2.diffuseColor = wallColor
    sideWallnb2.isBlocker = true

    var sideWallnb3Data = [ 
            new BABYLON.Vector3(3.1, 0, -3),
            new BABYLON.Vector3(4.5, 0, -3),
            new BABYLON.Vector3(4.5, 0, -0.75),
            new BABYLON.Vector3(5.5, 0, -0.75),
            new BABYLON.Vector3(5.5, 0, -3),
            new BABYLON.Vector3(6, 0, -3), 
            new BABYLON.Vector3(6, 0, 3),  
            new BABYLON.Vector3(3.1, 0, 3)
        ];	
        
    var sideWallnb3 = BABYLON.MeshBuilder.ExtrudePolygon("sideWallnb3", {shape:sideWallnb3Data, depth: 0.1}, scene);
    sideWallnb3.rotation.z = -Math.PI/2;
    sideWallnb3.rotation.x = -Math.PI/2;
    sideWallnb3.position.x = 1.45;
    sideWallnb3.position.z = 3.15;
    
    sideWallnb3.material = wallmat;
    sideWallnb3.visibility = wallOpacity
    sideWallnb3.diffuseColor = wallColor
    sideWallnb3.isBlocker = true
    var roofmat = new BABYLON.StandardMaterial("roofmat", scene);
    //roofmat.diffuseTexture = new BABYLON.Texture("http://i.imgur.com/Vw4fzwq.jpg", scene);


    var stairsDepth = 2;
    var stairsHeight = 3.0;
    var stairsThickness = 0.05;
    var nBStairs = 12;
    var stairs = [];
    var x = 0;
    var z = 0;
    //up
    stairs.push(new BABYLON.Vector3(x, 0, z));
    z += stairsHeight/nBStairs - stairsThickness;
    stairs.push(new BABYLON.Vector3(x, 0, z));
    for(var i = 0; i<nBStairs; i++) {
        x += stairsDepth/nBStairs;
        stairs.push(new BABYLON.Vector3(x, 0, z));
        z += stairsHeight/nBStairs;
        stairs.push(new BABYLON.Vector3(x, 0, z));
    }
    x += stairsDepth/nBStairs - stairsThickness;
    stairs.push(new BABYLON.Vector3(x, 0, z));

    //down
    for(var i = 0; i<=nBStairs; i++) {
        x -= stairsDepth/nBStairs
        stairs.push(new BABYLON.Vector3(x, 0, z));
        z -= stairsHeight/nBStairs;
        stairs.push(new BABYLON.Vector3(x, 0, z));
    }
    
    var faceColors = [];
    faceColors[0] = new BABYLON.Color4(0, 0, 0, 1);
    faceColors[1] = new BABYLON.Color4(190/255, 139/255, 94/255, 1);
    faceColors[2] = new BABYLON.Color4(0, 0, 0, 1);

    var stairsWidth = 1.0;
    var stairCase = BABYLON.MeshBuilder.ExtrudePolygon("stairs", {shape:stairs, depth: stairsWidth, faceColors: faceColors}, scene);
    stairCase.position.x = 1.37;
    stairCase.position.y = -3.0;
    stairCase.position.z = 2.51;
    stairCase.rotation.x = -Math.PI/2;
    stairCase.rotation.y = -Math.PI/2;
    
    var floormat = new BABYLON.StandardMaterial("floormaterial", scene);
    floormat.maxSimultaneousLights = 20
    
    floormat.diffuseTexture = new BABYLON.Texture(
        "img/wood_floor.jpg",
        scene);

        floormat.diffuseTexture.uScale = 10
        floormat.diffuseTexture.vScale = 2
        //floormat.diffuseColor = new BABYLON.Color3(0.5,0.5,0.5)
        
    
    var floorData = [ 
                    new BABYLON.Vector3(-5.5, 0, 0),					
                    new BABYLON.Vector3(5.5,  0, 0),
                    new BABYLON.Vector3(5.5,  0, 6),
                    new BABYLON.Vector3(1.345, 0, 6),
                    new BABYLON.Vector3(1.345, 0, 9),
                    new BABYLON.Vector3(-5.5, 0, 9)
                ];
                
    var stairSpace = [];
    stairSpace[0] = [
                    new BABYLON.Vector3(0.27, 0, 2.5),
                    new BABYLON.Vector3(0.27, 0, 4.5),
                    new BABYLON.Vector3(1.37, 0, 4.5),
                    new BABYLON.Vector3(1.37, 0, 2.5),
                ]
                
    var floorFaceUV = new Array(3);
    
    floorFaceUV[0] = new BABYLON.Vector4(0, 0, 0.5, 1);
    floorFaceUV[2] = new BABYLON.Vector4(0.5, 0, 1, 1);
    
    var floor = BABYLON.MeshBuilder.ExtrudePolygon("floor", {shape:floorData, holes:stairSpace, depth: 0.1, faceUV: floorFaceUV}, scene);
    floor.isBlocker = true
    floor.position.y = 0.21;
    floor.position.z = 0.15;
    
    floor.material = floormat;
    floor.visibility = floorOpacity
    floor.receiveShadows = true;
    
    var groundFloorData = [ 
                    new BABYLON.Vector3(-5.5, 0, 0),					
                    new BABYLON.Vector3(5.5, 0, 0),
                    new BABYLON.Vector3(5.5, 0, 6),
                    new BABYLON.Vector3(1.36, 0, 6),
                    new BABYLON.Vector3(1.36, 0, 9),
                    new BABYLON.Vector3(-5.5, 0, 9)
                ];
                
    var groundFloorFaceUV = new Array(3);
    
    groundFloorFaceUV[0] = new BABYLON.Vector4(0, 0, 0.5, 1);
    groundFloorFaceUV[2] = new BABYLON.Vector4(0.5, 0, 1, 1);
    
    var groundFloor = BABYLON.MeshBuilder.ExtrudePolygon("groundFloor", {shape:groundFloorData, faceUV: groundFloorFaceUV}, scene);
    groundFloor.position.y = -3;
    groundFloor.position.z = 0.15;
    groundFloor.material = floormat;
    groundFloor.visibility = floorOpacity
    groundFloor.receiveShadows = true;
                           
    var doorSpace1 = [];
    doorSpace1[0] = [
                new BABYLON.Vector3(0.1, 0, 1.6),
                new BABYLON.Vector3(0.1, 0, 0.6),
                new BABYLON.Vector3(2, 0, 0.6),
                new BABYLON.Vector3(2, 0, 1.6)
            ];					
    
    var innerWallnb2Data = [
                        new BABYLON.Vector3(-3, 0, 0),
                        new BABYLON.Vector3(3, 0, 0),
                        new BABYLON.Vector3(3, 0, 9),
                        new BABYLON.Vector3(-3, 0, 9),
                        new BABYLON.Vector3(-3, 0, 7.6),
                        new BABYLON.Vector3(-1, 0, 7.6),
                        new BABYLON.Vector3(-1, 0, 6.6),
                        new BABYLON.Vector3(-3, 0, 6.6),
                        new BABYLON.Vector3(-3, 0, 1.6),
                        new BABYLON.Vector3(-1, 0, 1.6),
                        new BABYLON.Vector3(-1, 0, 0.6),
                        new BABYLON.Vector3(-3, 0, 0.6)
                            ];
                            
    var doorSpace2 = [];
    doorSpace2[0] = [
                new BABYLON.Vector3(0.1, 0, 0.6),
                new BABYLON.Vector3(2, 0, 0.6),
                new BABYLON.Vector3(2, 0, 1.6),
                new BABYLON.Vector3(0.1, 0, 1.6)
            ];
    doorSpace2[1] = [
                new BABYLON.Vector3(0.1, 0, 4.6),
                new BABYLON.Vector3(2, 0, 4.6),
                new BABYLON.Vector3(2, 0, 5.6),
                new BABYLON.Vector3(0.1, 0, 5.6)
            ];
            
            

    var innerWallnb2 = BABYLON.MeshBuilder.ExtrudePolygon("innerWallnb2", {shape:innerWallnb2Data, holes: doorSpace2, depth: 0.1}, scene);
    innerWallnb2.rotation.z = Math.PI/2;
    innerWallnb2.position.x = 1.35;
    innerWallnb2.position.z = 0.15;
    innerWallnb2.position.x = -1.4;
    
    innerWallnb2.material = innerwallmat;
    innerWallnb2.visibility =  innerwallOpacity
        
    var bathroomWallData = [
                        new BABYLON.Vector3(-1.4, 0, 0),
                        new BABYLON.Vector3(-0.5, 0, 0),
                        new BABYLON.Vector3(-0.5, 0, 2),
                        new BABYLON.Vector3(0.5, 0, 2),
                        new BABYLON.Vector3(0.5, 0, 0),
                        new BABYLON.Vector3(1.4, 0, 0),
                        new BABYLON.Vector3(1.4, 0, 6),
                        new BABYLON.Vector3(-1.4, 0, 6)
                            ];
                            
    var doorSpace3 = [];
    doorSpace3[0] = [
                new BABYLON.Vector3(-0.5, 0, 3.2),
                new BABYLON.Vector3(-0.5, 0, 5.2),
                new BABYLON.Vector3(0.5, 0, 5.2),
                new BABYLON.Vector3(0.5, 0, 3.2)
    ]					 
    var bathroomWall = BABYLON.MeshBuilder.ExtrudePolygon("bathroomWall", {shape:bathroomWallData, depth: 0.1, holes: doorSpace3}, scene);
    bathroomWall.rotation.x = -Math.PI/2;
    bathroomWall.position.y = -3;
    bathroomWall.position.z = 6;
    
    bathroomWall.material = innerwallmat;
    bathroomWall.visibility =  innerwallOpacity
    
    var bedroom1WallData = [
                        new BABYLON.Vector3(-5.5, 0, 0),
                        new BABYLON.Vector3(-2.9, 0, 0),
                        new BABYLON.Vector3(-2.9, 0, 2),
                        new BABYLON.Vector3(-1.9, 0, 2),
                        new BABYLON.Vector3(-1.9, 0, 0),
                        new BABYLON.Vector3(-1.4, 0, 0),
                        new BABYLON.Vector3(-1.4, 0, 6),
                        new BABYLON.Vector3(-5.5, 0, 6)
                    ];	 
                                                
    var bedroom1Wall = BABYLON.MeshBuilder.ExtrudePolygon("bedroom1Wall", {shape:bedroom1WallData, depth: 0.1}, scene);
    bedroom1Wall.rotation.x = -Math.PI/2;
    bedroom1Wall.position.y = -3;
    bedroom1Wall.position.z = 4.5;
    
    bedroom1Wall.material = innerwallmat;
    bedroom1Wall.visibility =  innerwallOpacity
    
    var bannisterWallData = [
                        new BABYLON.Vector3(0, 0, 0),
                        new BABYLON.Vector3(1, 0, 0),
                        new BABYLON.Vector3(1, 0, 1.4),
                        new BABYLON.Vector3(1.75, 0, 1.4),
                        new BABYLON.Vector3(1.75, 0, 0),
                        new BABYLON.Vector3(3.5, 0, 0),
                        new BABYLON.Vector3(3.5, 0, 3.2),
                        new BABYLON.Vector3(1.5, 0, 3.2),
                        new BABYLON.Vector3(0, 0, 0.75)
                        ];
    var spindleThickness = 0.05;
    var spindles = 12;
    var railGap = (1.5 - spindles * spindleThickness)/(spindles - 1);
    var rail = [];
    var ac = spindleThickness;
    for(var s = 0; s < spindles - 1; s++) {
        rail[s] = [];
        rail[s].push(new BABYLON.Vector3(ac, 0, 0.1 + 1.6 *ac));
        rail[s].push(new BABYLON.Vector3(ac, 0, (0.75 - spindleThickness) + 1.6 *ac));
        rail[s].push(new BABYLON.Vector3(ac + railGap, 0, (0.75 - spindleThickness) + 1.6 *(ac + railGap)));
        rail[s].push(new BABYLON.Vector3(ac + railGap, 0, 1.6 *(ac + railGap)));
        ac += spindleThickness + railGap;
    }
                    
    var bannisterWall = BABYLON.MeshBuilder.ExtrudePolygon("bannisterWall", {shape:bannisterWallData, holes: rail, depth: 0.1}, scene);
    bannisterWall.rotation.x = -Math.PI/2;
    bannisterWall.rotation.z = -Math.PI/2;
    bannisterWall.position.x = 0.4;
    bannisterWall.position.y = -3;
    bannisterWall.position.z = 2.51;
    bannisterWall.visibility = 1//  innerwallOpacity

    var bannister1Data = [
                        new BABYLON.Vector3(0, 0, 0),
                        new BABYLON.Vector3(2, 0, 0),
                        new BABYLON.Vector3(2, 0, 0.75),
                        new BABYLON.Vector3(0, 0, 0.75),
                        ];
    var spindle1Thickness = 0.05;
    var spindles1 = 12;
    var rail1Gap = (2 - spindles1 * spindle1Thickness)/(spindles1 - 1);
    var rail1 = [];
    var ac1 = spindle1Thickness;
    for(var s = 0; s < spindles1 - 1; s++) {
        rail1[s] = [];
        rail1[s].push(new BABYLON.Vector3(ac1, 0, spindle1Thickness));
        rail1[s].push(new BABYLON.Vector3(ac1, 0, 0.75 - spindle1Thickness));
        rail1[s].push(new BABYLON.Vector3(ac1 + rail1Gap, 0, 0.75 - spindle1Thickness));
        rail1[s].push(new BABYLON.Vector3(ac1 + rail1Gap, 0, spindle1Thickness));
        ac1 += spindle1Thickness + rail1Gap;
    }
                    
    var bannister1 = BABYLON.MeshBuilder.ExtrudePolygon("bannister1", {shape:bannister1Data, holes: rail1, depth: 0.1}, scene);
    bannister1.rotation.x = -Math.PI/2;
    bannister1.rotation.z = -Math.PI/2;
    bannister1.position.x = 0.3;
    bannister1.position.y = 0.2;
    bannister1.position.z = 2.61;
    bannister1.visibility =  1  //innerwallOpacity
    
    var bannister2Data = [
                        new BABYLON.Vector3(0, 0, 0),
                        new BABYLON.Vector3(1, 0, 0),
                        new BABYLON.Vector3(1, 0, 0.75),
                        new BABYLON.Vector3(0, 0, 0.75),
                        ];
    var spindle2Thickness = 0.05;
    var spindles2 = 6;
    var rail2Gap = (1- spindles2 * spindle2Thickness)/(spindles2 - 1);
    var rail2 = [];
    var ac2 = spindle2Thickness;
    for(var s = 0; s < spindles2 - 1; s++) {
        rail2[s] = [];
        rail2[s].push(new BABYLON.Vector3(ac2, 0, spindle2Thickness));
        rail2[s].push(new BABYLON.Vector3(ac2, 0, 0.75 - spindle2Thickness));
        rail2[s].push(new BABYLON.Vector3(ac2 + rail2Gap, 0, 0.75 - spindle2Thickness));
        rail2[s].push(new BABYLON.Vector3(ac2 + rail2Gap, 0, spindle2Thickness));
        ac2 += spindle2Thickness + rail2Gap;
    }
                    
    var bannister2 = BABYLON.MeshBuilder.ExtrudePolygon("bannister2", {shape:bannister2Data, holes: rail2, depth: 0.1}, scene);
    bannister2.rotation.x = -Math.PI/2;
    bannister2.position.x = 0.3;
    bannister2.position.y = 0.2;
    bannister2.position.z = 2.61; 
    bannister2.visibility = 1 // innerwallOpacity
    
        var windowFBL = new windowMaker(3.2, 2, 4);
        windowFBL.setPos(-4.78,-2.3,-0.02)

        var windowFBR = new windowMaker(3.2, 2, 4);
        windowFBR.setPos(1.58, -2.3, -0.02)
        
        var windowFTL = new windowMaker(1.9, 1.8, 2);
        windowFTL.setPos(-4.03, 0.75, -0.02)
        
        var windowFTR = new  windowMaker(1.9, 1.8, 2);
        windowFTR.setPos(2.13, 0.75, -0.02)
        
        var windowFTM = new windowMaker(1.3, 1.8, 2);
        windowFTM.setPos(-0.65,0.75,-0.02)
        
        var windowRBL = new windowMaker(3.15, 1.5, 4);
        windowRBL.setPos(-5,-1.8,9.15)
        
        var windowRBR = new windowMaker(1.7, 1.5, 2);
        windowRBR.setPos(-0.8, -1.8,9.15)
        
        var windowRTL = new windowMaker(3.15, 1.8, 4);
        windowRTL.setPos(-5,0.75,9.15)
        
        var windowRTR = new windowMaker(1.3, 0.8, 1);
        windowRTR.setPos(-0.6,1.75,9.15)
        
        var windowR1BL =new  windowMaker(0.8, 1.5, 1);
        windowR1BL.setPos(3.7,-1.8, 6.15)
        
        var windowR1TL = new windowMaker(0.8, 1.8, 1);
        windowR1TL.setPos(1.9,0.75,6.15)
        
        var windowR1TR = new windowMaker(0.8, 1.8, 1);
        windowR1TR.setPos(4.2, 0.75, 6.15)
    

    
    var doormat = new BABYLON.StandardMaterial("door", scene);
    doormat.diffuseColor = new BABYLON.Color3(82/255, 72/255, 72/255);
    
    var frontDoor = doorMaker(1, 2.25, 0.1, 0.05, "front_door");
    frontDoor.position.x = -0.5;
    frontDoor.position.y = -3;
    frontDoor.position.z = 0;
    frontDoor.material = doormat;
    frontDoor.visibility = wallOpacity
    
    var backDoor = doorMaker(1, 2.25, 0.1, 0.05, "back_door");
    backDoor.rotation.y = Math.PI/2;
    backDoor.position.x = 1.3;
    backDoor.position.y = -3;
    backDoor.position.z = 8.65;
    backDoor.material = doormat;
    backDoor.visibility = wallOpacity

    CeilingLamp_1 = new ikeaSpots(self,  3.5,  2.8, 2.8, "lamp1", 0, "spot", "light.taklampan")
    CeilingLamp_2 = new ikeaSpots(self, -3.5,  2.8, 2.2, "lamp2", 0, ""    , "light.taklampan")
    CeilingLamp_3 = new ikeaSpots(self, -3.5,  2.8, 6.5, "lamp3", 0, "spot", "light.taklampan")
    CeilingLamp_4 = new ikeaSpots(self,  3.5, -0.2, 2.8, "lamp4", 0, "spot", "light.taklampan")

    CeilingLamp_4.setColor(255,0,0)
    CeilingLamp_1.setColor( 0,255,0)
    CeilingLamp_3.l.intensity = 5
    CeilingLamp_3.l.range = 3.4


    floorLamp_1 = new floorLamp(4.9, 0.55, 5.6, "fl_1", "light.bordslampor")
    floorLamp_1.setColor(255, 20,255)
    
    floorLamp_2 = new floorLamp(4.9, 0.55, 0.8, "fl_1", "light.bordslampor")
    floorLamp_2.setColor(255, 100,25)

    CeilingLamp_2.setColor(255, 100, 25)
    CeilingLamp_3.setColor(255, 200, 100)

    //s1=sign("22.5°C", 4, 3.5, 4, "#fff")
    //s2=sign("21.2°C", -3, 3.5, 3, "#fff")

    //CeilingLamp_2.l.excludedMeshes.push(s2)
    //CeilingLamp_1.l.excludedMeshes.push(s1)

    t1= new Table("bord_1", 8, 4, 2, 0.4, "dark_wood")
    t1.setScale(0.25)
    t1.setPos(3.7, 0.4, 3)

    t2= new Table("bord_1", 8, 5, 3, 0.3, "light_wood")
    t2.setScale(0.3)
    t2.setPos(3.7, -2.55, 3)

    us_shadow = new Shadow(CeilingLamp_1.l, t1.table_top, floor)
   
    ds_shadow = new Shadow(CeilingLamp_4.l, t2.table_top, groundFloor)
    ds_shadow.addObject(stairCase)
    ds_shadow.addObject(sideWallnb1)

    sofa_1 = new Sofa("table",0.7,0.25,0.15,0.045,"light")
    sofa_1.setScale(2.7)
    sofa_1.setPos(2.5, 0.32, 3)
    sofa_1.rotate(0,Math.PI,0)

    us_shadow.addObject(sofa_1.table_back)
    us_shadow.addObject(sofa_1.table_top)


    sofa_2 = new Sofa("table",0.25,0.25,0.15,0.045,"light")
    sofa_2.setScale(2.7)
    sofa_2.setPos(3.2, 0.32, 4.8)
    sofa_2.rotate(0,-Math.PI/1.3,0)

    sofa_3 = new Sofa("table",0.25,0.25,0.15,0.045,"light")
    sofa_3.setScale(2.7)
    sofa_3.setPos(3.2, 0.32, 1.2)
    sofa_3.rotate(0,Math.PI/1.3,0)

    us_shadow.addObject(sofa_2.table_top)
    us_shadow.addObject(sofa_2.table_back)


    var cupboard = windowMaker2(2.2,1.1, 4, 0.2, 0.1);
    cupboard.position = new BABYLON.Vector3(4.9, 0.2, 4.2)
    cupboard.rotation.z = Math.PI/2

    scene.preventDefaultOnPointerDown = false
    scene.preventDefaultOnPointerUp = false
    
    // Maximize model om screen.
    //camera.zoomOn()
    // Set initial camera angle.
    //camera.alpha = -2.248997764938095
    //camera.beta = 0.6490188319520813
 


    function rend(){
        scene.render();
    }

    scene.onPointerDown = function(evt, pickResult){
        engine.runRenderLoop( rend);
        if(pickResult){
            if(pickResult.pickedMesh){
                console.log("you clicked",pickResult.pickedMesh.id);
                pickResult.pickedMesh.diffuseColor = clickColor
            }
        }
    }

    scene.onPointerUp = async function(){
        engine.stopRenderLoop();
    }
    
    // Stop the automatic PG rendering
    engine.stopRenderLoop();
    // Render the first frame.
    rend(); 

    return scene;

    
}
    var engine;
    var scene;
    initFunction = async function() {               
        var asyncEngineCreation = async function() {
            try {
            return createDefaultEngine();
            } catch(e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
            }
        }

        engine = await asyncEngineCreation();

   };


var scene = createScene();
c= 0

scene.clearColor = new BABYLON.Color3(10/255, 10/255, 10/255);
sceneToRender = scene
var i = 0

eventRender()


window.addEventListener("mouseup", eventRender)
window.addEventListener("touchend", eventRender)
window.addEventListener("mousewheel", eventRender)
canvas.addEventListener("touchmove", blockIt)

if ( typeof TYPE === "undefined") {
    fauxLoad()
}
write("25.4", 4, 3.5, 4 )
write("22.1", -3, 3.5, 3)
function write(text, x, y, z) {
    Writer = new BABYLON.MeshWriter(scene, {scale:1,defaultFont:"Arial"});
    text1  = new Writer( 
                    text,
                    {
                        
                        "letter-height": 0.5,
                        "color": "#cccccc",
                        "position": {"x": x, "y": y, "z": z},
                        "letter-thickness": 0.01
                    }
                )
    text1.getMesh().rotation.x=-Math.PI/1.75
    text1.getMesh().billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL
    console.log(text1)
}

blink()

function blockIt(e){
    e.preventDefault()
}



async function blink(){
    while(true){
        await sleep(1000)
        CeilingLamp_1.turnOff()
        CeilingLamp_1.setColor(Math.random()*255, Math.random()*255, Math.random()*255)
        floorLamp_1.turnOn()
        floorLamp_1.setColor(Math.random()*255, Math.random()*255, Math.random()*255)
        scene.render()
        await sleep(1000)
        CeilingLamp_1.turnOn()
        floorLamp_1.turnOff()
        scene.render()
    }
}




