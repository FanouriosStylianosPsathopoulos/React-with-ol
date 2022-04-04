function return_json(desc,obj_){
    var json;

    if (desc=="Polygon_json"){
        json= obj_.map(x=> {
            
           var z = x.map(y => {return {longitude : y[0] , latitude : y[1]}
           })
        
           return {polygon : z}
        })
    }
    else if (desc=="Info_Point"){
        json= {point : {
            longitude : obj_[0],
            latitude : obj_[1]
        }}
    }

    return json[0]
}

export {return_json} ; 