import { body } from "express-validator";

export const registerValidation = [
    // email validation rule
    body("email").isEmail().withMessage("Please provide a valid email address."),
    // password must be at least 8 characters long 
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long."),
    // fullName must be at least 8 characters long 
    body("fullName").isLength({ min: 5 }).withMessage("Full name should contain at least 5 names."), 
        // avatarUrl validation optional
    body("avatarUrl").optional().isURL(),
];

export const loginValidation = [
    // email validation rule
    body("email").isEmail().withMessage("Please provide a valid email address."),
    // password must be at least 8 characters long 
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long."),
];

export const postCreateValidation = [
    body('title', 'Title is required').isLength({ min: 3 }).isString(),
    body('text', 'Text is required').isLength({ min: 6}).isString(),
    body('tags', 'Tags format example: tag1,tag2').isString(),
    body('imageUrl', 'Image URL must be in the correct format ').isString(),
];