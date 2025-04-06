const express=require('express')
const fs=require('fs')
const Subscription = require('./../Models/Subscription')
const UserSubscription=require('./../Models/userSubscription')
const { fail } = require('assert')

exports.getAllSubscription=async(req,res)=>{
    try{
        const subscriptions=await Subscription.find()
        res.status(200).json({
            status:'success',
            data:{
                subscriptions:subscriptions
            }
        })
    }catch{
        res.status(404).json({
            status:'fail',
            data:{
                message:'No subscription found'
            }
        })
    }
}
exports.updateSubecription=async(req,res)=>{
    try{
        const id=req.params.id
        const updatedSubscription=await Subscription.findByIdAndUpdate(id,req.body,{new:true,
            runValidators:true})
        
        res.status(200).json({
            status:'success',
            data:{
                updatedSubscription:updatedSubscription
            }
        })

    }catch{
        res.status(404).json({
            status:'fail',
            data:{
                message:'No subscription found'
            }
        })
    }
}
exports.deleteSubscription=async(req,res)=>{
    try{
        const id=req.params.id
        await Subscription.findByIdAndDelete(id)
        res.status(204).json({
            status:'success',
            data:{
                message:'Subscription deleted successfully'
        }})

    }catch{
        res.status(404).json({
            status:fail,
            data:{
                message:'No subscription found'
            }
     })
    }
}
exports.addSubscription=async (req,res)=>{
    try{
        const subscription= await Subscription.create(req.body)
        res.status(201).json({  
            status:'success',
            data:{
                subscription:subscription
                }

        })

    }catch(error){
        response.status(400).json({
            "status": "failed",
            "Message": err
        })
    }
}
exports.getSubscriptionById=async(req,res)=>{
    try{
        const id=req.params.id
        const subscription=await Subscription.findById(id)
        res.status(204).json({
            status:'success',
            data:{
                subscription:subscription}})

    }catch{
        res.status(404).json({
            status:fail,
            data:{
                message:'No subscription found'
            }
     })
    }
}
const axios = require('axios')
exports.getCheckoutSession = async(req , res) => {
    try{
        const url = "https://api.sandbox.konnect.network/api/v2/payments/init-payment"

        const payload =  {
            receiverWalletId: process.env.WALLET_ID,
            amount : req.body.amount,
            description: req.body.description,
            acceptedPaymentMethods: ["e-DINAR"],
            successUrl: `http://localhost:3000/subPay?status=success&subId=${req.body.subId}`,
            failUrl: `http://localhost:3000/subPay?status=failed`,
        }

        const response = await fetch(url , {
            method: "POST",
            body: JSON.stringify(payload),
            headers:{
                'Content-Type': 'application/json',
                'x-api-key': process.env.API_KEY_KONNECT
            }
        })

        const resData = await response.json()

        res.status(200).json({
            status: 'success',
            result: resData
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.verify = async (req , res) => {

    try{
        console.log('jjjj')
        const id_payment = req.params.paymentId
        console.log(",,"+id_payment)
        const subId = req.query.subId
        const idUser = req.query.idUser
        const start_date = Date.now()
        // let end_date
        console.log('subId= ' + subId + 'idUser= ' + idUser)

        // const url = https://api.sandbox.konnect.network/api/v2/payments/${id_payment}

        const response = await fetch(`https://api.sandbox.konnect.network/api/v2/payments/${id_payment}`)

        const resData = await response.json()
        // console.log("nnn"+resData.transactions[0])
        console.log('woooooohhh '+resData.payment.transactions[0].status)
        console.log("hello" + resData.payment.transactions[0].status)
        if(resData.payment.transactions[0].status === "success"){

            const subscription = await Subscription.findById(subId)
            console.log("subscriptio \n")

            console.log(subscription)

        const end_date = new Date()

        if (subscription.subscriptionType === "daily") {
            // let end_date = new Date();
            end_date.setDate(end_date.getDate() + 1);
            console.log("end-date: " + end_date.toISOString());
        }
        if(subscription.subscriptionType=="weekly"){
            end_date.setDate(end_date.getDay()+7);
            console.log("end-date"+end_date)
        }
        if(subscription.subscriptionType.startsWith("monthly")){
            end_date.setMonth(end_date.getMonth() + 1);
            console.log("end date"+end_date)
        } 
              

            console.log('end_date = ' + end_date.toISOString())

            const userSub = {
                id_user: idUser,
                id_subscription: subId,
                start_date: start_date,
                end_date: end_date,
            }

            const newUserSub = await UserSubscription.create(userSub)

            res.status(200).json({
                status: 'success',
                newUserSub         
            })
        }
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}