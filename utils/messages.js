const moment=require('moment')//Library to get current time.

function formatMessage(username,text){
    return{
        username,
        text,
        time:moment().format('h:mm a')
    } 
}

module.exports=formatMessage;