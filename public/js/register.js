// const nodemailer = require('nodemailer');

const progress = document.getElementById('progress');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

// const price = require('./plans.js');
// document.getElementById('plan').innerHTML = price;

const circles = document.querySelectorAll('.circle');

let currentActive = 1;

const page1= document.getElementById('page1');
const page2= document.getElementById('page2');
const page3= document.getElementById('page3');


next.addEventListener('click', async () => {
    currentActive++;
    if (currentActive > circles.length+1) {
        currentActive = circles.length+1;
    }
    if(currentActive === 2) {
        validateForm1();
    }
    if(currentActive === 2) {
         sendMailInfoServer()
        // sendmail();
    }
    if(currentActive === 3) {
       await checkOTP();
    }
    if(currentActive === 4) {
        validateForm3();
        registerUser();
    }
    if(currentActive === 5){
        await payment();
    }    

    update();
});

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateForm3() {
   const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const phone = document.getElementById('phone').value;

    let valid = true;
    if(firstname==='') {
        document.getElementById('firstname').style.borderColor = 'red';
        document.getElementById('firstname').style.borderWidth = '2px';
        document.getElementById('firstname').style.borderStyle = 'solid';
        document.getElementById('firstname').value = '';
        document.getElementById('firstname').style.backgroundColor = '#ffdddd';
        document.getElementById('firstname').placeholder = 'Firstname is required';
        valid = false;
    }
    if(lastname==='') {
        document.getElementById('lastname').style.borderColor = 'red';
        document.getElementById('lastname').style.borderWidth = '2px';
        document.getElementById('lastname').style.borderStyle = 'solid';
        document.getElementById('lastname').value = '';
        document.getElementById('lastname').style.backgroundColor = '#ffdddd';
        document.getElementById('lastname').placeholder = 'Lastname is required';
        valid = false;
    }
    if(phone==='') {
        document.getElementById('phone').style.borderColor = 'red';
        document.getElementById('phone').style.borderWidth = '2px';
        document.getElementById('phone').style.borderStyle = 'solid';
        document.getElementById('phone').value = '';
        document.getElementById('phone').style.backgroundColor = '#ffdddd';
        document.getElementById('phone').placeholder = 'Phone is required';
        valid = false;
    }
    else if(phone.length < 10) {
        document.getElementById('phone').style.borderColor = 'red';
        document.getElementById('phone').style.borderWidth = '2px';
        document.getElementById('phone').style.borderStyle = 'solid';
        document.getElementById('phone').value = '';
        document.getElementById('phone').style.backgroundColor = '#ffdddd';
        document.getElementById('phone').placeholder = 'Phone less than 10 digits';
        valid = false;
    }
    if(valid===false) 
    currentActive--;

    return valid;
}

function validateForm1() {
    const password = document.getElementById('pass').value;
    const cpassword = document.getElementById('cpass').value;
    const email = document.getElementById('email').value;
    let valid = true;

    if(email==='') {
        document.getElementById('email').style.borderColor = 'red';
        document.getElementById('email').style.borderWidth = '2px';
        document.getElementById('email').style.borderStyle = 'solid';
        document.getElementById('email').value = '';
        document.getElementById('email').placeholder = 'Email is required';
        valid = false;
    }
    else
    if(!isValidEmail(email)) {
        document.getElementById('email').style.borderColor = 'red';
        document.getElementById('email').style.borderWidth = '2px';
        document.getElementById('email').style.borderStyle = 'solid';
        document.getElementById('email').value = '';
        document.getElementById('email').style.backgroundColor = '#ffdddd';
        document.getElementById('email').placeholder = 'Invalid email';
        valid = false;
    }
    if(password !== cpassword){
        document.getElementById('pass').style.borderColor = 'red';
        document.getElementById('pass').style.borderWidth = '2px';
        document.getElementById('pass').style.borderStyle = 'solid';
        document.getElementById('cpass').style.borderColor = 'red';
        document.getElementById('cpass').style.borderWidth = '2px';
        document.getElementById('cpass').style.borderStyle = 'solid';
        document.getElementById('cpass').value = '';
        document.getElementById('pass').value = '';
        document.getElementById('cpass').style.backgroundColor = '#ffdddd';
        document.getElementById('pass').style.backgroundColor = '#ffdddd';
        document.getElementById('pass').placeholder = 'Password does not match';
        document.getElementById('cpass').placeholder = 'Password does not match';
        valid = false;
    }
    else
    if(password.length < 8){
        document.getElementById('pass').style.borderColor = 'red';
        document.getElementById('pass').style.borderWidth = '2px';
        document.getElementById('pass').style.borderStyle = 'solid';
        document.getElementById('cpass').style.borderColor = 'red';
        document.getElementById('cpass').style.borderWidth = '2px';
        document.getElementById('cpass').style.borderStyle = 'solid';
        document.getElementById('cpass').style.backgroundColor = '#ffdddd';
        document.getElementById('pass').style.backgroundColor = '#ffdddd';
        document.getElementById('pass').value = '';
        document.getElementById('cpass').value = '';
        document.getElementById('pass').placeholder = 'Password must be 8 characters or more';
        document.getElementById('cpass').placeholder = 'Password must be 8 characters or more';
        valid = false;
    }
    if(valid===false)
    currentActive--;

    return valid;
}

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'atmosadans@gmail.com',
//         pass: '}%#7z<nGK7%!W'
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

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
// async function sendmail() {
//      // send verification mail to user
//         const otp = generateOTP();
//     const email = document.getElementById('email').value;
//     const name = document.getElementById('firstname').value;
//      const mailOptions = {
//         from: 'Verify your email <akashyadav36437@gmail.com>',
//         to: email,
//         subject: 'Verify your email',
//         html: `<h1> Hi $(name)! <h1> <br> <h2>Thanks for registering on our website. </h2>
//         <h4>Your One Time Password (OTP) to verify your email and sign up on ATMOS is $(otp).</h4>
//         <h4>The OTP is valid for 30 minutes. For account safety, do not share your OTP with others.</h4>
//         <br><br>
//         <h4>Regards,</h4>
//         <h4>Team ATMOS.</h4>`
//     };

