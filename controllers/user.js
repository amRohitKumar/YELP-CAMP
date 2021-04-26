const User = require('../models/user');

module.exports.registerUserForm = (req, res) => {
    res.render('user/register');
}

module.exports.registerUser = async (req, res) => {
    // ROUTE FOR REGISTRATION OF NEW USER
    try {
        const {username, email, password} = req.body;
        const newUser = new User({email: email, username: username});
        const registerUser = await User.register(newUser, password);
        // console.log(registerUser);n 
        req.login(registerUser, err => {
            if(err){
                return next(err);
            }
            req.flash('success', 'Welcome to Yelp-Camp');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('user/login');
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome Back');
    const rediredtUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(rediredtUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'GoodBye !');
    res.redirect('/campgrounds');
}