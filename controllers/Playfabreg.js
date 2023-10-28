var playfab = require('playfab-sdk')
require('dotenv').config();
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
var PlayFabAdmin = playfab.PlayFabAdmin
PlayFab.settings.titleId = process.env.dbctitleid;
PlayFab.settings.developerSecretKey = process.env.dbcdeveloperkey;
const Users = require("../models/Users")
exports.register = async (req, res) => {
    const {username, password, email, refferer} = req.body

    const playFabUserData = {
        Username: username,
        DisplayName: username,
        Password: password,
        Email: email
    };

    PlayFabClient.RegisterPlayFabUser(playFabUserData, (error, result) => {
        if(result){
        PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
        PlayFabClient.ExecuteCloudScript({
            FunctionName: "FinishRegistration",
            FunctionParameter: {
                hashPassword: password,
                referrer: refferer
            },
            ExecuteCloudScript: true,
            GeneratePlayStreamEvent: true,
        }, async (error1, result1) => {
            if(result1.data.FunctionResult.message !== "success"){
                PlayFabAdmin.DeleteMasterPlayerAccount({PlayFabId: result.data.PlayFabId}, (error2, result2) => {
                    if(result2){
                        res.json({message: "failed", data: "There is a problem in registration of your account please try again"})
                    } else if (error2){
                        res.json({message: "Failed", data: error2.errorMessage})
                    }
                })
            } else if (error1){
                PlayFabAdmin.DeleteMasterPlayerAccount({PlayFabId: result.data.PlayFabId}, (error2, result2) => {
                    if(result2){
                        res.json({message: "failed", data: "There is a problem in registration of your account please try again"})
                    } else if (error2){
                        res.json({message: "Failed", data: error2.errorMessage})
                    }
                })

                res.json({message: "failed", data: error1.errorMessage})
            } else {
                res.json({message: "success" , data :  result.data.PlayFabId})
            }
        })
        } else if (error){
            res.json({message: "failed", data: error.errorMessage})
        }
    })
}
