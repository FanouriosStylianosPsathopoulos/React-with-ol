function return_id(obj_){

    var id='';

    id.concat("ID-",obj_.lat,obj_.long)
    
    console.log(id);

    return id;
}

export {return_id}