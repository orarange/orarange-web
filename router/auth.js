const express = require('express');
const passport = require('passport');
const session = require('express-session');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const {getUserData, createUserData, updateUserData, deleteUserData} = require('./functions/userdata');


router.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: false
}));

// Passportの初期化とセッションの設定
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // ユーザーオブジェクトをデータベースなどから取得する処理
    // idを使ってユーザーを特定し、ユーザーオブジェクトを取得する必要があります
    
    // ユーザーオブジェクトを取得できた場合
    done(null, id);
    
    // ユーザーオブジェクトの取得に失敗した場合
    done(new Error('Failed to deserialize user'));
    }
);


// Google認証のための設定
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
    new GoogleStrategy({
        clientID: "",
        clientSecret: "",
        callbackURL: "http://localhost:8080/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        // ユーザーの識別情報をデータベースから検索し、存在しない場合は作成する
        /*getUserData(profile.id).then((user) => {
            if (user) {
                // ユーザーが存在する場合
                return done(null, profile);
            } else {
                // ユーザーが存在しない場合
                createUserData(profile.id, profile.displayName, profile.emails[0].value).then((user) => {
                    return done(null, profile);
                }).catch((error) => {
                    return done(error);
                });
            }
        }
        ).catch((error) => {
            return done(error);
        }
        );*/

        createUserData(profile).then((user) => {
            return done(null, profile);
        }
        ).catch((error) => {
            return done(error);
        }
        );
        
    }
    )
);

// 認証ルートのハンドラー
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 認証後のコールバック処理
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // 認証に成功した場合の処理
        res.redirect('/');
    }
);

// ログアウト処理
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
}
);

module.exports = router;