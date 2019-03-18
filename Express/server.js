const express = require('express')
const bodyparser = require('body-parser')
const Sequelize = require('sequelize')
const app = express()
app.use(bodyparser.urlencoded({ extended: true }))
app.set("view engine", 'ejs')
app.set("views", 'views')
async function main(){

    const UserTableInstance = await ConnectDB();
    
    app.get("/", async (req, res) => {
    
        res.render('home')
    })
    app.get("/user/register", (req, res) => {
        res.render('register')
    })
    
    app.get("/user/login", (req, res) => {
        res.render('login')
    })
    
    app.post("/user/registered", (req, res) => {
        try {
            UserTableInstance.create({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            })
            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    })
    app.post("/user/logined", async (req, res) => {
        try {
         
            const { email, password } = req.body
            console.log("User type==",UserTableInstance)
            const logged = await UserTableInstance.findOne({ where: { email: email } })
            console.log(logged)
            if (password === logged.password) {
                res.render('view',{logged})
            } else {
                res.redirect('/');
            }
        }
        catch (error) {
            console.log(error)
        }
    })
   
  
    app.listen(3000)
}
main()
async function Createuser(sequelizeinstance) {
    const User = await sequelizeinstance.define('user', {
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        email: Sequelize.STRING
    });
    
    return User
}
async function ConnectDB() {
    const sequelizeinstance = new Sequelize('sdb', 'root', '', {
        host: 'localhost',
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
    sequelizeinstance.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            return
        });

    const UsrTbl =await Createuser(sequelizeinstance)

    sequelizeinstance.sync({ force: false })
        .then(() =>
            console.log("User Table created successfully")
        )
        
    return UsrTbl;
}