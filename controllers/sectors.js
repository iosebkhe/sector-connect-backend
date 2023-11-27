// const jwt = require("jsonwebtoken");
const sectorsRouter = require("express").Router();
const Sector = require("../models/sector");

// get all sectors
sectorsRouter.get('/', async (request, response, next) => {
  try {
    // Get all sectors
    const allSectors = await Sector.find();

    // Organize sectors into a map for easier access
    const sectorsMap = new Map();
    allSectors.forEach(sector => {
      sectorsMap.set(sector.id, {
        id: sector.id,
        name: sector.name,
        value: sector.value,
        parentSector: sector.parentSector,
        children: []
      });
    });

    // Build the hierarchical tree structure
    let rootSectors = [];
    sectorsMap.forEach(sector => {
      const parentSectorId = sector.parentSector ? sector.parentSector.toString() : null;
      if (parentSectorId && sectorsMap.has(parentSectorId)) {
        sectorsMap.get(parentSectorId).children.push(sector);
      } else {
        rootSectors.push(sector);
      }
    });

    // Send the root sectors as JSON response
    response.json(rootSectors);
  } catch (error) {
    next(error);
  }
});


// get one sector with id
sectorsRouter.get("/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const sector = await Sector.findById(id);
    if (sector) {
      response.json(sector);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

// add new sector
sectorsRouter.post('/', async (request, response, next) => {
  const { name, value, parentSector, children } = request.body;

  const sector = new Sector({
    name: name,
    value: value,
    parentSector: parentSector || null,
    children: children || []
  });

  try {
    const savedSector = await sector.save();

    response.status(201).json(savedSector);
  } catch (error) {
    next(error);
  }
});

// delete a sector by id
sectorsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id;
  try {
    await Sector.findByIdAndDelete(id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

// update a sector by id
sectorsRouter.put('/:id', async (request, response, next) => {
  const { content, important } = request.body;
  const id = request.params.id;

  const sector = {
    content: content,
    important: important,
  };

  try {
    const sectorToUpdate = await Sector.findByIdAndUpdate(id, sector, { new: true, runValidators: true, context: "query" });
    response.status(201).json(sectorToUpdate);
  } catch (error) {
    next(error);
  }
});

module.exports = sectorsRouter;