//     // Sending mail
//     transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     }); 

// }

async function registerUser() {
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const password = document.getElementById('pass').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const data = {
        firstname: firstname,
        lastname: lastname,
        password: password,
        email: email,
        phone: phone,
    }

    console.log(data);

    try{        
        const result = await fetch('/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}

        });

        const response = await result.json();
        console.log(response);
        if(response.user){
            // location.assign('/home');
        }

    }
    catch (err){
        console.log(err);
    }



    // const result = await fetch('/api/register', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // }).then(res => res.json())
    // .then(data => {
    //     if(data) {
    //         localStorage.setItem('user-info', JSON.stringify(data));
    //         console.log(data);
    //         window.location.replace('/home');
    //     }
    // }).catch(err => {
    //     console.log(err);
    // }
    // );
}   

prev.addEventListener('click', () => {
    currentActive--;
    if (currentActive < 1) {
        currentActive = 1;
    }
    update();
});

function update() {
    circles.forEach((circle, index) => {
        if(index < currentActive) {
            circle.classList.add('active');
        }
        else {
            circle.classList.remove('active');
        }

    });
    const actives = document.querySelectorAll('.active');
    progress.style.width = `${(actives.length-1) * 35}%`;
    // page.style.left= `${(actives.length-1) * -25}%`;
    const page = document.getElementsByClassName('page');
    for(let i = 0; i < page.length; i++) {
        page[i].style.left = `${(actives.length-1) * -25}%`;
    }

    if (currentActive === circles.length+1) {
        next.disabled=true;
    }
    else  
    if(currentActive === 1) {
        prev.disabled=true;
    }
    else{
        next.disabled=false;
        prev.disabled=false;
    }

}

function onlyNumberKey(evt) {
          
    // Only ASCII character in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}

async function checkOTP(){

    const otp = document.getElementById('otp').value;
    const email = document.getElementById('email').value;
    const data = {
        otp: otp,
        email: email
    }
    console.log(data);
    try{        
        const result = await fetch('/checkOTP', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });

        const response = await result.json();
        console.log(response);
        if(!response.message){
            document.getElementById('otp').style.borderColor = 'red';
            document.getElementById('otp').style.borderWidth = '2px';
            document.getElementById('otp').style.borderStyle = 'solid';
            document.getElementById('otp').value = '';
            document.getElementById('otp').style.backgroundColor = '#ffdddd';
            document.getElementById('otp').placeholder = 'Invalid OTP';
            console.log(--currentActive);
        }

    }
    catch (err){
        console.log(err);
    }

}

async function sendMailInfoServer(){
    const email = document.getElementById('email').value;
    const name = document.getElementById('firstname').value;

    console.log(email,name);
    const  data = await fetch('/sendmail', {
        method: 'POST',
        headers: {"Content-type":"application/json"},
        body: JSON.stringify({email,name})
    })
    .then((result) => {});
}

async function payment() {
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            items: [
                { id: 1, quantity: 1 }
            ],
        }),
    })
    .then(res => {
        if (res.ok) return res.json()
        return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
        // console.log(url)
        window.location = url
            // console.log(url);
    })
    .catch(err => {
        console.error(err.error)
    })
}