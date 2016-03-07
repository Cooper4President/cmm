/*
cmmsql.js

Written by: Craig Cornett


sqlite interface for cmm

Please note:

1) ALL inputs are expected to be in the form of plain text without white space

'this_is_good_input_everywhere'

2) the only place where #1 is inaccurate is the createroom() function.
 ['this','is','ok','for,

How to use:

1) create a new sql object:

var sql_object_name = new cmmsql(database);

sql_object_name is whatever you want to type
database is the location/name of the database file.

2) add users to the database

sql_object_name.adduser(username,password);

username is the username and password is the password.

3) create new chat rooms

sql_object_name.createroom(roomname,invited_owners,creator,private);

roomname is the name of the chat room
invited_owners is a text array which contains the users who can add users to a private room other than the room creator. ['user1','user2','user3',,,'userN']
creator is the creating user and by default owns the room
private is text equal to 'true' or 'false' any other values will be replaced with 'false'

4) add users to chatrooms

sql_object_name.joinroom(

Example:


*/

//allow this file to be imported as a 'module' using the NodeJS 'require'
module.exports = cmmsql;


function cmmsql(database) {
    var sqlite3 = require("sqlite3").verbose();
    var db = new sqlite3.Database(database);


    db.serialize(function(){
	createtable('mainroom','time','user, messsage');
	createtable('users','user','password');
	createtable('rooms','room','priv,creator');
    });


    function checkpassword(username,password){
	// need to implement
    }

    function createtable(name,uniqueid,collumnlist){
	db.run('CREATE TABLE '+name+'('+uniqueid+' UNIQUE, '+collumnlist+' )',function(err){
	    if (err){
		if (err.errno==1){
		    console.log('Create Table Error: '+err.errno+'  '+err);
		    return;
		}
	    }
	    console.log('Table '+name+' has been created');
	});
    }

    function additem(table,columns,values){
	db.run('INSERT into '+table+'('+columns+') VALUES ( ? )',[values],function(err){
	    console.log("additem")
	    if (err){
		console.log(err);
		// need to tell the client that the username already exists
		return;
	    }
	    // need to tell the client success
	});
    }

    function getitem(table,columnlist,req){
	db.all('SELECT ?? From ? WHERE ?',[columnlist,table,req],function(err,results){
	    if (err){
		console.log(err);
		// need to tell the client that there was no response
	    }
	    // need to parse data and return to the client
	    console.log(results);
	});
    }

    function listcolumn(table,column){
	db.all('SELECT '+column+' FROM '+table,function(err,results){
	    if (err){
		console.log('listcolumn error: '+err.errno);
		console.log(err);
		return;
	    }
	    // need to parse data and return to the client
	    console.log(results);
	});
    }

    function addusertoroom(roomname,username,isowner,who){
	db.serialize(function(){
	    db.all('SELECT priv FROM rooms WHERE room==?',[roomname],function(err,result){
		if (err) {
		    // need to tell client there was an error
		    console.log('Error: '+err.errno+'   '+err);
		    return;
		}
		//need to parse result
		var priv=result;
		console.log(priv);
		db.all('SELECT owner FROM '+roomname+'users WHERE user==?',[who],function(err,result){
		    if(err){
			// need to tell client there was an error
			console.log('Error: '+err.errno+'   '+err);
			return;
		    }
		    var own=result;
		    if (own=='false'){
			if(priv='true'){
			    // tell the client that they cant add users to the room
			    console.log('lack access privalages to room')
			    return;
			}
			isowner=='false';
		    }
		    db.run('INSERT into '+roomname+'users (user,owner) VALUES (?,?)',[username,isowner],function(err){
			if (err){
			    if (err.errno==19){
				console.log('User '+username+' already belongs to room '+roomname);
			    }
			    console.log('Error: '+err.errno+'   '+err);
			    return;
			}
			console.log('User '+username+' has been added to room '+roomname);
		    });
		});
	    });
	});
    }







    cmmsql.prototype.listtable = function(table){
	listcolumn(table,'*');
    }


    cmmsql.prototype.adduser=function(username,password){
	db.run('INSERT into users(user,password) VALUES(?,?)',[username,password],function(err){
	    if (err){
		if (err.errno==19){
		    // need to return user exists to client
		    console.log('user exists');
		}
		console.log('Error: '+err.errno+'   '+err);
		// need to return other errors to user
		return;
	    }
	    // need to return success to user
	    console.log('User '+username+' has been added.');
	});
    }

    cmmsql.prototype.listusers = function(room){
	if (room=='mainroom'){
	    listcolumn('users','user');
	    return;
	}
	listcolumn(room+'users','user');
    }


    cmmsql.prototype.createroom=function(roomname,userlist,creator,priv,password){
	db.serialize(function(){
	    createtable(roomname,'time','user,message');
	    createtable(roomname+'users','user,owner');
	    addusertoroom(roomname,creator,'true');
	    userlist.forEach(function(value,index,array){
		addusertoroom(roomname,value,isowner,creator);
	    }),
	    db.run('INSERT into rooms(room,priv,creator) VALUES (?,?)',[roomname,priv],function(err){
		if (err){
		    if (err.errno==19){
			console.log('Room '+roomname+' already exists.');
		    }
		    console.log(err);
		    // need to tell the client that the username already exists
		    return;
		}
		// need to tell the client success
		console.log('Room '+roomname+' created')
	    });

	});
    }


    cmmsql.prototype.logroom=function(roomname,username,message){
	additem(roomname,'time,user,message',Date.now()+','+username+','+message);
    }

    cmmsql.prototype.getroomlog=function(roomname){
	listtable(roomname);
    }

    cmmsql.prototype.joinroom=function(roomname,username,isowner,who){
	if (roomname=='mainroom'){
	    // tell the user they are a moron
	    return;
	}
	addusertoroom(roomname,username,isowner,who);
    }

    cmmsql.prototype.leaveroom=function(roomname,username){
	// need to implement this
    }

    cmmsql.prototype.listowners=function(roomname){
	// need to implement this
    }

    cmmsql.prototype.kickout=function(roomnae,userkicked,kicker){
	// need to implement this
    }




}
//##########################  END OF THE CLASS  ##########################

// This is for testing and sample code

/*
// create a new database named cmm.db
var sql=new cmmsql('cmm.db');

// add some users to the database they are all by default
// put in to the main chat room.
sql.adduser('craig','password');
sql.adduser('bob','stuff');

// list users in the main chat room
sql.listusers('mainroom');

// create a private room
sql.createroom('craigpriv',[],'craig','true');
sql.listusers('craigpriv');

// bob tries to add himself as an owner to craigs room
//    (room, user_to_add, add_as_owner, who_is_adding)
sql.joinroom('craig','bob','true','bob');
// fails because he is not an owner of craigs private room so he cant join
sql.listusers('craigpriv');

// create a public room
sql.createroom('craigpub',[],'craig','false');

// bob can join this room but he cant claim ownership
sql.joinroom('craigpub','bob','true','bob');
sql.listusers('craigpub');
sql.listowners('craigpub');

// as the owner of the room craig can kick bob out
sql.kickout('craigpub','bob','craig');
sql.listusers('craigpub');

// create some more users
sql.adduser('user0','pass0');
sql.adduser('user1','pass1');
sql.adduser('user2','pass2');
sql.adduser('user3','pass3');
sql.listusers('mainroom');

*/






// end testing section
