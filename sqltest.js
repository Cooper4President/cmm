// This is for testing and also makes for good sample code

// create a new database named cmmtest.db
console.log('creating database');
var cmmsql=require('./cmmsql');
var sql=new cmmsql('cmmtest.db');
    
// try to add some users to the database they are all by default
// put in to the main chat room.
sql.adduser('craig','password',function(err,res){});
sql.adduser('bob','stuff',function(err,res){});
sql.adduser('user0','pass0',function(err,res){});
sql.adduser('user1','pass1',function(err,res){});
sql.adduser('user2','pass2',function(err,res){});
sql.adduser('user3','pass3',function(err,res){});

// list users in the main chat room
sql.listusers('mainroom',function(err,res){
    console.log("all users in the database. 2nd run or later it should look like:\n[ {user: 'bob' },\n  { user: 'craig' },\n  { user: 'user0' },\n  { user: 'user1' },\n  { user: 'user2' },\n  { user: 'user3' } ]\nactual:");
    console.log(res);
});

// create a private room
sql.createroom('craigpriv',[],'craig','true',function(err,res){});
// bob tries to add himself as an owner to craigs room
sql.joinroom('craigpriv','bob','true','bob',function(err,res){
    console.log('bob cant join craigpriv');
    console.log(err);
});
// fails because he is not an owner of craigs private room so he cant join
sql.listusers('craigpriv',function(err,res){
    console.log("users in craigpriv 2nd run or later should be:\n[ { user: 'craig' } ]\n actually:");
    console.log(res);
});

// create a public room
sql.createroom('craigpub',[],'craig','false',function(err,res){});

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
sql.listusers('bobroom',function(err,res){
    console.log('users in bobroom:');
    console.log(res);
});

// lets check craigs password
sql.getpassword('craig',function(err,res){
    console.log('Craigs password is '+res);
});

// try to do stuff with rooms/users that don't exist
sql.joinroom('DNE','craig','true','craig');
sql.getpassword('DNE');


sql.logroom('craigpub','craig','hello world');
sql.getroomlog('craigpub');

sql.addfriend('user0','craig');
sql.setblock('bob','craig','true');

sql.isblocked('bob','craig',function(err,res){
    console.log('bob should be blocked by craig');
    console.log('blocked='+res);
});

sql.isblocked('user0','craig',function(err,res){
    console.log('craig did not block user0. Blocked='+res);
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
    console.log('user3 should not be banned');
    console.log('Banned: '+res);
});

sql.isowner('craigpub','bob',function(err,res){
    console.log('bob is not owner of craig pub. Owner='+res);
});


sql.createroom('a-b',[],'user0','false');
