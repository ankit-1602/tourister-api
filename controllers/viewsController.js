const Tour=require('./../models/tourModel')
const catchAsync=require('./../utils/catchAsync')

exports.getOverview=catchAsync(async(req,res)=>{
    // 1.Get Tour data from Collection
    const tours=await Tour.find()
    // 2.Build Template

    // 3.Render that Template using Tour data from 1.
    res.status(200).render('overview',{
        title : 'All Tours',
        tours
    });
})


exports.getTour=catchAsync(async(req,res)=>{
    // 1. Get the data for the requested tour(including reviews & Tour)
    const tour=await Tour.findOne({slug:req.params.slug}).populate({
        path:'reviews',
        fields:'review ratings user'
    })
    // 2. Build Template

    // 3. Render Template using data from 1
    res.status(200).render('tour',{
        title : `${tour.name} Tour`,
        tour
    });
})


