const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) =>{

        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provide"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

});

const vaildNote =(req,res,next) => {
    const {title, content, category } = req.body
if (!title || title.trim().length < 3) 
{
throw new ApiError("title must be at least 3 characters", 400);
} 
if (!content || content.trim().length < 3) 

{

throw new ApiError("content is required", 400);

}
if (!category || category.trim().length < 3) 

{

throw new ApiError("category", 400);

} 
next();

};

module.exports = {protect , vaildNote };