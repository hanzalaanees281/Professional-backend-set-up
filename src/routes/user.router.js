import { Router } from "express";
import { changedCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, refreshAccessToken, updateAccountDetails, updateUserAvatar, updateUserCoverImage, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1        
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    userRegister
)

router.route("/login").post(userLogin)

//secured route
router.route("/logout").post(verifyJWT, userLogout)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changedCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-accountDetails").patch(verifyJWT, updateAccountDetails)

router.route("/avatar-change").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/change-coverImage").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watchHistory").get(verifyJWT, getWatchHistory)

export default router