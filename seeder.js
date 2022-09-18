const mongoose = require('mongoose');
const Type = require('./backend/models/typeModel')
const User = require('./backend/models/userModel')
const UserType = require('./backend/models/userTypeModel')
const Otp = require('./backend/models/otpModel')
const Review = require('./backend/models/reviewModel')
const dotenv = require('dotenv').config();
const bcrypt = require("bcryptjs");

mongoose.connect(process.env.MONGO_URI ,{
    useNewUrlParser: true , useUnifiedTopology: true
}).then(() =>{
    console.log(`MongoDb connected`)
})
.catch ((error) => {
    console.log(error)
    process.exit(1)
});

const seedTypes = [
    {
        name:'admin',
        level:'5'
    },
    {
        name:'general',
        level:'2'
    },
    {
        name:'moderator',
        level:'3'
    }
]

const seedDB = async  ()  => {
    //delete existing tables
    await Otp.deleteMany({});
    await Review.deleteMany({});
    await UserType.deleteMany({});
    await Type.deleteMany({});
    await User.deleteMany({});

    //insert data in tables
    await Type.insertMany(seedTypes)

    //hashing the password
    const salt = await bcrypt.genSalt(10)

    const user = await User.create({
        name : 'Ssekalegga Brian',
        email: '',
        phone: '+256783159235',
        username:'lebronbrian23',
        password: await bcrypt.hash('keepkeep' ,salt),
        verified:'yes',
        is_account_active:'yes',
        bio:'I built this',

    });

    const admin = await Type.findOne({name:'admin'})

    await UserType.create({
        type_id:admin._id,
        user_id:user._id
    })

}

seedDB().then(() =>{
    mongoose.connection.close();
})
