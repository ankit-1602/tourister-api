const express=require('express')
const router=express.Router()

const viewController=require('./../controllers/viewsController')

router.get('/',(req,res)=>{
    res.status(200).render('base',{
        tour : 'The Forest Hiker',
        user : 'Jonas'
    });
})

router.get('/overview',viewController.getOverview)
router.get('/tour/:slug',viewController.getTour)

module.exports=router;