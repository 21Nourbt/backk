const express=require('express')
const fs=require('fs')
const TablePaiement=require('../Models/TablePayment')
const Table=require('./../Models/Table')
exports.addBooking = async (req, res) => {
    try {
        
        const table = await Table.findOneAndUpdate(
            { numTable: req.body.numTable }, 
            { status: "occupied" }, 
            { new: true } // Returns the updated document
        );

        if (!table) {
            return res.status(404).json({
                status: 'error',
                message: 'Table not found'
            });
        }

        // Create the booking
        const tablepaiement = await TablePaiement.create({
            check_in: req.body.check_in,
            check_out: req.body.check_out,
            date: new Date(),
            id_user: req.body.id_user,
            numTable: req.body.numTable,
            price: req.body.price,
            paymentMethod:req.body.paymentMethod
        });

        console.log(tablepaiement);

        res.status(201).json({
            status: 'success',
            message: 'Booking added successfully',
            table: table,
            booking: tablepaiement
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'An error occurred'
        });
    }
};
exports.getall=async(req,res)=>{
    try{
        const tablepaiements= await TablePaiement.find()
        res.status(200).json({
            status:'success',
            data:tablepaiements
        })

    }catch(error){
        res.status(404).json(
            {
                status:'error',
                message:"error uuuu "
                })
    }
}

exports.getCheckoutSession = async(req , res) => {
    try{
        const url = "https://api.sandbox.konnect.network/api/v2/payments/init-payment"
        const payload =  {
            receiverWalletId: process.env.WALLET_ID,
            amount : req.body.amount,
            description: req.body.description,
            acceptedPaymentMethods: ["e-DINAR"],
            successUrl: `http://localhost:3000/payment?start_time=${req.query.start_time}&end_time=${req.query.end_time}&numTable=${req.query.numTable}`,
            failUrl: `http://localhost:3000/payment?start_time=${req.query.start_time}&end_time=${req.query.end_time}&numTable=${req.query.numTable}`,
    

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

        res.json({
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
        const id_payment = req.params.id
        // const url = https://api.sandbox.konnect.network/api/v2/payments/${id_payment}

        const response = await fetch(`https://api.sandbox.konnect.network/api/v2/payments/${id_payment}`)

        const resData = await response.json()

        res.json({
            // status: 'success', 
            resData
        })
    }catch(err){
        res.json(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getHistory=async(req,res)=>{
    try{
        const history= await TablePaiement.find({id_user:req.params.id})

        if(!hist){
            res.json(404).json({
                status:'fail',
                message:'no booking Histroy find'
            })
        }
        res.status(200).json({
            status:'success',
            history:history
        })
    }catch(error){
        res.status(400).json({
            status:'fail',
            message:error
        })

    }

}
exports.getHistory = async (req, res) => {
    try {
        const history = await TablePaiement.find({ id_user: req.params.id });
        console.log("hhhhh"+history)
        console.log("ffffffff")
        if (!history || history.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No payment history found for this user'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                history: history
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message // It's better to send error.message rather than the whole error object
        });
    }
};