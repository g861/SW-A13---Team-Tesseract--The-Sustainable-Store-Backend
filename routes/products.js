const express = require('express');
const { Category } = require('../models/Category');
const { Product } = require('../models/product') ; 
const router = express.Router() ; 
const mongoose = require('mongoose') ; 
const multer = require('multer') ; 

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});
const uploadOptions = multer({ storage: storage })



router.get('/', async (req,res)=>{

    let filter = {};

    if(req.query.categories){
         filter = {category : req.query.categories.split(',')}
    }

    const productList = await Product.find({ filter }).populate('category') ;
    if(!productList){
        res.status(500).json({success : false})
    } 
    res.send(productList) ; 
})

router.get('/:id',async (req,res) => {
    const product = await Product.findById(req.params.id).populate('category') ; 
    if(!product){
        res.status(500).json({msg : "Error Occoured in finding the product id"})
    }
    res.send(product) ; 
})
// Updating a product

router.put('/:id' , uploadOptions.single('image') , async (req,res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Id') ; 
    }
          const category = await Category.findById(req.body.category) ; 
        if(!category){
            return res.status(400).json({msg:"Sending wrong category"}) ; 
        }

        const productName = await Product.findById(req.params.id) ; 
        if(!productName)  res.status(400).send('Invalid Product Id') ; 

        const file = req.file ; 
        let imagepath ;
        if(file){
            const fileName = req.file.filename ; 
            const basePath = `${req.protocol}://${req.get('host')}/public/upload/` ; 
            imagepath =  `${basePath}${fileName}`  ; 
        } else { 
            imagepath = product.image ; 
        }
    const product = await Product.findByIdAndUpdate(
        req.params.id , 
        {
            name : req.body.name ,
            description: req.body.description ,
            richDescription: req.body.richDescription ,
            image: imagepath,
            brand: req.body.brand ,
            price: req.body.price ,
            category: req.body.category,
            countInStock: req.body.countInStock ,
            rating: req.body.rating ,
            numReviews: req.body.numReviews ,
            isFeatured: req.body.isFeatured ,
        },
        {new : true}
    )
        if(!product){
        res.status(500).json({msg : "Error Occoured in finding the product id"})
    }
    res.send(product) ; 
})

router.post('/', uploadOptions.single('image') ,  async (req,res)=>{
      const category = await Category.findById(req.body.category) ; 
        if(!category){
            return res.status(400).json({msg:"Sending wrong category"}) ; 
        }

        const file = req.file ; 
        if(!file) return res.status(400).send("No image in the request") ; 

        const fileName = req.file.filename ; 
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/` ; 
        let product =  new Product({
            name : req.body.name ,
            description: req.body.description ,
            richDescription: req.body.richDescription ,
                image: `${basePath}${fileName}` ,
            brand: req.body.brand ,
            price: req.body.price ,
            category: req.body.category,
            countInStock: req.body.countInStock ,
            rating: req.body.rating ,
            numReviews: req.body.numReviews ,
            isFeatured: req.body.isFeatured ,
        })
        product  = await product.save()  
                                .then(() => {
                                    res.send(product) ; 
                                })
                                .catch((err) => {
                                    console.log("There is some error") ; 
                                })
})

router.get('/get/count' , async(req,res) => {
    const productCount =  Product.countDocuments((count) => {
        count
    })
    try{
    if(!productCount){
        res.status(500).json({success:false})
    }
    res.send({
        ProductCount : productCount
    })
    }
    catch(err){
        res.send(err)
    }
})

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);

    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send(products);
});

router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }
        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}${file.filename}`);
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            { new: true }
        );

        if (!product)
            return res.status(500).send('the gallery cannot be updated!');

        res.send(product);
    }
);



module.exports = router ; 