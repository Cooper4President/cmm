/*
cmmsql.js

sqlite database interface for cmm
The purpose is to ease the management of a database for keeping track of Chat rooms, users, and custom commands

How to use:
A callback function is expected to take 2 arguements (error,return).
return is either an object list or plain text.

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

5) log messages to chatrooms

sql_object_name.logroom(room,username,message,callback);

6) get room logs

sql_object_name.getroomlog(room,callback);


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
	createtable(null,'rooms','id','room,priv,creator',defaultcallback);
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

commented out due to lack of functionality

	db.serialize(function(){
	    defaultcallback(null,'self repair');
	    db.all('SELECT room FROM rooms',[],function(err,res){
		defaultcallback(null,res);
		if (res){
		    res.forEach(function(){		    
			// here is where the magic happens
		    });
		}
	    });
	});
*/
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
		    error=[{Error:'Table '+name+' Exists',code:'2'}];
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
		    error=[{Error:'Uniqueness Error',code:'2'}];
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
	db.all('SELECT ? From ? WHERE ?',[columnlist,table,req],function(err,res){
	    var error=null;
	    var results=res;
	    if (err){
		error=err;
		result='get item test';
	    }
	    cb(error,results);
	});
    }
    
    function listcolumn(err,table,column,cb){
	if (err){
	    cb(err,null);
	    return;
	}
	db.all('SELECT '+column+' FROM '+table,[],function(err,res){
	    var error=null;
	    var results=res;
	    if (err){
		error=err;
		if (err.errno=1){
		    error=[{Error:'Table '+table+' does not exist',code:'1'}];
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
	var error=null;
	var result=null;
	var rn=roomname+'users'
	db.run('INSERT into '+rn+' (user,owner,banned) VALUES (?,?,?)',[username,isowner,'false'],function(err){
	    if (err){
		error='addusertoroom error:'+err; // temp fix
		if (err.errno==19){
		    error=[{Error:username+' is already in the room '+roomname,code:'2'}];
		}
	    } else {
		result=username+' has been added to room';
	    }
	    cb(error,result);
	});
    }

    function addassociate(username,who,blocked,cb){
	if (cb==null){
	    cb=defaultcallback;
	}
	var error=null;
	var result=null;
	db.run('INSERT into '+who+'friends (friend,blocked) VALUES(?,?)',[username,blocked],function(err,res){
	    if (err){
		error=err; // the catch all for errors
		if (err.errno=13){
		    error=[{Error: 'User '+username+' is already known by'+who,code: '1'}];
		}
	    } else {
		if (blocked='true'){
		    result=username+' was blocked by '+who;
		}else{
		    result=username+' was added to '+who+' friend list';
		}
	    }
	    cb(error,result);
	});
    }

    function exitroom(err,room,who,cb){
	if (cb==null){
	    cb=defaultcallback;
	}
	var error=null;
	var result=null;
	db.run('DELETE FROM '+room+'users WHERE user==?',[who],function(err,res){
	    if (err){
		error=err;
		
	    } else {
		result='User '+who+' removed from room '+room;
	    }
	    cb(error,result);
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
		    error=[{Error:'User '+username+' already exists',code:'2'}];
		}
	    }else{
		createtable(error,username+'friends','friend','blocked',defaultcallback);
		createtable(error,username+'commands','command','method',defaultcallback);
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
			error=[{Error:'Room '+roomname+' already exists.',code:'2'}];
		    }
		    cb(error,result)
		    return;
		} else {
		    createtable(null,roomname,'time','user,message',function(err,res){
			if (err){
			    error=[{Error:'Room '+roomname+' cannot be created',code:'4'}];
			} else {
			    createtable(null,roomname+'users','user','owner,banned',function(err,res){
				if (err){
				    error=[{Error:'Room '+roomname+' cannot be created',code:'4'}];
				} else {
				    addusertoroom(null,roomname,creator,'true',creator,dcb);
				    userlist.forEach(function(value,index,array){
					addusertoroom(null,roomname,value,'false',creator,dcb);
				    });
				}
			    });
			}
		    });
		    if (error){
			db.run('DELETE FROM rooms WHERE room==?',[roomname]);
		    } else {
			result='Room '+roomname+' created';
			cb(error,result);
		    }
		}
	    });
	    
	});
    }
    
    
    cmmsql.prototype.logroom=function(roomname,username,message,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	db.run('INSERT into '+roomname+'(time,user,message) VALUES (?,?,?)',[Date.now(),username,message],function(err,res){
	    if (err) {
		cb(err,null);
	    }
	});
	
    }
    
    cmmsql.prototype.getroomlog=function(roomname,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	listcolumn(null,roomname,'*',cb);
    }
    
    cmmsql.prototype.joinroom=function(roomname,username,isowner,who,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	var error=null;
	var result=null;
	if (roomname=='mainroom'){
	    // tell the user they are a moron
	    error=[{Error:'User '+username+' is already in mainroom',code:'2'}];
	}else if (roomname=='users'){
	    error=[{Error:'Accessibility Error',code:'1'}];
	    result='Room users does not exist.';
	}else if (roomname=='rooms'){
	    error=[{Error:'Accessibility Error',code:'1'}];
	    result='Room rooms does not exist.';
	}
	if(error){
	    cb(error,result);
	    return;
	}
	db.all('SELECT user FROM users WHERE user==?',[username],function(err,res){
	    if (res[0]==undefined){
		error=[{Error: 'User '+username+' does not exist',code: '3'}];
		cb(error,null);
		return;
	    }
	    db.serialize(function(){
		db.all('SELECT priv FROM rooms WHERE room==?',[roomname],function(err,res1){
		    if (err) {
			error=err; // temporary
			if (err.errno=1){
			    error=[{Error:'Room '+roomname+' does not exist.',code:'1'}];
			}
			cb(error,null);
			return;
		    }
		    if (res1[0]==undefined){
			error=[{Error: 'Can not join room '+roomname+' does not exist',code: '1'}];
			cb (error,null);
			return;
		    }
		    var pr=res1[0].priv;
		    db.all('SELECT owner FROM '+roomname+'users WHERE user==?',[who],function(err,res2){
			var own='false';
			if(err){
			    error=err; // temproary
			    if (err.errno=1){
				error=[{Error:'Room '+roomname+' does not exist.',code:'1'}]
			    }
			    cb(error,null);
			    return;
			}
			if (res2[0]==undefined){
			    error=[{Error: who+' is not in room '+roomname,code:'1'}];
			} else {
			    own=res2[0].owner;
			}
			if (own=='false'){
			    if(pr=='true'){
				error=[{Error: who+' lacks access privalages to room '+roomname,code:'3'}];
				cb(error,result);
				return;
			    }
			    isowner=own;
			}		
			addusertoroom(null,roomname,username,isowner,who,cb);
		    });
		});
	    });
	});
    }
    
    cmmsql.prototype.isowner=function(roomname,username,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	var error=null;
	var result='false';
	db.all('SELECT owner FROM '+roomname+'users WHERE user==?',[username],function(err,res){
	    if (err){
		error=err;
	    }
	    
	    if (res!=undefined && res[0]!=undefined){
		result=res[0].owner;
	    }
	    cb(error,result);
	});
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
	    if (res[0]==undefined){
		error=[{Error: "User "+username+" does not exist",code: "1"}];
	    }else{
		result=res[0].password;
	    }
	    cb(error,result);
	});
    }

    cmmsql.prototype.isbanned=function(room,user,cb){
	if (cb==null){
	    cb=defaultcallback;
	}
	var error;
	var result;
	db.all('SELECT banned from '+room+'users WHERE user==?',[user],function(err,res){
	    if (err){
		error=err;
	    }
	    if (res!=undefined && res[0]!=undefined){
		result=res[0].banned;
	    } else {
		result='false';
		error=[{Error:'User '+user+' is not in room '+room, code: '1'}];
	    }
	    cb(err,result);
	});
    }

    cmmsql.prototype.addfriend=function(friend,who,cb){
	if (cb==null){
	    cb=defaultcallback;
	}
	addassociate(friend,who,true,cb);
    }

    cmmsql.prototype.isblocked=function(username,who,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	var error=null;
	var result=null;
	db.all('SELECT blocked FROM '+who+'friends WHERE friend==?',[username],function(err,res){
	    if (err){
		error=err;

	    }
	    if (res[0] != undefined){
		result=res[0].blocked;
	    } else {
		error=[{Error: 'Either user '+who+' or '+username+' does not exist',code: '1'}]
	    }
	    cb(error,result);
	});
    }

    cmmsql.prototype.getfriends=function(who,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	var error=null;
	var result=null;
	db.all('SELECT friend FROM '+who+'friends WHERE blocked==?',['false'],function(err,res){
	    if (err) {
		error=err;
	    }
	    if (res!=undefined && res[0] != undefined){
		result=res[0].friend;
	    }
	    cb(error,result);
	});
    }

    cmmsql.prototype.addcommand=function(command,method,who,cb){
	if (cb==null){
	    cb=defaultcallback;
	}
	var error=null;
	var result=null;
	db.run('INSERT into '+who+'commands(command,method) VALUES (?,?)',[command,method],function(err,res){
	    if (err){
		error=err;
		if(err.errno=19){
		    error=[{Error:'Command '+command+' already exists',code:'2'}];
		}
	    }else{
		result='command '+command+' added';
	    }
	    cb(error,result);
	});
    }
    
    cmmsql.prototype.getcommand=function(command,who,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	var error=null;
	var result=null;
	db.all('SELECT method FROM '+who+'commands WHERE command==?',[command],function(err,res){
	    if (err){
		error=err;
	    }
	    if (res != undefined && res[0]!=undefined){
		result=res[0].method;
	    }
	    cb(error,result);	
	});
    }
    
    

    
