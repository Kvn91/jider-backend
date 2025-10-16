const { default: mongoose } = require("mongoose");
const Scenario = require("../models/Scenario");

// @desc Get all scenarios
// @route GET /scenarios
// @access Private
const getAllScenarios = async (req, res) => {
  const scenarios = await Scenario.find().lean();
  res.json(scenarios);
};

// @desc Get one scenario
// @route GET /scenarios/:scenarioId
// @access Private
const getScenario = async (req, res) => {
  const _id = req?.params?.scenarioId;
  if (!_id)
    return res.status(400).json({ message: "Le paramètre ID est requis" });

  if (!mongoose.isValidObjectId(_id))
    return res
      .status(400)
      .json({ message: "Le paramètre ID n'est pas au bon format" });

  const scenario = await Scenario.findOne({ _id }).exec();
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
  const { title, description } = req.body;

  if (!title) errors.push("Le titre est requis");
  if (!description) errors.push("La description est requise");

  if (errors.length > 0) return res.status(400).json({ errors });

  const scenario = await Scenario.create({
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
  const { scenarioId: _id, title, description } = req.body;
  if (!_id)
    return res.status(400).json({ message: "Le paramètre ID est requis" });

  if (!mongoose.isValidObjectId(_id))
    return res
      .status(400)
      .json({ message: "Le paramètre ID n'est pas au bon format" });

  const scenario = await Scenario.findOne({ _id }).exec();
  if (!scenario)
    return res.status(404).json({ message: `Scénario ${_id} introuvable` });

  if (title) scenario.title = title;
  if (description) scenario.description = description;

  await scenario.save();

  res.json("Scénario mis à jour");
};

// @desc Delete a scenario
// @route DELETE /scenarios/:scenarioId
// @access Private
const deleteScenario = async (req, res) => {
  const _id = req?.params?.scenarioId;
  console.log("delete scenario id", _id);
  if (!_id)
    return res.status(400).json({ message: "Le paramètre ID est requis" });

  if (!mongoose.isValidObjectId(_id))
    return res
      .status(400)
      .json({ message: "Le paramètre ID n'est pas au bon format" });

  const scenario = await Scenario.findOne({ _id }).exec();
  if (!scenario)
    return res.status(404).json({ message: `Scénario ${_id} introuvable` });

  await scenario.deleteOne();

  res.json("Scénario supprimé !");
};

// @desc Add a character to a scenario
// @route POST /scenarios/characters
// @access Private
const addCharacter = async (req, res) => {
  let errors = [];
  const { scenarioId, name, description } = req.body;

  if (!scenarioId) errors.push("Un ID scénario est requis");
  if (!name) errors.push("Le nom est requis");
  if (!description) errors.push("La description est requise");

  if (!mongoose.isValidObjectId(scenarioId))
    errors.push("Le paramètre ID n'est pas au bon format");

  if (errors.length > 0) return res.status(400).json({ errors });

  const scenario = await Scenario.findOne({ _id: scenarioId }).exec();
  if (!scenario) errors.push(`Scénario ${scenarioId} introuvable`);

  await scenario.characters.push({
    name,
    description,
  });

  await scenario.save();

  res.json("Personnage ajouté au scénario");
};

// @desc Delete a character
// @route DELETE /scenarios/characters
// @access Private
const removeCharacter = async (req, res) => {
  let errors = [];
  const { scenarioId, characterId } = req.body;

  if (!scenarioId) errors.push("Un ID scénario est requis");
  if (!characterId) errors.push("Un ID personnage est requis");

  if (
    !mongoose.isValidObjectId(scenarioId) ||
    !mongoose.isValidObjectId(characterId)
  )
    errors.push("Le paramètre ID n'est pas au bon format");

  const scenario = await Scenario.findOne({ _id: scenarioId }).exec();
  if (!scenario) errors.push(`Scénario ${scenarioId} introuvable`);

  const character = await Scenario.findOne({ _id: characterId }).exec();
  if (!character) errors.push(`Personnage ${characterId} introuvable`);

  if (errors.length > 0) return res.status(400).json({ errors });

  await scenario.characters.id(characterId).deleteOne();
  await scenario.save();

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
