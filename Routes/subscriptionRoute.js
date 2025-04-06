const express=require('express')
const subscriptionController=require('./../Controllers/subscriptionController')
const subscriptionRouter=express.Router()
subscriptionRouter
    .route('/')
    .get(subscriptionController.getAllSubscription)
    .post(subscriptionController.addSubscription)

subscriptionRouter
    .route('/:id')
    .get(subscriptionController.deleteSubscription)
    .patch(subscriptionController.getSubscriptionById)
    .delete(subscriptionController.updateSubecription)
subscriptionRouter
    .post('/payment',subscriptionController.getCheckoutSession)
    .get('/verify/:paymentId',subscriptionController.verify)
module.exports =subscriptionRouter;