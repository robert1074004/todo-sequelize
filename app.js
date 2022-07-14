const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const routes = require('./routes')
const usePassport = require('./config/passport')
const flash = require('connect-flash')
const app = express()
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


app.engine('hbs',exphbs({defaultLayout:'main',extname:'.hbs'}))
app.set('view engine','hbs')
app.use(session({
    secret:'ThisIsMySecret',
    resave:false,
    saveUninitialized:true
}))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

usePassport(app)

app.use(flash())

app.use((req,res,next) => {
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.user = req.user
    res.locals.error = req.session.messages
    res.locals.success_msg = req.flash('success_msg')
    res.locals.warning_msg = req.flash('warning_msg')
    next()
})

app.use(routes)


app.listen(process.env.PORT,() => {
    console.log(`App is running on http://localhost:${process.env.PORT}`)
})