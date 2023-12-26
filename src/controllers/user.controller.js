import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating tokens")
    }
}


// USER REGISTER

const userRegister = asyncHandler(async (req, res) => {

    // 1: get user details from frontend
    // 2: validation - not empty
    // 3: check if user already exists: username, email
    // 4: check for images, check for avatar
    // 5: upload them to cloudinary, avatar
    // 6: create user object - create entry in db
    // 7: remove password and refresh token field from response
    // 8: check for user creation
    // 9: return res


    // 1: get user details from frontend
    const { fullName, email, username, password } = req.body
    // console.log("email: ", email);


    // 2: validation - not empty
    if ([fullName, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    // 3: check if user already exists: username, email
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with this email or username is already exist")
    }


    console.log(req.files);
    // 4: check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }


    // 5: upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }


    // 6: create user object - create entry in db
    const user = await User.create({
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase()
    })


    // 7: remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    // 8: check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    // 9: return res

    //  return res.status(201).json({createdUser})
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


})


// USER LOGIN

const userLogin = asyncHandler(async (req, res) => {

    // 1: req body -> data 
    // 2: check username or email both is not match
    // 3: find user by email or username
    // 4: user is not exist by no one username or email
    // 5: password check
    // 6: access and refresh token
    // 7: remove password and refreshtoken
    // 8: send cookie and response


    // 1: req body -> data 
    const { email, username, password } = req.body

     // 2: check username or email both is not match
    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    // 3: find user by email or username
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    // 4: user is not exist by no one username or email
    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    // 5: password check
    const isValidPassword = await user.isPasswordCorrect(password)

    if (!isValidPassword) {
        throw new ApiError(401, "invalid credentials")
    }

    // 6: access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user_id)


    // 7: remove password and refreshtoken
    const loggedInUser = await User.findById(user_id).select("-password -refreshToken")


    // 8: send cookie and response
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .staus(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, refreshToken, accessToken
            },
            "User logged In Successfully"
        )
    )
       
})


//   USER LOGOUT

const userLogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearcookie("accessToken", options)
    .clearcookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"))
})

export { userRegister, userLogin, userLogout }