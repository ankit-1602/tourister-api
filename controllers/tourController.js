const { request } = require('express')
const { findByIdAndDelete } = require('.././models/tourModel')
const Tour=require('.././models/tourModel')
const catchAsync=require('../utils/catchAsync')
const AppError=require('../utils/appError')
const factory=require('./handlerFactory')

exports.aliasTopTours=(req,res,next)=>{
    req.query.limit=5
    req.query.sort='-ratingsAverage,price'
    req.query.fields='name,price,ratingsAverage,summary,difficulty'
    next()
}

exports.getAllTours = factory.getAll(Tour)
exports.getTour     = factory.getOne(Tour,{path:'reviews'});
exports.createTour  = factory.createOne(Tour);
exports.updateTour  = factory.updateOne(Tour);
exports.deleteTour  = factory.deleteOne(Tour);

exports.getTourStats=catchAsync(async (req,res,next)=>{
        const stats= await Tour.aggregate([
            {
                $match: { 
                    ratingsAverage: { 
                        $gte : 4.5 
                    } 
                }
            },
            {
                $group: {
                    _id:'$difficulty',
                    nums: { $sum: 1},
                    numsRating: { $sum: '$ratingsQuantity'},
                    avgRatings: { $avg: '$ratingsAverage'},
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort:{avgPrice:1}
            },
            {
                $match:{
                    _id:{$ne:'EASY'}
                }
            }
        ])

        res.status(200).json({
            status:"Success",
            data:{
                stats
            }
        })
})

exports.getMonthlyPlan=catchAsync(async (req,res,next) => {
        const year=req.params.year * 1
        const plan=await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match: {
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates'},
                    numTourStart:{ $sum:1 },
                    tours:{$push:'$name'}
                }
            },
            {
                $addFields:{month:'$_id'}
            },
            {
                $project:{
                    _id:0
                }
            },
            {
                $sort:{numTourStart:-1}
            },
            {
                $limit:6
            }
        ])

        res.status(200).json({
            status:"success",
            result:plan.length,
            data:{
                plan
            }
        })
})

exports.getToursWithin = catchAsync(async (req,res,next)=>{
    const {distance,latlng,unit}=req.params;
    const [lat,lng]=latlng.split(',')

    const radius=unit==='mi'? distance / 3963.2 :distance / 6378.1 ;//radius of the earth in miles
    if(!lat || !lng){
        return next(new AppError('Please provide latitude and longitude in the format lat,lng.',400));
    }

    const tours=await Tour.find({
        startLocation:{
            $geoWithin: {
                $centerSphere: [[lng,lat],radius]
            }
        }
    })
    console.log(distance,lat,lng,unit)

    res.status(200).json({
        status:"success",
        results:tours.length,
        data:{
            data:tours
        }
    })
})

exports.getDistances = async (req,res,next)=>{
    const {latlng,unit}=req.params;
    const [lat,lng] = latlng.split(',')
    
    const multiplier= unit === 'mi' ? 0.00062137 : 0.001;

    if(!lat || !lng){
        return next(new AppError(
            'Please provide latitude and longitude in the format lat,lng',
            400
        ))
    }

    const distances=await Tour.aggregate([
        {
            $geoNear:{
                near: {
                    type: 'Point',
                    coordinates: [lng*1,lat*1]
                },
                distanceField:'distance',
                distanceMultiplier:0.001
            }
        },
        {
            $project:{
                distance:1,
                name:1
            }
        }
    ])

    res.status(200).json({
        status:'success',
        data:{
            data:distances
        }
    })
}