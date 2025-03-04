import { Strategy as LocalStrategy } from 'passport-local';
import {User} from './models/Users.js';

export default function (passport) {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                const user = await User.findOne({ username });
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        // done(null, user.username);
        done(null, { username: user.username });
    });

    passport.deserializeUser(async (user, done) => {
        try {
            const foundUser = await User.findOne({ username: user.username });
            done(null, foundUser);
            // const user = await User.findById(username);
            // done(null, user);
        } catch (err) {
            done(err);
        }
    });
};


// export default function passportConfig(passport) {
//         passport.use(new LocalStrategy(
//             async (username, password, done) => {
//                 try {              
//                     const user = await User.findOne({ username });
//                     if (!user) {
//                       return done(null, false, { message: 'Incorrect username.' });
//                     }
              
//                     const isMatch = await user.comparePassword(password);
//                     if (!isMatch) {
//                       console.log('Password mismatch');
//                       return done(null, false, { message: 'Incorrect password.' });
//                     }
//                     return done(null, user);
//                   } catch (err) {
//                     // console.error('Error caught in strategy:', err);
//                     // return done(null, false, { message: 'Internal server error.' });
//                     return done(err);
//                   }
//                 // try {
//                 //     const user = await User.findOne({ username });
//                 //     if (!user) {
//                 //         return done(null, false, { message: 'Incorrect username.' });
//                 //     }
//                 //     const isMatch = await user.comparePassword(password);
//                 //     if (!isMatch) {
//                 //         return done(null, false, { message: 'Incorrect password.' });
//                 //     }
//                 //     return done(null, user);
//                 // } catch (err) {
//                 //     return done(err);
//                 // }
//             }
//         ));
    
//         passport.serializeUser((user, done) => {
//             done(null, user.id);
//         });
    
//         passport.deserializeUser(async (id, done) => {
//             try {
//                 const user = await User.findById(id);
//                 done(null, user);
//             } catch (err) {
//                 done(err);
//             }
//         });

// };

// passport.use(new LocalStrategy(
//     async (username, password, done) => {
//     //   try {
//         const user = await User.findOne({ username: username }).exec();
//         console.log(user);
//         // if (!user) {
//         //     console.log('User not found');
//         // //   return done(null, false, { message: 'Incorrect username.' });
//         // }
  
//         // const isValid = await bcrypt.compare(password, user.password);
//         // if (!isValid) {
//         //     console.log('Password incorrect');
//         // //   return done(null, false, { message: 'Incorrect password.' });
//         // }
  
//         return done( user);
//     //   } catch (err) {
//     //     return done(err);
//     //   }
//     }
//   ));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });
