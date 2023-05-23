const express = require('express');
const passport = require('passport');
const session = require('express-session');
const router = express.Router();
const path = require('path');


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

// Google認証のための設定
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
  new GoogleStrategy({
    clientID: '350844007784-v8gg3pe57r7q4p8579i1jb9i7beuca3g.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8080/auth/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // ユーザーの識別情報を検証する
    if (profile.emails[0].value === 'aiueominato1111@gmail.com') {
      // 許可されたユーザーのみを認証する
      return done(null, profile);
    } else {
      // 許可されていないユーザーの場合はエラーを返す
      return done(new Error('Access denied'),profile);
    }
  }
)
);

// 認証ルートのハンドラー
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 認証コールバックのハンドラー
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // 認証成功時の処理
    const filePath = path.join("home","ito","web","logs","access.log");
    res.sendFile(filePath); // リダイレクト先を適切な場所に変更してください
  }
);

router.use((err, req, res, next) => {
  // エラーメッセージをログに出力などの処理を行う
  console.error(err);

  // エラーに応じたリダイレクト処理などを行う
  res.redirect('/');
});
  

module.exports = router;