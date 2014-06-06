/**
 * Created by Sam on 14-6-6.
 * meteor-weibo client.js
 */

Session.setDefault("currentUrl",{index:"active",login:"",reg:""});
Session.setDefault("info",{success:"",error:""});

Template.info.info = function(){
    return Session.get("info");
}

Template.container.currentUrl = function(){
    return Session.get('currentUrl');
}

Template.nav.active = function(){
    return Session.get('currentUrl');
}

Template.login.events({
    'click #submit':function(evt){
        evt.preventDefault();
        var $username = $("#username").val();
        var $password = $("#password").val();
        if($username.length === 0 || $password.length === 0){
            Session.set('info',{success:"",error:"用户名或密码不能为空"});
            return;
        }
        Meteor.loginWithPassword($username,$password,function(err){
            if(err){
                Session.set("info",{success:"",error:err.reason});
            }else{
                Router.redirect("/");
                Session.set("info",{success:"登录成功",error:""});
            }
        })
    }
})

Template.reg.events({
    'click #submit':function(evt){
        evt.preventDefault();
        var username = $("#username").val();
        var $password = $("#password").val();
        var $password_repeat = $("#password-repeat").val();
        if(username.length === 0 || $password.length === 0){
            Session.set('info',{success:"",error:"用户名或密码不能为空"});
            return;
        }
        if($password !== $password_repeat){
            Session.set("info",{success:"",error:"两次输入密码不一致"});
            return;
        }
        Accounts.createUser({username:$("#username").val(), password:$("#password").val()},function(err){
            if(err){
                Session.set("info",{success:"",error:err.reason});
            }else{
                Router.redirect("/");
                Session.set("info",{success:"注册成功",error:""});
            }
        });
    }
});

var urlRouter = Backbone.Router.extend({
    routes:{
        "":"index",
        "login":"login",
        "reg":"reg",
        "logout":"logout"
    },
    index:function(){
        Session.set("currentUrl",{index:"active",login:"",reg:""});
    },
    login:function(){
        if(Meteor.userId()){
            this.navigate("/",true);
            Session.set("info",{success:"",error:"用户已在线"});
            return;
        }
        Session.set("currentUrl",{index:"",login:"active",reg:""});
    },
    reg:function(){
        if(Meteor.userId()){
            this.navigate("/",true);
            Session.set("info",{success:"",error:"用户已在线"});
            return;
        }
        Session.set("currentUrl",{index:"",login:"",reg:"active"});
    },
    logout:function(){
        if(Meteor.userId()){
            Meteor.logout();
            this.navigate("/",true);
            Session.set("info",{success:"登出成功",error:""});
        }else{
            this.navigate("/",true);
            Session.set("info",{success:"",error:"用户不在线"});
        }
    },
    redirect:function(url){
        this.navigate(url,true);
    }
});

Router = new urlRouter;

Meteor.startup(function(){
    Backbone.history.start({pushState:true});
});
