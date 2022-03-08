const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
 const {isLoggedIn, isNotLoggedIn} = require('./middleware');
const router = express.Router();

router.post('/join', isNotLoggedIn, async(req, res,next) => {
    const { email, nick, password } = req.body;

    try{
        const exUser = await User.findOne({where: {email}});

        if(exUser){
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);

        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    }catch (e) {
        console.error(e);
        return next(e);
    }
})

router.post('/login', isNotLoggedIn, async(req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?loginError=${info.message}`);
        }

        // res.login -> passport/index.js -> serializeUser
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }

            // 여기서 세션 쿠키를 브라우저로 보내 줌

            return res.redirect('/');
        })
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) =>{
    res.redirect('/');
})

module.exports = router;