const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.jwt");
const User = require('../models/users');
const Post = require('../models/posts');
const Cart = require("../models/cart");
var ObjectId = require('mongodb').ObjectId;

router.get("/", auth, async (req, res, next) => {
  try {
    const cart = await Cart.find({ user_id: { $regex: req.userId } });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/:id", [auth, getProduct], async (req, res, next) => {

  let post_id = res.post._id;
  let title = res.post.title;
  let description = res.post.description;
  let category = res.post.category;
  let img = res.post.img;
  let price = res.post.price;
  let quantity = req.body;
  let user_id = req.user._id;
  const carts = new Cart({

   post_id,
   title,
   category,
   description,
   img,
   price ,
   quantity,
   user_id,
  })
  try {
    carts.cart.push({
    
      post_id,
      title,
      category,
      description,
      img,
      price,
      quantity,

    });
    const updatedCart = await carts.save();
    res.status(201).json(updatedCart);
  } catch (error) {
    res.status(500).json(console.log(error));
  }
});

router.delete('/single', auth, async(req, res, next)=>{

  try {
    const id = req.body
    const cart = await Cart.findByIdAndDelete({_id : ObjectId(id)});
    res.json({ message: "Deleted cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.delete("/", auth, async (req, res, next) => {
  try {
    const cart = await Cart.deleteMany({ user_id: { $regex: req.user._id } });
    res.json({ message: "Deleted cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getProduct  (req, res, next){
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

module.exports = router;