// ##################### to be implemented/tested ####################


    
    cmmsql.prototype.setban=function(room,who,user,banned,cb){
	// user cannot be banned from a room until they join it.
	if (cb==null) {
	    cb=defaultcallback;
	}
	var error=null;
	var result=null;
	if (room=='mainroom'){
	    error='Users cannot be banned from the main room';
	    cb(error,null);
	    return;
	}
	this.isowner(room,who,function(err,res){
	    cb(err,res)
	});
	this.isbanned(room,who,function(err,res){
	    if (err){
		cb(null,err);
		return;
	    }
	    if(res==banned){
		error=[{Error: 'User '+user+' already has banned state of '+banned, code:'4'}];
	    } else {
		db.run('UPDATE '+room+'users SET banned==? where user==?',[banned,who],function(err,res){
		    if (err){
			defaultcallback(err,null);
		    }
		});
	    }
	    cb(error,result);
	});
    }

    cmmsql.prototype.setblock=function(username,who,blocked,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	var error;
	var result
	db.all('SELECT blocked from '+who+'friends WHERE user==?',[username],function(err1,res1){
	    if (res1!=undefined && res1[0]!=undefined){
		if (blocked==res1[0].blocked){
		    error=[{error: 'user '+username+'already has blocked state: '+blocked, code:'4'}];
		} else {
		    db.run('UPDATE '+who+'friends SET blocked==? WHERE user==?',[blocked,username],function(err2,res2){
			cb(err2,res2);
		    });
		}
	    } else {
		addassociate(username,who,blocked,cb);
	    }
	});
    }
    
    cmmsql.prototype.kickout=function(roomname,kicked,kicker,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	this.isowner(roomname,kicker,function(err,res){
	    if (res=='true'){
		exitroom(null,roomname,kicked,cb);
	    }
	});
    }

    cmmsql.prototype.leaveroom=function(roomname,username,cb){
 	if (cb==null) {
	    cb=defaultcallback;
	}
	exitroom(null,roomname.username,cb);
    }


    cmmsql.prototype.removefriend=function(username,who,cb){
	if (cb==null) {
	    cb=defaultcallback;
	}
	error=null;
	result=null;
	db.run('DELETE FROM '+who+'friends WHERE user==?',[username],function(err,res){
	    if (err){
		error=err;
	    } else {
		result='User '+username+' was removed from '+who+' friend list';
	    }
	});
    }


}

// Make it importable
module.exports=cmmsql
