const express = require('express');
const User = require('../models/user.js');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async(req, res,next) => {
    const id = req.params.id;
    try{
        const user = await User.findOne({where:{id: req.user.id}});
        if(user){
            await user.addFollowings([parseInt(req.params.id, 10), 3,4]);
            res.send('success');
        } else{
            res.status(404).send('no user');
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
})


module.exports = router;