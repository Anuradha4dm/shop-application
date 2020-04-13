module.exports=(req,res,next)=>{

    if(!req.session.isEnable){

        return res.redirect('/log-in');

    }

    next();

}