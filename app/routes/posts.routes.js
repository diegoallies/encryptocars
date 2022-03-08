const express = require('express')
const router = express.Router()
const post = require('../models/posts')
const verifyToken = require('../middleware/auth.jwt')

router.get('/', async (req, res) => {
   try {
    const posts = await post.find()
    res.json(posts)
   } catch (err) {
    res.status(500).json({ message: err.message })
   }
})

router.get('/:id', getpost , (req, res) => {
    res.json(res.post)
})

router.post('/',verifyToken, async (req, res) => {
    const posts = new post({
        postText: req.body.postText,
        img: req.body.img,
       created_by: req.userId
    })
    try{
        const newpost = await posts.save()
        res.status(201).json(newpost)
    } catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id',[getpost,verifyToken], async (req, res) => {

    if( res.post.created_by != req.userId){
        return res.status(401).send({ message: "Unauthorized!" });
    }
    if(req.body.postText !=null){
        res.post.postText =  req.body.postText
    }
    if(req.body.img !=null){
        res.post.img =  req.body.img
    }
    
    try{
        const updatedpost = await res.post.save()
        res.json(updatedpost)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id',[getpost,verifyToken], async (req, res) => {
    try{
        if( res.post.created_by != req.userId){
            return res.status(401).send({ message: "Unauthorized!" });
        }
        await res.post.remove()
        res.json({ message:'Deleted post'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}) 

async function getpost  (req, res, next){
    let post
   try{
       post = await post.findById(req.params.id)
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