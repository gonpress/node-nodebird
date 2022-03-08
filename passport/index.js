const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () =>{
    passport.serializeUser((user, done) => {

        // 세션에 user 의 id만 저장하는 행위
        // 메모리가 한정되어있기 때문에 id만 저장 함
        // 실무에서는 메모리에도 저장하면 안되고 메모리용 DB를 만들고 그 DB에 저장해야 함
        done(null, user.id);
    });

    // deserializeUser
    // user id를 이용해서 DB에서 계정정보를 다시 불러오는 함수
    passport.deserializeUser((id,done)=>{
        User.findOne({
            where:{id},
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
            },{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',
            }],
        })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
    kakao();
};