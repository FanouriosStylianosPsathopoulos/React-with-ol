import axios from "axios";

const handle_connection = async (request,method,argument_of_method)=>{

    //create the sequences

    if (request=="POST"){
        if (method=="pointInfo"){

            var point_id,type_of_point,resp;
            
            try {
                resp = await axios.post("http://195.134.66.232:8345/pointInfo",argument_of_method)
                console.log(resp.data);
            } catch (err) {
                // Handle Error Here
                console.error(err);
            }
            
            if (resp.status==200 && resp.data!='')
            {

                point_id=resp.data.generalPointId;
                type_of_point=resp.data.pointType;
            }

            if (type_of_point=='apartment'){
                //get apartment by id 
                var arg_string="http://195.134.66.232:8345/getApartmentById/" + point_id

                //resp= await axios.get(arg_string,{"generalPointId" : point_id})

                try {
                    resp= await axios.get(arg_string,{"generalPointId" : point_id})
                    console.log(resp.data);

                    if (resp.status==200 && resp.data!='')
                    {
                    
                        resp.data["type"]="apartment";
                        return resp.data;
                        
                    }
                } catch (err) {
                    // Handle Error Here
                    console.error(err);
                }


                
            }
            //else its poi 
            else{
                //get apartment by id 
                var arg_string="http://195.134.66.232:8345/getPointOfInterestById/" + point_id


                //resp= await axios.get(arg_string,{"generalPointId" : point_id})

                try {
                    resp= await axios.get(arg_string,{"generalPointId" : point_id})
                   
                    console.log("Response is ",resp.data,resp.status)
                    if (resp.status==200 && resp.data!='')
                    {
                        
                        return resp.data.description;
                        
                    }
                } catch (err) {
                    // Handle Error Here
                    console.error(err);
                }
            }

            
        }
        else if (method=="Polygon_Area"){
            
            //send the coords of polygon to base
            try {
                resp = await axios.post("http://195.134.66.232:8345/pointsInPolygon",argument_of_method)
                console.log("Data is",resp.data);
            } catch (err) {
                // Handle Error Here
                console.error(err);
            }

            if (resp.status==200 && resp.data!='')
            {

                return resp.data;
            }

        }
        else if (method=="Point_of_Interest"){
            
            try {
                
                resp = await axios.post("http://195.134.66.232:8345/savePointOfInterest",argument_of_method)
                console.log(resp.data);
                
            } catch (err) {
                // Handle Error Here
                console.error(err);
            }
            
            var object_feature={};

            console.log("Status is ",resp.status)
            if (resp.status==201 && resp.data!='')
            {
                console.log(resp.data)
                object_feature.id=1;

                object_feature.lat=1;

                object_feature.long=1;
                //console.log(response)

                return resp.data
            }
        }
        else if (method=="Home"){
            try {
                
                resp = await axios.post("http://195.134.66.232:8345/saveApartment",argument_of_method)
                console.log(resp.data);
                
            } catch (err) {
                // Handle Error Here
                console.error(err);
            }
            
            var object_feature={};

            console.log("Status is ",resp.status)
            if (resp.status==200 && resp.data!='')
            {
                console.log(resp.data)

                return resp.data
            }
        }
    }
}


export {handle_connection}

