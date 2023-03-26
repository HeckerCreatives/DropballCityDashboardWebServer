const Role = require("../models/Roles");

// entity/
exports.browse = (req, res) =>
  Role.find()
    .then(items => res.json(items))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:name/find
exports.find = (req, res) =>
  Role.findOne({ name: req.params.name })
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/update
exports.update = (req, res) =>
  Role.findByIdAndUpdate(req.params.id, req.body)
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/migration
exports.migrate = (req, res) => {
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

  res.json("Role migration created");
};
