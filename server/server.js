/**
 * Created by Sam on 14-6-7.
 * meteor-weibo server.js
 */

Posts = new Meteor.Collection("posts");

Posts.allow({
    insert:function(userId, doc){
        return userId && (doc.user._id === userId);
    }
})
