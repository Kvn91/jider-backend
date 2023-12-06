const Scenario = require('../models/Scenario');

const getAllScenarios = async (req, res) => {
    const scenarios = await Scenario.find().exec();
    if (!scenarios) return res.status(204).json({ message: "No scenarios found !" });

    res.json(scenarios);
}

const getScenario = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ message: "ID is required" });

    const scenario = await Scenario.findOne({_id: req.params.id}).exec();
    if (!scenario) return res.status(204).json({ message: `Scenario ${req.params.id} not found`});

    res.json(scenario);
}

const createScenario = async (req, res) => {
    let errors = [];
    if (!req?.body?.name) errors.push('Name is required');
    if (!req?.body?.description) errors.push('Description is required');
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const result = await Scenario.create({
            name: req.body.name,
            description: req.body.description
        })

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
    }
}

const updateScenario = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ message: "ID is required" });

    const scenario = await Scenario.findOne({_id: req.body.id}).exec();
    if (!scenario) return res.status(204).json({ message: `Scenario ${req.body.id} not found`});
        
    if (req.body.name) scenario.name = req.body.name;
    if (req.body.description) scenario.description = req.body.description;
    const result = await scenario.save();

    res.json(result );
}

const deleteScenario = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ message: "ID is required" });
    
    const scenario = await Scenario.findOne({_id: req.body.id}).exec();
    if (!scenario) return res.status(204).json({ message: `Scenario ${req.body.id} not found`});

    const result = await Scenario.deleteOne({ _id: req.body.id });
    res.json(result);
}

module.exports = {
    getAllScenarios,
    getScenario,
    createScenario,
    updateScenario,
    deleteScenario
}