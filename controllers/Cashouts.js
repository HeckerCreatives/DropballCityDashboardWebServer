const Cashouts = require("../models/Cashouts");

// entity/
exports.browse = (req, res) =>
  Cashouts.find()
    .then(items => res.json(items.filter(item => !item.deletedAt)))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/to
exports.to = (req, res) =>
  Cashouts.find()
    .byTo(req.query.key)
    .populate({
      path: "from",
      select: "username",
    })
    .populate({
      path: "to",
      select: "username",
    })
    .then(items => res.json(items.filter(item => !item.deletedAt)))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:userId/find
exports.find = (req, res) =>
  Cashouts.find()
    .byFrom(req.params.userId)
    .populate({
      path: "from",
      select: "username",
    })
    .populate({
      path: "to",
      select: "username",
    })
    .then(items => res.json(items.filter(item => !item.deletedAt)))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/save
exports.save = (req, res) =>
  Cashouts.create(req.body)
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/update
exports.update = (req, res) =>
  Cashouts.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));

// entity/:id/destroy
exports.destroy = (req, res) =>
  Cashouts.findByIdAndUpdate(req.params.id, {
    deletedAt: new Date().toLocaleString(),
  })
    .then(() => res.json(req.params.id))
    .catch(error => res.status(400).json({ error: error.message }));
