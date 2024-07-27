import passport from "passport";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async () => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
        console.log("serializeUser", user);
    });
    

    passport.deserializeUser(async (id, done) => {
        console.log("deserializeUser");
        try {
            const user = await User.findById(id);
            done(null, user);
        }
        catch (error) {
            done(error);
        }
    });

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const user = await
                User.findOne({ username });
                if (!user) {
                    throw new Error("Invalid username or password");
                }

                const validPassword = await bcrypt.compare(password, user.password);

                if (!validPassword) {
                    throw new Error("Invalid username or password");
                }
                return done(null, user);
            }
            catch (error) {
                done(error);
            }
        }
));
}

