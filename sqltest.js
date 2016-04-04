// This is for testing and also makes for good sample code
var cmmsql=require('./cmmsql');

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
sql.joinroom('craigpriv','bob','true','bob');
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


sql.createroom('bobroom',['user0','user1'],'bob','false');
sql.listusers('bobroom');

sql.joinroom('DNE','craig','true','craig');

sql.getpassword('craig');
sql.getpassword('DNE');

// end testing section
sql.logroom('craigpub','craig','hello world');
sql.getroomlog('craigpub');
