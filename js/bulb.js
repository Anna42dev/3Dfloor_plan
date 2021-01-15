    
function bulb(x,y,z, name){
    var sphere = BABYLON.Mesh.CreateSphere(name, 16, 0.22, scene)
    sphere.position = new BABYLON.Vector3(x, y, z)
    var materialSphere = new BABYLON.StandardMaterial(name + "_1", scene)
    materialSphere.emissiveColor = new BABYLON.Color3(1, 0.8, 0)
    sphere.material = materialSphere
    return sphere
}

class ikeaSpots{
    constructor(self, x, y, z, name, y_offset=0, type = "point", entity){
        this.name = name
        this.entity = entity

        registerCallback(self, this, this.entity)

        if (type == "point"){
            this.l = new BABYLON.PointLight("pointLight_" + name, new BABYLON.Vector3(x, y, z), scene)
        } else {
            this.l = new BABYLON.SpotLight("spotLight_" + name, new BABYLON.Vector3(x,y,z), new BABYLON.Vector3(0, -10, 0), Math.PI-0.2 , 1, scene)
        }

        this.l.shadowEnabled = true
    
        this.l.range     = 4
        this.l.position  = new BABYLON.Vector3(x, y-y_offset, z)
        this.l.diffuse   = new BABYLON.Color3(1, 0.8, 0.5)
        this.l.specular  = new BABYLON.Color3(1, 0.8, 0.5)
        this.l.intensity = 4

        this.bulbs = []
        this.bulbs.push( bulb(x,     y,  z,      name + "_1"))
        this.bulbs.push( bulb(x+0.5, y,  z ,     name + "_2"))
        this.bulbs.push(bulb(x+0.5,  y,  z +0.5, name + "_3"))
        this.bulbs.push(bulb(x,      y,  z+0.5,  name + "_4"))
    }

    SetState(state){
        if(state.state == "off"){
            this.turnOff()
            i = 40
            scene.render()
        } else {
           
            if ("rgb_color" in state.attributes){
                this.setColor(state.attributes.rgb_color[0], state.attributes.rgb_color[1], state.attributes.rgb_color[2])
            }
            if("brightness" in state.attributes){
                this.l.intensity = 2*(state.attributes.brightness/255/2 +127/255)
                
                for (var item of this.bulbs){
                    item.visibility = state.attributes.brightness/120 +135/255
                }
            }
            i = 40
            this.turnOn()
            scene.render()
        }
    }
  
     setColor(r, g, b){
        var color = new BABYLON.Color3(r/255, g/255, b/255)
        for (var item of this.bulbs){
            item.material.emissiveColor = color
            item.subMeshes[0]._mesh.subMeshes[0]._mesh._material.emissiveColor = color
            item.subMeshes[0]._mesh.subMeshes[0]._mesh._material.diffuseColor = color
            item.subMeshes[0]._mesh.subMeshes[0]._mesh._material.specularColor = color
        }
        this.l.diffuse  = color
        this.l.specular = color
    }
    turnOn(){
        this.l.setEnabled(true)
    }

    turnOff(){
        for (var item of this.bulbs){
            item.visibility = 55
            this.setColor(60,60,60)
        }
        this.l.setEnabled(false)
    }
}

class floorLamp{
    constructor(x, y, z, name, entity){
        this.entity = entity
        this.cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {"height": 0.8, "diameter": 0.35})
        this.materialCylinder = new BABYLON.StandardMaterial(name + "_1", scene)
        this.materialCylinder.emissiveColor = new BABYLON.Color3(0.8, 0.6, 0.3)
        this.offColor = new BABYLON.Color3(0.3, 0.3, 0.3)
        this.cylinder.material = this.materialCylinder
        this.cylinder.position = new BABYLON.Vector3(x, y, z)
        
        registerCallback(self, this, this.entity)
        
        this.l = new BABYLON.PointLight("pointLight_" + name, new BABYLON.Vector3(x, y, z), scene)

        this.l.range     = 1
        this.l.position  = new BABYLON.Vector3(x, y+0.4, z)
        this.l.diffuse   = new BABYLON.Color3(1, 0.8, 0.5)
        this.l.specular  = new BABYLON.Color3(1, 0.8, 0.5)
        this.l.intensity = 3
    }

    SetState(state){
        if(state.state == "off")
        {
            this.turnOff()
            i=40
            scene.render()
        } 
        else 
        {
            if ("rgb_color" in state.attributes)
            {
                this.setColor(state.attributes.rgb_color[0], state.attributes.rgb_color[1], state.attributes.rgb_color[2])
            }
            if("brightness" in state.attributes)
            {
                this.l.intensity = 1*state.attributes.brightness/120 +135/255
            }

            i=40
            this.turnOn()
            scene.render()
        }
    }

    setColor(r, g, b){
        this.color = new BABYLON.Color3(r/255, g/255, b/255)
        this.r = r
        this.g = g
        this.b = b

        this.l.diffuse  = this.color
        this.l.specular = this.color

        this.materialCylinder.emissiveColor = this.color
        this.materialCylinder.diffuseColor  = this.color
    }

    turnOn(){
        this.l.setEnabled(true)

        this.materialCylinder.emissiveColor = this.color
        this.materialCylinder.diffuseColor  = this.color
    }

    turnOff(){
        this.l.setEnabled(false)

        this.materialCylinder.emissiveColor = this.offColor
        this.materialCylinder.diffuseColor  = this.offColor
    }
} 

