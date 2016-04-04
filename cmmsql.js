/*
cmmsql.js

Written by: Craig Cornett


sqlite interface for cmm

How to use:

1) create a new sql object:

var sql_object_name = new cmmsql(database);

sql_object_name is whatever you want to type
database is the location/name of the database file.

2) add users to the database

sql_object_name.adduser(username,password,callbck);

username is the username and password is the password.

3) create new chat rooms

sql_object_name.createroom(roomname,invited_owners,creator,private,callback);

roomname is the name of the chat room
invited_owners is a text array which contains the users who can add users to a private room other than the room creator. ['user1','user2','user3',,,'userN']
creator is the creating user and by default owns the room
private is text equal to 'true' or 'false' any other values will be replaced with 'false'

4) add users to chatrooms

sql_object_name.joinroom(roomname,joining_user,owner,who,callback);




Error Codes
1 Access Error
2 Uniqueness Error
3 Permissions Error


*/


function cmmsql(database) {
    var sqlite3 = require("sqlite3").verbose();
    var db = new sqlite3.Database(database);
    
    
    db.serialize(function(){
	createtable(null,'mainroom','time','user, messsage',defaultcallback);
	createtable(null,'users','user','password',defaultcallback);
	createtable(null,'rooms','room','priv,creator',defaultcallback);
	selfrepair();
    });

    function defaultcallback(err,result){
	if (err){
	    console.log(err);
	}
	if (result){
	    console.log(result);
	}
    }

    function selfrepair(){
/*
Ideally this will:

1. Ensure that any room which has an owner will exist and be properly setup.
2. Clean up any lost/broken rooms.
*/
	db.serialize(function(){
	    db.run('SELECT name FROM sqlite_master WHERE type=?',['table'],function(err,res){
		defaultcallback(err,res);
		if (res){
		    res.forEach(function(){		    
			// here is where the magic happens
		    });
		}
	    });
	});
    }
    
    function createtable(err,name,uniqueid,collumnlist,cb){
	if (err){
	    cb(err,null);
	    return;
	}
	db.run('CREATE TABLE '+name+'('+uniqueid+' UNIQUE, '+collumnlist+' )',function(err){
	    var error=null;
	    var result=null;
	    if (err){
		error=err; // untill I learn all the possible errors
		if (err.errno==1){
		    error=[{error:'Table Exists',code:'3'}];
		    result='Table Exists';
		}
		
	    } else {
		result='Table '+name+' has been created';
	    }
	    cb(error,result);
	});
    }
    
    function additem(err,table,columns,values,cb){
	if (err){
	    cb(err,null);
	    return;
	}
	db.run('INSERT into '+table+'('+columns+') VALUES ( ? )',[values],function(err){
	    var error=null;
	    var result=null;
	    if (err){
		error=err; // until I learn the errors
		if (err.errno=13){
		    error=[{error:'Uniqueness Error',code:'2'}];
		    result='Failled to add '+values+' to '+table;
		}
	    } else {
		result='Sucessfuly added '+values+' to '+table;
	    }
	    cb(err,result);
	});
    }
    
    function getitem(err,table,columnlist,req,cb){
	if (err){
	    cb(err,null);
	    return;
	}
	db.all('SELECT ? From ? WHERE ?',[columnlist,table,req],function(err,results){
	    var error=null;
	    if (err){
		error=err;
	    }
	    cb(error,results);
	});
    }
    
    function listcolumn(err,table,column,cb){
	if (err){
	    cb(err,null);
	    return;
	}
	db.all('SELECT '+column+' FROM '+table,function(err,results){
	    var error=null;
	    if (err){
		error=err;
		if (err.errno=1){
		    error=[{error:'Table does not exist',code:'1'}];
		}
	    }
	    cb(error,results);
	});
    }
    
    function addusertoroom(err,roomname,username,isowner,who,cb){
	if (err){
	    cb(err,null);
	    return;
	}
	if (cb==null){
	    cb=defaultcallback;
	}
	var error=null;
	var result=null;
	// need to include check for user existance
	db.serialize(function(){
	    db.all('SELECT priv FROM rooms WHERE room==?',[roomname],function(err,res1){
		if (err) {
		    error=err; // temporary
		    if (err.errno=1){
			error=[{error:'Room '+roomname+' does not exist.',code:'1'}]
		    }
		    cb(error,null);
		    return;
		}
		var priv = res1.priv
		cb(priv,res1);
		db.all('SELECT owner FROM '+roomname+'users WHERE user==?',[who],function(err,res2){
		    if(err){
			error=err; // temproary
			if (err.errno=1){
			    error=[{error:'Room '+roomname+' does not exist.',code:'1'}]
			}
			cb(error,null);
			return;
		    }
		    var own=res2.owner;
		    if (own=='false'){
			if(priv='true'){
			    // tell the client that they cant add users to the room
			    error=[{error:'Permissions Error',code:'3'}];
			    result=who+' lacks access privalages to room '+roomname;
			    cb(error,result);
			    return;
			}
			isowner=='false';
		    }			    
		    db.run('INSERT into '+roomname+'users (user,owner) VALUES (?,?)',[username,isowner],function(err){
			if (err){
			    error=err; // temp fix
			    if (err.errno==19){
				error=[{error:'Uniqueness Error',code:'2'}];
				result=username+' is already in the room';
			    }
			} else {
			    result=username+' has been added to room';
			}
			cb(error,result);
		    });
		});
	    });
	});
    }
//##################### Externally Accessible ######################    
    cmmsql.prototype.adduser=function(username,password,cb){
	var error=null;
	var result=null;
	if (cb==null){
	    cb=defaultcallback;
	}
	db.run('INSERT into users(user,password) VALUES(?,?)',[username,password],function(err){
	    if (err){
		error=err; //tmpfix
		if (err.errno==19){
		    error=[{error:'Uniqueness Error',code:'2'}];
		    result='User '+username+' already exists'
		}
	    }else{
		result='User '+username+' added sucessfully';
	    }
	    cb(error,result);
	});
    }
    
    cmmsql.prototype.listusers = function(room,cb){
	if (cb==null){
	    cb=defaultcallback;
	}
	if (room=='mainroom'){
	    listcolumn(null,'users','user',cb);
	    return;
	}
	listcolumn(null,room+'users','user',cb);
    }
    
    
    cmmsql.prototype.createroom=function(roomname,userlist,creator,priv,cb){
	var dcb=defaultcallback;
	if (cb==null){
	    cb=dcb;
	}
	var error=null;
	var result=null;
	db.serialize(function(){
	    db.run('INSERT into rooms(room,priv,creator) VALUES (?,?,?)',[roomname,priv,creator],function(err){
		if (err){
		    error=err;
		    if (err.errno==19){
			error=[{error:'Uniqueness Error',code:'2'}];
			result='Room '+roomname+' already exists.';
		    }
		    cb(error,result)
		    return;
		}
		createtable(null,roomname,'time','user,message',dcb);
		createtable(null,roomname+'users','user','owner',dcb);
		addusertoroom(null,roomname,creator,'true',cb);
		userlist.forEach(function(value,index,array){
		    addusertoroom(null,roomname,value,'true',creator,cb);
		});
	    });
	    
	});
    }
    
    
    cmmsql.prototype.logroom=function(roomname,username,message,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	additem(null,roomname,'time,user,message',Date.now()+','+username+','+message,cb);
    }
    
    cmmsql.prototype.getroomlog=function(roomname,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	listtable(roomname,cb);
    }
    
    cmmsql.prototype.joinroom=function(roomname,username,isowner,who,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	var error=null;
	var result=null;
	if (roomname=='mainroom'){
	    // tell the user they are a moron
	    error=[{error:'Uniqueness Error',code:'2'}];
	    result='User '+username+' is already in this room';
	}else if (roomname=='users'){
	    error=[{error:'Accessibility Error',code:'1'}];
	    result='Room users does not exist.';
	}else if (roomname=='rooms'){
	    error=[{error:'Accessibility Error',code:'1'}];
	    result='Room rooms does not exist.';
	}
	if(error){
	    cb(error,result);
	    return;
	}
	addusertoroom(null,roomname,username,isowner,who,cb);
    }
    
    cmmsql.prototype.leaveroom=function(roomname,username,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	// need to implement this
    }
    
    cmmsql.prototype.listowners=function(roomname,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	var error=null;
	db.all('SELECT user FROM ? WHERE owner==?',[roomname+'users','true'],function(err,res){
	    if (err){
		error=err;
	    }
	    cb(error,res);
	});
    }
    
    cmmsql.prototype.kickout=function(roomname,userkicked,kicker,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	// need to implement this
    }
    
    cmmsql.prototype.getpassword=function(username,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	var result=null;
	var error=null;
	db.all('SELECT password FROM users WHERE user==?',[username],function(err,res){
	    if (err){
		error=err;
	    }
	    cb(error,res);
	});
    }
    
}
//####################################################

// Now make it importable
module.exports=cmmsql
