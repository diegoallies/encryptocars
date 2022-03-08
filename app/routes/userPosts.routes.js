const express = require('express')
const verifyToken = require('../middleware/auth.jwt')
const User = require('../models/user')
const post = require('../models/post')
const getpost = require('../middleware/getpost')
const router = express.Router();
const jwt = require('jsonwebtoken')

router.get("/", [verifyToken, getUser], (req, res) => {
    return res.send(res.user.userPost);
  });
  
router.post("/:id", [verifyToken, getUser],  async (req, res) =>{
  let post = await post.findById(req.params.id).lean()
  let qty = req.body.qty
  let userPost = req.userPost
  let added = false;
  userPost.forEach(item =>{
    if(item._id.valueOf() == post._id.valueOf()){
      item.qty += qty
      added = true
    }
  })

  if(!added){
    userPost.push({...post, qty});
  }
  try {
    res.user.userPost = userPost

    let token = jwt.sign({ _id:  req.userId, userPost: res.user.userPost }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 86400 // 24 hours
    });
    const updatedUser = await res.user.save();
    res.status(200).json({ updatedUser,token})
  } catch (error) {
    console.log(error)
  }
});

router.delete("/", [verifyToken, getUser], async (req, res) => {
    try{
        res.user.userPost = []

        await res.user.save()
        res.json({ message:'Item Cleared'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

router.delete("/:id", [verifyToken, getUser], async (req, res) => {
  let userPost = req.userPost;
  userPost.forEach((userPostitem) => {
    if (userPostitem._id == req.params.id) {
      userPost = userPost.filter((userPostitems) => userPostitems._id != req.params.id);
    }
  });
  try {
    res.user.userPost = userPost;

    const updated = res.user.save();
    let token = jwt.sign({ _id: req.userId, userPost }, process.env.ACCESSTOKEN, {
      expiresIn: 86400, // 24 hours
    });
    res.json({ message: "post Deleted ", updated, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", [verifyToken, getpost], async (req, res) => {
  const user = await User.findById(req.userId);
  const inuserPost = user.userPost.some((prod) => prod._id == req.params._id);
  
    let updatedUser;
    if (inuserPost) {
      const post = user.userPost.find((prod) => prod._id == req.params._id);
      post.qty += req.body.qty;
      updatedUser = await user.save();
    } else {
      user.userPost.push({ ...res.post, qty: req.body.qty });
      updatedUser = await user.save();
    }
    try {

      console.log(updatedUser,process.env.ACCESS_TOKEN_SECRET)
      const acces_token = jwt.sign(
        JSON.stringify(updatedUser),
        process.env.ACCESS_TOKEN_SECRET
      );
      
      res.status(201).json({ jwt: acces_token, userPost: updatedUser.userPost });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }); 

async function getUser(req, res, next) {
    let user
   try{
       user = await User.findById(req.userId)
      if(user == null){
          return res.status(404).json({ message:'User Not Found' })
      } 
   } catch (err) {
       return res.status(500).json({ message: err.message })
   }

   res.user = user
   next()
}



module.exports = router;

