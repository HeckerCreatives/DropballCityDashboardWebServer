const Users = require("../models/Users")
const Wallets = require("../models/Wallets")
const Role = require("../models/Roles");
exports.migrateuser = (req, res) =>{
    const defaultuser = [
        {
            _id: "64509236c095ab4c201cd862",
            email: "dropballcity.services@gmail.com",
            playfabId: "B43E595ED9BB06B9",
            roleId: "629a98a5a881575c013b5325",
            username: "dropballcityadmin",
            password: "b68k1Ddn4cw",
            verified: true,
            isApproved: true
        },
        {
            _id: "647625f790bfb88673bc0774",
            email: "gold1@gmail.com",
            playfabId: "2440FEBBB63D0512",
            roleId: "629a98a5a881575c013b5326",
            referrerId: "64509236c095ab4c201cd862",
            username: "gold1",
            password: "dev123",
            verified: true,
            isApproved: true
        },
        {
          _id: "65369d2a7624f2d2733bc2ec",
          email: "dropballgold@gmail.com",
          roleId: "629a98a5a881575c013b5326",
          referrerId: "64509236c095ab4c201cd862",
          username: "dropballgold",
          password: "dev123",
          verified: false,
          refLimit: 500,
          isApproved: true,
        }
    ]

    defaultuser.map(users => {
        Users.create(users)
    })

    const wallets = [
        {
            _id: "6450930b69622f8f6382d3a7",
            userId: "64509236c095ab4c201cd862",
            amount: 0,
            initial: 0,
            commission: 0,
            pot: 0,
            tong: 0
        },
        {
            _id: "6476260b90bfb88673bc077f",
            userId: "647625f790bfb88673bc0774",
            amount: 0,
        },
        {
          _id: "65369d407624f2d2733bc2f2",
          userId: "65369d2a7624f2d2733bc2ec",
          amount: 0,
        },
    ]

    wallets.map(wallet => {
        Wallets.create(wallet)
    })

    const roles = [
        {
          _id: "629a98a5a881575c013b5325",
          display_name: "Administrator",
          name: "admin",
        },
        {
          _id: "629a98a5a881575c013b5326",
          display_name: "Gold Agent",
          name: "gold",
        },
        {
          _id: "629a98a5a881575c013b5327",
          display_name: "Silver Agent",
          name: "silver",
        },
        {
          _id: "629a98a5a881575c013b5328",
          display_name: "Player",
          name: "player",
        },
      ];
      roles.map(role => {
        Role.create(role);
      });

    res.json("Admin and Gold data and wallet and role migration created");
}