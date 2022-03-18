const express = require('express') ; 
const { Category } = require('../models/Category');

const router = express.Router() ; 

router.get('/' , async (req,res) => {
    const categoryList = await Category.find() ; 

    if(!categoryList){
        res.status(500).json({success : false})
    }

    res.send(categoryList) ; 

})

router.put('/:id', async (req,res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id , 
        {
            name : req.body.name ,
            icon: req.body.icon  , 
            color : req.body.color 
        }
    )
    if(!category){
        res.status(500).json({success : false , message:"The category is not available "}) ; 
    }

    res.status(200).send(category) ; 
})

router.get('/:id',async (req,res) => {
    const category = await Category.findById(req.params.id) 

    if(!category){
        res.status(500).json({success : false , message:"The category is not available "}) ; 
    }

    res.status(200).send(category) ; 

})

router.post('/' , async(req,res) => {
    const category = new Category({
        name : req.body.name , 
        icon : req.body.icon , 
        color : req.body.color , 
    })
    category = await category.save() ; 

    if(!category){
        return res.status(404).send('The category cannot be created ') ; 
    }
    res.send(category) ; 
})
router.delete('/:id',(req,res) => {
    Category.findByIdAndRemove(req.params.id)
            .then(category => {
                if(category){
                    return res.status(200).json({success : true , message:"The category is delted "}) ; 
                }
                else{ 
                    return res.status(404).json({success : false , message : "The category cannot be found "}) ; 
                }
            })
            .catch((err) => {
                console.log("There is some error !!!!!!") ; 
            })
})


module.exports = router ; 