

async function connect_websocket(self){
    
    document.self = self
     
    var t0 = performance.now();
    
    self.ws = new WebSocket(self.ws_url)
   
    self.ws.addEventListener('open', function (event) {
        //console.log("Websocket connection opened")
    })

    self.ws.onmessage = async function(event) {
    
        var msg = JSON.parse(event.data)
        // Handle authentication.
        if (!document.auth_ok )
        {
            switch (msg['type']){ 
            case "auth_required":
                console.log("Authentication required")
                console.log("Authenticating...")
                self.ws.send(JSON.stringify({"type": "auth","access_token": auth_token}))
                break
            case "auth_ok":
                self.ws.send(JSON.stringify({"id": 1, "type": "subscribe_events", "event_type": "state_changed"}))
                document.auth_ok = true
                self.ws.send(JSON.stringify({"id": 2, "type": "get_states"}))
                self.call_service_id = self.call_service_id + 1
                console.log("Authenticated")
                console.log("Requesting initial state...")
                break
            }
        }
        else{
            if ( "result" in msg && msg['id'] > 2){
                try
                    {if ("path" in msg['result']){
                    fire_event_callback(self, msg['result']['path'], msg['id'] )
                    }
                }
                catch(err){
                }
            }
           
            if (msg['type'] == "result" && msg['id'] === 2){
                var cnt = 0
                self.entity_state = {}
                for (entity in msg['result']){
                //    if (self.tracked_entities.includes(msg['result'][entity]['entity_id'])){
                        ent = msg['result'][entity]['entity_id']
                        self.states[msg['result'][entity]['entity_id']] = msg['result'][entity]
                       // self.callback_map[entity][item](msg['result'][entity])
                        cnt = cnt + 1
                //    } 
                }
                console.log("Got initial state for ", cnt, "entities.")
                for (state in self.states){
                    entity_id = state
                    if (self.tracked_entities.includes(entity_id)){
                        // Send the new state to the callback for the tracked entity.
                        if (typeof self.callback_map[entity_id] !== "function"){
                            for ( item in self.callback_map[entity_id]){
                                self.callback_map[entity_id][item](self.states[entity_id])
                            }   
                        }
                        else{
                            self.callback_map[entity_id](self.states[entity_id])
                        }
                    }
                }

                               
                self.call_service_id  = 3  
                self.done = true 
            }             
            
            if (msg['type'] == "result" && self.get_states_request == true){
                self.get_states_request = false
                self.get_states_callback(msg)
               
            }
            // Check if we received an event message.
            if ( "event" in msg){
                // Get the entity_id from the event message.
                entity_id = msg['event']['data']['entity_id']
                // Check if the entity_id is the list of tracked entitites.
                if (self.tracked_entities.includes(entity_id)){
                    self.states[entity_id] = msg['event']['data']['new_state']
                    // Send the new state to the callback for the tracked entity.
                    if (typeof self.callback_map[entity_id] !== "function"){
                        for ( item in self.callback_map[entity_id]){
                            self.callback_map[entity_id][item](msg['event']['data']['new_state'])
                        }   
                    }
                    else{
                        self.callback_map[entity_id](msg['event']['data']['new_state'])
                    }
                }
            }
        }
    }
    self.ws.onclose = function() {
        console.log('Connection to Home Assistant closed')
        document.auth_ok = false
        connect_websocket(document.self)
    }

    self.ws.onopen = function() {
        console.log('Connected to Home Assistant')
    }
}


function registerCallback(self, context, entity){
  
    if (typeof callback_map[entity] == "function"){
         var list = []
         list.push(callback_map[entity])
         list.push(context.SetState.bind(context))
         self.callback_map[entity] = list
    }
    else if (typeof callback_map[entity] == "object"){
        var list = []
        for (item of callback_map[entity]){
            list.push(item)
        }
        list.push(context.SetState.bind(context))
        self.callback_map[entity] = list
    }
    
    else{
        self.callback_map[entity] = context.SetState.bind(context)
    }
}