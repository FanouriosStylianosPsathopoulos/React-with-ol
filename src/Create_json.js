function return_json(desc,obj_){
    var json;

    if (desc=="Polygon_json"){
        json= obj_.map(x=> {
            
           var z = x.map(y => {return {longitude : y[0] , latitude : y[1]}
           })
        
           return {polygon : z}
        })
        json=json[0]
    }
    else if (desc=="Info_Point"){
        json= {point : {
            longitude : obj_[0],
            latitude : obj_[1]
        }}
    }
    else if (desc="Point of interest"){
        json= {point : {
            longitude : obj_[0][0],
            latitude : obj_[0][1]
            },
            type_of_place : obj_[1]
            }
    }

    return json
}

export {return_json} ; 