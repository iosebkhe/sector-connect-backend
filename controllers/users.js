const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({}).populate("sectors");

    response.json(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/', async (request, response, next) => {
  const { username, sectors, agreedToTerms } = request.body;

  const user = new User({
    username: username,
    sectors: sectors,
    agreedToTerms: agreedToTerms
  });

  try {
    const savedUser = await user.save();

    const populatedUser = await savedUser.populate('sectors');

    response.status(201).json(populatedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id;
  const { username, sectors, agreedToTerms } = request.body;

  const user = new User({
    username: username,
    sectors: sectors,
    agreedToTerms: agreedToTerms
  });

  try {
    const savedUser = await User.findByIdAndUpdate(id, user, { new: true, runValidators: true, context: "query" }).populate("sectors");

    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/", async (request, response, next) => {
  try {
    await User.deleteMany({});
    response.status(201).json({ message: "all users deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;