class Table{
    constructor(name, size, depth, height, thickness, style){

        var table_mat = new BABYLON.StandardMaterial("floormaterial", scene)
        table_mat.maxSimultaneousLights = 2
    
        var texture = {"light_wood":"img/table_top_2.jpg",
                     "dark_wood": "img/table_top_1.jfif"}
    
        table_mat.diffuseTexture = new BABYLON.Texture(texture[style], scene)
        table_mat.diffuseTexture.uScale = 1
        table_mat.diffuseTexture.vScale = 1
        table_mat.maxSimultaneousLights = 20
        

        this.parentObj = BABYLON.MeshBuilder.CreateBox('parent_'+ name,{ size:2 },scene)
        this.parentObj.visibility = 0

        this.table_top = BABYLON.MeshBuilder.CreateBox('table_top_' + name, {"width": depth, "height": thickness, "depth": size})
        this.table_top.position = new BABYLON.Vector3(0,(thickness+height)/2,0)
        this.table_top.parent = this.parentObj
        this.table_top.material = table_mat

        var table_leg_left = BABYLON.MeshBuilder.CreateBox('table_leg_left', {"width": depth * 0.6, "height": height, "depth": size/16})
        table_leg_left.parent = this.parentObj
        table_leg_left.position = new BABYLON.Vector3(0, 0,-0.35*size)
        
        var table_leg_right = BABYLON.MeshBuilder.CreateBox('table_leg_right', {"width": depth * 0.6, "height": height, "depth": size/16})
        table_leg_right.parent = this.parentObj
        table_leg_right.position = new BABYLON.Vector3(0, 0,0.35*size)

        
    }

    setPos(x,y,z){
        this.parentObj.position =  new BABYLON.Vector3(x,y,z)
    }

    setScale(scale){
        this.parentObj.scaling= new BABYLON.Vector3(scale, scale, scale)
    }
}

class Table_4_legs{
    constructor(name, size, depth, height, thickness, style){


        this.parentObj = BABYLON.MeshBuilder.CreateBox('parent_'+ name,{ size:2 },scene)
        this.parentObj.visibility = 0

        this.table_top = BABYLON.MeshBuilder.CreateBox('table_top_' + name, {"width": depth, "height": thickness, "depth": size})
        this.table_top.position = new BABYLON.Vector3(0,(thickness+height)/2,0)
        this.table_top.parent = this.parentObj

        var table_leg_left = BABYLON.MeshBuilder.CreateBox('table_leg_left', {"width": size /16, "height": height, "depth": size/16})
        table_leg_left.parent = this.parentObj
        table_leg_left.position = new BABYLON.Vector3(-0.10, 0, -0.35)
        
        var table_leg_right = BABYLON.MeshBuilder.CreateBox('table_leg_right', {"width": size /16, "height": height, "depth": size/16})
        table_leg_right.parent = this.parentObj
        table_leg_right.position = new BABYLON.Vector3(-0.10, 0, 0.35)


        var table_leg_right_1 = BABYLON.MeshBuilder.CreateBox('table_leg_right_1', {"width": size /16, "height": height, "depth": size/16})
        table_leg_right_1.parent = this.parentObj
        table_leg_right_1.position = new BABYLON.Vector3(0.10, 0, 0.35)

        var table_leg_left_1 = BABYLON.MeshBuilder.CreateBox('table_leg_right_1', {"width": size /16, "height": height, "depth": size/16})
        table_leg_left_1.parent = this.parentObj
        table_leg_left_1.position = new BABYLON.Vector3(0.10, 0, -0.35)
        
    }

    setPos(x,y,z){
        this.parentObj.position =  new BABYLON.Vector3(x,y,z)
    }

    setScale(scale){
        this.parentObj.scaling= new BABYLON.Vector3(scale, scale, scale)
    }
}

class Shadow{
    constructor(light, object, plane){
        this.plane = plane
        this.shadowGenerator = new BABYLON.ShadowGenerator(1024, light)
        this.shadowGenerator.useBlurExponentialShadowMap = true
        this.shadowGenerator.usePercentageCloserFiltering = true
        this.shadowGenerator.usePoissonSampling = true
        this.shadowGenerator.getShadowMap().renderList.push(object)
        this.plane.receiveShadows = true
    }

    addObject(object){
        this.shadowGenerator.getShadowMap().renderList.push(object)
    }

