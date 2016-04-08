// This is for testing and also makes for good sample code

// create a new database named cmmtest.db
console.log('creating database');
var cmmsql=require('./cmmsql');
var sql=new cmmsql('cmmtest.db');
    
// try to add some users to the database they are all by default
// put in to the main chat room.
sql.adduser('craig','password');
sql.adduser('bob','stuff');
sql.adduser('user0','pass0');
sql.adduser('user1','pass1');
sql.adduser('user2','pass2');
sql.adduser('user3','pass3');

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
sql.isowner('craigpub','craig',function(err,res){
    console.log('craig is owner so this should be true: '+res);
});

// as the owner of the room craig can kick bob out
sql.kickout('craigpub','bob','craig');
sql.listusers('craigpub');

sql.createroom('bobroom',['user0','user1'],'bob','false');
sql.listusers('bobroom');

// lets check craigs password
sql.getpassword('craig',function(err,res){
    console.log('Craigs password is '+res);
});

// try to do stuff with rooms/users that don't exist
sql.joinroom('DNE','craig','true','craig');
sql.getpassword('DNE');


sql.logroom('craigpub','craig','hello world');
sql.getroomlog('craigpub');

sql.addfriend('user0','craig','false');
sql.addfriend('bob','craig','true');

sql.isblocked('bob','craig',function(err,res){
    console.log('bob should be blocked by craig');
    console.log('blocked='+res);
});
sql.isblocked('user0','craig',function(err,res){
    console.log('should be false: '+res);
});
sql.isblocked('DNE','craig');

sql.getfriends('craig',function(err,res){
    console.log('craig friends are: '+res);
});

sql.addcommand('bluedate','--color blue --date','craig');
sql.getcommand('bluedate','craig',function(err,res){
    console.log('bluedate :'+res);
});

sql.setban('craigpub','craig','user3','true');
sql.isbanned('craigpub','user2',function(err,res){
    console.log('user2 should not be banned');
    console.log('Banned: '+res);
});
sql.isbanned('craigpub','user3',function(err,res){
    console.log('user3 can not be banned from craigpub as they arent in the room');
    console.log('Banned: '+res);
});
