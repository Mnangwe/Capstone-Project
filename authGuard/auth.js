const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) res.status(401).send({ msg:'Failed Authorization' })

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
    if(err) res.status(403).send({ msg:'Token is not valid!' })
    req.user = user
    next()
  })
}

const verifyAuthorization = (req, res, next) => {
    authenticateToken(req,res,() => {
        if(req.user._id === req.params.id || req.user.isAdmin){
            next()
        }else {
            res.status(403).json({msg: "You not allowed"})
        }
    })
}

const verifyAdmin = (req, res, next) => {
    authenticateToken(req,res,() => {
        if(req.user.isAdmin){
            next()
        }else {
            res.status(403).json({msg: "You not allowed"})
        }
    })
}

module.exports = { 
    authenticateToken, 
    verifyAuthorization, 
    verifyAdmin 
};