    addPlane(object){
        object.receiveShadows = true
    }
}

class Sofa{
    constructor(name, size, depth, height, thickness, style="light"){
        var sofa_mat = new BABYLON.StandardMaterial("floormaterial", scene)
        sofa_mat.maxSimultaneousLights = 2
    
        var texture = {"light": "img/sofa_fabric.jpg",
                       "dark":  "img/table_top_1.jfif"
                      }
    
        sofa_mat.diffuseTexture = new BABYLON.Texture(texture[style], scene)

        sofa_mat.diffuseTexture.uScale = 2
        sofa_mat.diffuseTexture.vScale = 1
        sofa_mat.maxSimultaneousLights = 20
                
        this.parentObj = BABYLON.MeshBuilder.CreateBox('parent_'+ name,{ size:2 },scene)
        this.parentObj.visibility = 0

        this.sofa_top = BABYLON.MeshBuilder.CreateBox('sofa_top_' + name, {"width": depth, "height": thickness, "depth": size})
        this.sofa_top.position = new BABYLON.Vector3(0,(thickness+height)/2,0)
        this.sofa_top.parent = this.parentObj
        this.sofa_top.material = sofa_mat

        this.sofa_back = BABYLON.MeshBuilder.CreateBox('sofa_back_' + name, {"width": thickness, "height": depth*2/3, "depth": size})
        this.sofa_back.position = new BABYLON.Vector3(depth/2-thickness/2,height+thickness*0.8,0)
        this.sofa_back.parent = this.parentObj

        this.sofa_back.material = sofa_mat
        this.sofa_back.rotation = new BABYLON.Vector3(0,0,-Math.PI/10)

        var sofa_leg_left = BABYLON.MeshBuilder.CreateBox('sofa_leg_left', {"width": thickness, "height": height, "depth": thickness})
        sofa_leg_left.parent = this.parentObj
        sofa_leg_left.position = new BABYLON.Vector3(-depth/2+thickness, 0, -size/2+thickness)
        
        var sofa_leg_right = BABYLON.MeshBuilder.CreateBox('sofa_leg_right', {"width": thickness, "height": height, "depth": thickness})
        sofa_leg_right.parent = this.parentObj
        sofa_leg_right.position = new BABYLON.Vector3(-depth/2+thickness, 0,size/2-thickness)


        var sofa_leg_right_1 = BABYLON.MeshBuilder.CreateBox('sofa_leg_right_1', {"width":thickness, "height": height, "depth": thickness})
        sofa_leg_right_1.parent = this.parentObj
        sofa_leg_right_1.position = new BABYLON.Vector3(depth/2-thickness, 0,size/2-thickness)

        var sofa_leg_left_1 = BABYLON.MeshBuilder.CreateBox('sofa_leg_right_1', {"width": thickness, "height": height, "depth": thickness})
        sofa_leg_left_1.parent = this.parentObj
        sofa_leg_left_1.position = new BABYLON.Vector3(depth/2-thickness, 0, -size/2+thickness)
        
    }

    setPos(x,y,z){
        this.parentObj.position =  new BABYLON.Vector3(x,y,z)
    }

    setScale(scale){
        this.parentObj.scaling= new BABYLON.Vector3(scale, scale, scale)
    }

    rotate(x,y,z){
        this.parentObj.rotation = new BABYLON.Vector3(x, y, z)
    }
}

function sign(text, x,y,z, color){
    //Set font type
    var font_type = "Arial"
	
	//Set width an height for plane
    var planeWidth = 1.4
    var planeHeight = 1

    //Create plane
    var plane = BABYLON.MeshBuilder.CreatePlane("plane", {width:planeWidth, height:planeHeight}, scene)

    //Set width and height for dynamic texture using same multiplier
    var DTWidth = planeWidth * 60
    var DTHeight = planeHeight * 60
    
    //Create dynamic texture
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width:DTWidth, height:DTHeight}, scene)
    dynamicTexture.update(false)

    //Check width of text for given font type at any size of font
    var ctx = dynamicTexture.getContext()
	var size = 12 //any value will work
    ctx.font = size + "px " + font_type
    var textWidth = ctx.measureText(text).width
    
    //Calculate ratio of text width to size of font used
    var ratio = textWidth/size
	
	//set font to be actually used to write text on dynamic texture
    var font_size = Math.floor(DTWidth / (ratio * 1)) //size of multiplier (1) can be adjusted, increase for smaller text
    var font = font_size + "px " + font_type
	
	//Draw text
    dynamicTexture.drawText(text, null, null, font, color, 'transparent')
    dynamicTexture.hasAlpha = true

    //create material
    var mat = new BABYLON.StandardMaterial("nameplateMat", scene)
    mat.diffuseTexture = dynamicTexture
    mat.backFaceCulling = false
    
    //apply material
    plane.material = mat
    mat.disableLightning =true
    plane.position =  new BABYLON.Vector3(x,y,z)
    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL
    return plane
}

