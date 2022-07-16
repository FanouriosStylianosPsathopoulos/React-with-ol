function return_id(obj_){

    var id='';

    id.concat("ID-",obj_.lat,obj_.long)

    return id;
}

export {return_id}