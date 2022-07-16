function return_json(desc,obj_){
    var json;

    if (desc=="Polygon_json"){
        json= obj_.map(x=> {
            
           var z = x.map(y => {return {longitude : y[0] , latitude : y[1]}
           })
        
           return {points : z}
        })
        json=json[0]
    }
    else if (desc=="Info_Point"){
        json= {point : {
            longitude : obj_[0],
            latitude : obj_[1]
        }}
    }
    else if (desc=="Point of interest"){
        json= {point : {
            longitude : obj_[0][0],
            latitude : obj_[0][1]
            },
            point_of_interest : obj_[1]
            }
    }
    else if (desc=="Home"){
        json= {
            longitude : obj_[0][0],
            latitude : obj_[0][1],
            floor: obj_[1],
            levels: obj_[2],
            year: obj_[3],
            squareMeters: obj_[4],
            buildingFees: obj_[5],
            description: obj_[6]
            }
    }

    return json
}

export {return_json} ; 