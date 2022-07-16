import { type } from "@testing-library/user-event/dist/type";
import axios from "axios";

const baseUrl="http://195.134.66.232:8345/swagger-ui/index.html#/";

const handle_connection = async (request,method,argument_of_method)=>{
    //console.log(request,method,argument_of_method);

    //create the sequences

    if (request=="POST"){
        if (method=="pointInfo"){
            //console.log("ews efdw sto pointInfo")
            const var_o= {
                "point": {
                  "latitude": 25.0,
                  "longitude": 25.0
                }
              }
            console.log(argument_of_method)
            var point_id,type_of_point,resp;
            
            try {
                resp = await axios.post("http://195.134.66.232:8345/pointInfo",argument_of_method)
                console.log(resp.data);
            } catch (err) {
                // Handle Error Here
                console.error(err);
            }
            console.log(resp.status,resp.data)
            if (resp.status==200 && resp.data!='')
            {

                point_id=resp.data.generalPointId;
                type_of_point=resp.data.pointType;
            }
        
            console.log(type_of_point)
            if (type_of_point=='apartment'){
                //get apartment by id 
                var arg_string="http://195.134.66.232:8345/getApartmentById/" + point_id

                console.log(arg_string)

                //resp= await axios.get(arg_string,{"generalPointId" : point_id})

                try {
                    resp= await axios.get(arg_string,{"generalPointId" : point_id})
                    console.log(resp.data);

                    if (resp.status==200 && resp.data!='')
                    {
                    //  console.log(response)
                        resp.data["type"]="apartment";
                        return resp.data;
                        /*return new Promise(resolve => {
                            console.log("Promise")
                            resolve(resp.data);
                            
                          }); */
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

                console.log(arg_string)

                //resp= await axios.get(arg_string,{"generalPointId" : point_id})

                try {
                    resp= await axios.get(arg_string,{"generalPointId" : point_id})
                    console.log(resp.data);
                    console.log("Response is ",resp.data,resp.status)
                    if (resp.status==200 && resp.data!='')
                    {
                        console.log("Response is ",resp)
                        //resp.data["type"]=resp.data.description;
                        return resp.data.description;
                        /*return new Promise(resolve => {
                            console.log("Promise")
                            resolve(resp.data);
                            
                          }); */
                    }
                } catch (err) {
                    // Handle Error Here
                    console.error(err);
                }
            }

            
        }
        else if (method=="Polygon_Area"){
            console.log("Re file deixe moy",argument_of_method)
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
            console.log("Prousiase to ",argument_of_method)
            try {
                
                resp = await axios.post("http://195.134.66.232:8345/savePointOfInterest",argument_of_method)
                console.log(resp.data);
                //console.log(resp.data.keys)
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

                return object_feature
            }
        }
        else if (method=="Home"){
            console.log("Prousiase to ",argument_of_method)
            try {
                
                resp = await axios.post("http://195.134.66.232:8345/saveApartment",argument_of_method)
                console.log(resp.data);
                //console.log(resp.data.keys)
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
const sendPostRequest = async (string_with_api,argument) => {
    try {
        const resp = await axios.post(string_with_api,argument);
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

const sendGetRequest = async (string_with_api,argument) => {
    try {
        const resp = await axios.get(string_with_api,argument);
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

export {handle_connection}

/*.catch(function (error) {
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  console.log(error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message);
                }
                console.log(error.config);
              });*/
            //console.log(var_o)