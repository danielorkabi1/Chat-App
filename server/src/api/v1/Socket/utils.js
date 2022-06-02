async function NotConnectedUsers(users,connectedUsers,action){
    for (const userId of users) {
        if(!connectedUsers[userId]){
            await action(userId);
        }   
    }
}
module.exports={
    NotConnectedUsers
}