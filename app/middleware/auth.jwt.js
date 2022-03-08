const post = require('../models/posts')
 
getPost =  async (req, res, next) => {
   let post
  try{
      post = await post.findById(req.params.id)
     if(post == null){
         return res.status(404).json({ message:'This post could not be found' })
     } 
  } catch (err) {
      return res.status(500).json({ message: err.message })
  }

  res.post = post
  next()
}

module.exports = getPost