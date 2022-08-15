const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const otpModel = require('../models/otpModel');



const handleError = (err) => {
    console.log(err.message, err.code);

    let errors = {email: '', password: ''};

    if(err.message === 'incorrect email'){
        errors.email = 'Email-id not registered';
        return errors;
    }

    if(err.message === 'incorrect password'){
        errors.password = 'Wrong Password';
        return errors;
    }
}



const maxAge = 3*24*60*60;
const createToken = (id) => {
    return jwt.sign({id}, 'ATMOS', {
        expiresIn: maxAge
    });
}




module.exports.register_get = (req,res) =>{
    res.render('register');
}


module.exports.logout_get = (req,res) =>{
    res.cookie('jwt', 'loggedout', {
        maxAge: 1,
        httpOnly: true
    });
    res.redirect('/login');
}



module.exports.register_post = async (req,res) =>{
    console.log('hello signup');

    console.log(req.body);

    const data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
    };

    try{
        const user = await User.create({...data});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});

       
        res.status(201).json({user: user._id});
    }
    catch (err){
        console.log(err);
        res.status(400).json({err});
    }
}
module.exports.login_get = (req,res) =>{
    res.render('login');
}
module.exports.login_post = async (req,res) =>{
    const {email, password} = req.body;

    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user._id});
        
    }
    catch(err){
        const errors = handleError(err);
        res.status(400).json({errors});
    }
}




var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'atmosadans@gmail.com',
        pass: '}%#7z<nGK7%!W'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Hi Akash,

// Your One Time Password (OTP) to sign up on CoinDCX is 084135. The OTP is valid for 30 minutes. For account safety, do not share your OTP with others.

// Regards,
// Team CoinDCX.

// Function to generate OTP
function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

// Sending OTP through mail for verification
async function sendmail(email,name) {
     // send verification mail to user
        const otp = generateOTP();
  
     const mailOptions = {
        from: 'Verify your email <atmosadans@gmail.com>',
        to: email,
        subject: 'Verify your email',
        html: `<h1> Hi ` + name+`! <h1> <br> <h2>Thanks for registering on our website. </h2>
        <h4>Your One Time Password (OTP) to verify your email and sign up on ATMOS is `+otp+`.</h4>
        <h4>The OTP is valid for 30 minutes. For account safety, do not share your OTP with others.</h4>
        <br><br>
        <h4>Regards,</h4>
        <h4>Team ATMOS.</h4>`
    };

    // Sending mail
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    }); 

    // Saving OTP in database
    const userOTP = await otpModel.create({email: email, otp: otp});

}


module.exports.send_the_mail = async (req,res) =>{

    const {email, name} = req.body;
    console.log(email, name);
    await sendmail(email,name);
}


module.exports.check_the_otp = async (req,res) =>{
    const {email,otp} = req.body;

    const userOTP = await otpModel.findOne({email})
    .then((result) => {
        console.log(result);
        if(result.otp === otp){
            console.log('OTP Matched');
            res.json({message: true});
        }
        else{
            console.log('OTP Not Matched');
            res.json({message: false});
        }
    });   

}

// Integrate Order API on server
module.exports.create_the_order = async (req,res) =>{
    console.log('Create OrderID request', req.body);
    var options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "rcp1"
      };
      instance.orders.create(options, function(err, order) {
        console.log(order);
        res.json(order);
      });
}
const storeItems = new Map([
    [1, { price: 100, name: "Basic" }],
    [2, { price: 6600, name: "Standard" }],
    [3, { price: 9900, name: "Enterprise" }],
])

module.exports.create_the_checkout_session = async (req,res) =>{
    console.log('Create Checkout Session request', req.body);
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.price
                    },
                    quantity: item.quantity
                }
            }),

            success_url: `${process.env.SERVER_URL}/home`,
            cancel_url: `${process.env.SERVER_URL}/cancel`
        })
        console.log(session)
        res.json({ url: session.url })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
