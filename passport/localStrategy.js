const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
    }, async(email, password, done) => {
        try{
            const exUser = await User.findOne({where: { email }});
            if(exUser){
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null, exUser);
                } else{
                    done(null, false, {message:'비밀번호가 일치하지 않습니다.'});
                }
            } else{
                done(null, false, {message:'가입되지 않은 회원입니다.'});
            }
        } catch (e) {
            console.error(e);
            done(e);
        }
    }));
};

// done의 구조
// 1 : 서버에러
// 2 : 성공했을때 넘길 값(계정정보)
// 3 : 실패했을때 메세지