import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";

// Registering a new User
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    username,                    // username is email
    password: hashedPass,
  });

  const user = await UserModel.find({username: username});
  if (!user.includes(username)) {
    try {
      const existingUser = await UserModel.findOne({ username });
  
      if (!existingUser) {
        await newUser.save();
        res.status(200).json(newUser);
      } else {
        res.status(400).json({ message: "User already exists" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid input" });
  }
};


// login User

export const loginUser = async (req, res) => {
    const {username, password} = req.body

    try {
        const user = await UserModel.findOne({username: username})


        if(user)
        {
            const validity = await bcrypt.compare(password, user.password)


            validity? res.status(200).json(user): res.status(400).json("Wrong Password")
        }
        else{
            res.status(404).json("User does not exists")
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}