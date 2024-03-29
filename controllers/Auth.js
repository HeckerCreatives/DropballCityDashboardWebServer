const User = require("../models/Users"),
  Wallets = require("../models/Wallets"),
  generateToken = require("../config/generateToken"),
  bcrypt = require("bcryptjs"),
  fs = require("fs");
  const jwt = require("jsonwebtoken");
  
const generategameToken = () => 
  jwt.sign({ message: "titimalaki" }, process.env.JWT_SECRET);

  

const encrypt = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// entity/login
exports.login = (req, res) => {
  const { email, password } = req.query;

  User.findOne({ $or: [{ email }, { username: email }] })
    .then(async user => {
      if (user && (await user.matchPassword(password))) {
        if (user.deletedAt) {
          res.json({ error: "Your account has been banned" });
        } else {
          let userData = await User.findById({ _id: user._id })
            .select("-password")
            .populate({
              path: "roleId",
              select: "display_name name",
            });
          userData.token = generateToken(userData._id);
          res.json(userData);
        }
      } else {
        res.json({ error: "E-mail and Password does not match." });
      }
    })
    .catch(error => res.status(400).json({ error: error.message }));
};

// entity/save
exports.save = (req, res) => {
  const {email, username} = req.body;

  User.findOne({ $or: [{ email: email }, { username: username }] })
  .then(user => {

    if(user){
      return res.json({message: "fail", data: "Account already exsist"})
    }
    
    User.create(req.body)
    .then(async user => {
      await Wallets.create({
        userId: user._id,
        amount: 0,
        commission: 0,
      })
      res.json({message: `${user._id} saved successfully`, data: user})
    })
    .catch(error => res.status(400).json({ error: error.message }));

  })
  .catch(error => res.status(400).json({ error: error.message })); 
}
  
    
exports.update = (req, res) =>
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(item => res.json(item))
      .catch(error => res.status(400).json({ error: error.message }));

// entity/injectPassword
exports.injectPassword = (req, res) => {
  User.findById(req.params.id)
    .then(async user => {
      User.findByIdAndUpdate(user._id, {
        password: await encrypt(req.body.password),
      }).then(user => {
        res.json(user);
      });
    })
    .catch(error => res.status(400).json({ error: error.message }));
};

// entity/changepassword
exports.changePassword = (req, res) => {
  const { email, password, oldPassword } = req.body;

  User.findOne({ email })
    .then(async user => {
      if (user && (await user.matchPassword(oldPassword))) {
        if (user.deletedAt) {
          res.json({ expired: "Your account has been banned" });
        } else {
          let newPassword = await encrypt(password);
          User.findByIdAndUpdate(user._id, { password: newPassword }).then(
            user => {
              res.json(user);
            }
          );
        }
      } else {
        res.json({ error: "E-mail and Password does not match." });
      }
    })
    .catch(error => res.status(400).json({ error: error.message }));
};

exports.file = (req, res) => {
  const { path, base64, name } = req.body;
  let url = `./assets/${path}`;
  if (!fs.existsSync(url)) {
    fs.mkdirSync(url, { recursive: true });
  }
  try {
    let filename = `${url}/${name}`;
    fs.writeFileSync(filename, base64, "base64");
    return res
      .status(200)
      .json({ success: true, message: "Successfully Uploaded." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.gentoken = (req, res) => {
  
  try {
    const token = generategameToken();
    res.json(token)
  } catch (error){
    res.json({error: error.message})
  }
  
}