const Scenario = require("../models/Scenario");

// @desc Get all scenarios
// @route GET /scenarios
// @access Private
const getAllScenarios = async (req, res) => {
  const scenarios = await Scenario.find().lean();
  res.json(scenarios);
};

// @desc Get one scenario
// @route GET /scenarios/:id
// @access Private
const getScenario = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Le paramètre ID est requis" });
  if (!Number.isInteger(Number(req.params.id)))
    return res
      .status(400)
      .json({ message: "Le paramètre ID est au mauvais format" });

  // @TODO use "_id"
  // const scenario = await Scenario.findOne({_id: req.params.id}).exec();
  const scenario = await Scenario.findOne({ id: req.params.id }).exec();
  if (!scenario)
    return res
      .status(404)
      .json({ message: `Scénario ${req.params.id} introuvable` });

  res.json(scenario);
};

// @desc Create a scenario
// @route POST /scenarios
// @access Private
const createScenario = async (req, res) => {
  let errors = [];

  if (!req?.body?.id) errors.push("Un ID est requis");
  if (!req?.body?.title) errors.push("Le titre est requis");
  if (!req?.body?.description) errors.push("La description est requise");

  if (errors.length > 0) return res.status(400).json({ errors });

  const scenario = await Scenario.create({
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
  });

  if (scenario) {
    return res.status(201).json(scenario);
  } else {
    return res.status(400).json({ message: "Données de scénario invalides" });
  }
};

// @desc Update a scenario
// @route PUT /scenarios
// @access Private
const updateScenario = async (req, res) => {
  const { id, title, description } = req.body;
  if (!id)
    return res.status(400).json({ message: "Le paramètre ID est requis" });

  const scenario = await Scenario.findOne({ id }).exec();
  if (!scenario)
    return res.status(404).json({ message: `Scénario ${id} introuvable` });

  if (title) scenario.title = title;
  if (description) scenario.description = description;

  await scenario.save();

  res.json("Scénario mis à jour");
};

// @desc Delete a scenario
// @route DELETE /scenarios/id
// @access Private
const deleteScenario = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Le paramètre ID est requis" });

  // @TODO use "_id"
  // const scenario = await Scenario.findOne({_id: req.params.id}).exec();
  const scenario = await Scenario.findOne({ id: req.params.id }).exec();
  if (!scenario)
    return res
      .status(404)
      .json({ message: `Scénario ${scenarioId} introuvable` });

  await scenario.deleteOne();

  res.json("Scénario supprimé !");
};

// @desc Add a character to a scenario
// @route POST /scenarios/characters
// @access Private
const addCharacter = async (req, res) => {
  let errors = [];

  if (!req?.body?.scenarioId) errors.push("Un ID scénario est requis");
  if (!req?.body?.characterId) errors.push("Un ID personnage est requis");
  if (!req?.body?.name) errors.push("Le nom est requis");
  if (!req?.body?.description) errors.push("La description est requise");

  if (errors.length > 0) return res.status(400).json({ errors });

  const scenario = await Scenario.findOne({ id: req.body.scenarioId }).exec();
  if (!scenario)
    return res
      .status(404)
      .json({ message: `Scénario ${scenarioId} introuvable` });

  await scenario.characters.push({
    id: req.body.characterId,
    name: req.body.name,
    description: req.body.description,
  });

  await scenario.save();

  res.json("Personnage ajouté au scénario");
};

// @desc Delete a character
// @route DELETE /scenarios/characters
// @access Private
const removeCharacter = async (req, res) => {
  let errors = [];

  if (!req?.body?.scenarioId) errors.push("Un ID scénario est requis");
  if (!req?.body?.characterId) errors.push("Un ID personnage est requis");

  if (errors.length > 0) return res.status(400).json({ errors });

  const scenario = await Scenario.findOne({ id: req.body.scenarioId }).exec();
  if (!scenario)
    return res
      .status(404)
      .json({ message: `Scénario ${req.body.scenarioId} introuvable` });

  const character = await scenario.characters.id(req.body.characterId);
  if (!character)
    return res
      .status(404)
      .json({ message: `Personnage ${req.body.characterId} introuvable` });

  await scenario.characters.id(req.body.characterId).deleteOne();

  res.json("Personnage supprimé !");
};

module.exports = {
  getAllScenarios,
  getScenario,
  createScenario,
  updateScenario,
  deleteScenario,
  addCharacter,
  removeCharacter,
};
