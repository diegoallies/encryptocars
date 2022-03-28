const express = require('express')
const router = express.Router()
const Post = require('../models/posts')
const User = require('../models/users')
const verifyToken = require('../middleware/auth.jwt')

router.get('/', async (req, res) => {
   try {
    const posts = await Post.find()
    res.json(posts)
   } catch (err) {
    res.status(500).json({ message: err.message })
   }
})

router.get('/:id', getPost , (req, res) => {
    res.json(res.post)
})

router.post('/',verifyToken, async (req, res) => {
  
    const post = new Post({
        title: req.body.title,
        img: req.body.img,
        fullname: req.body.fullname,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,


       created_by: req.userId

    
    })
    try{
        const newPost = await post.save()
        res.status(201).json(newPost)
    } catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id',[getPost,verifyToken], async (req, res) => {
    if( res.post.created_by != req.userId){
        return res.status(401).send({ message: "Unauthorized!" });
    }
    if(req.body.title !=null){
        res.post.title =  req.body.title
    }
    if(req.body.price !=null){
        res.post.price =  req.body.price
    }
    if(req.body.description !=null){
        res.post.description =  req.body.description
    }
    if(req.body.category !=null){
        res.post.category =  req.body.category
    }
    if(req.body.img !=null){
        res.post.img =  req.body.img
    }
    
    try{
        const updatedPost = await res.post.save()
        res.json(updatedPost)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id',[getPost,verifyToken], async (req, res) => {
    try{
        if( res.post.created_by != req.userId){
            return res.status(401).send({ message: "Unauthorized!" });
        }
        await res.post.remove()
        res.json({ message:'Deleted Post'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}) 

async function getPost  (req, res, next){
    let post
   try{
       post = await Post.findById(req.params.id)
      if(post == null){
          return res.status(404).json({ message:'Cannot find post' })
      } 
   } catch (err) {
       return res.status(500).json({ message: err.message })
   }

   res.post = post
   next()
}


module.exports = router